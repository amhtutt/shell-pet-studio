#!/usr/bin/env python3
"""Turn the source PNGs in art/ into compact badge layers in svg/art/assets.ts.

Every layer is placed into one shared frame (the master image's 1024px canvas), cropped to the creature's box and
saved as a small WebP. The renderer then only has to stack images with identical x/y/width/height.

    python3 -m venv .venv && .venv/bin/pip install pillow numpy scipy
    .venv/bin/python scripts/build-art.py
"""
import argparse
import base64
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label
from scipy.spatial import ConvexHull

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "art"
OUT = ROOT / "svg" / "art" / "assets.ts"

# Creature box in master pixels, and the size each layer is saved at (1.5px per badge unit).
BOX = (40, 180, 1000, 860)
UNIT = 4  # master pixels per badge unit -> the frame is 240 x 170 units
SAVE_W = 360
QUALITY = 78

# Measured transforms (scale, dx, dy) that map each source image into the master frame.
CRAB = (1.135, -63, -24)  # shell-less crabs (celebrating sits 10px higher, so its own dy)
CRAB_DY = {"celebrating": -14}
SHELL = (1.07, -114, -53)  # generic-shell canvas -> master
# Per-shell fit into the generic-shell canvas (language shells came out at different sizes).
FITS = {
    "spiral": (1, 0, 0), "round": (1, 0, 0), "conch": (1, -47, 0), "cone": (1, -47, 0),
    "typescript": (0.93, 44, 12), "javascript": (1.043, -12, -27), "python": (0.97, 30, 22),
    "rust": (0.946, 37, -5), "go": (0.891, 64, 6), "java": (0.808, 128, 68), "cpp": (0.85, 60, 40),
    "ruby": (0.817, 96, 78), "swift": (0.937, 24, -11), "bash": (0.862, 43, 86),
}
GENERIC = ["spiral", "round", "conch", "cone"]
MOODS = ["happy", "celebrating", "grateful", "curious", "anxious", "lonely", "sleepy"]
BLINKS = ["grateful", "curious", "anxious", "lonely", "sleepy"]
EYES = (680, 330, 960, 520)  # eye area in the shell-less crab's own pixels

# Body colors: must match lib/traits.ts. Coral is the source color of the art.
BODY = {
    "coral": "#F2734F", "teal": "#3EBFB4", "lilac": "#B08ED9", "mint": "#8ED39A", "peach": "#F8A06A",
    "sky": "#6BB8EC", "sand": "#CFA77C", "rose": "#F07C93", "shiny": "#2E5592",
}
INTERIOR = (58, 40, 34)


# ---------- image helpers ----------

def load(name):
    return Image.open(ART / f"{name}.png").convert("RGBA")


def place(img, s, dx, dy):
    """Scale an image about its top-left corner, then shift it; result is a 1024x1024 canvas."""
    n = round(img.width * s)
    big = img.resize((n, round(img.height * s)), Image.LANCZOS)
    out = Image.new(img.mode, (1024, 1024))
    src = big.crop((max(-dx, 0), max(-dy, 0), max(-dx, 0) + 1024, max(-dy, 0) + 1024))
    out.paste(src, (max(dx, 0), max(dy, 0)))
    return out


def crab_frame(img, mood):
    s, dx, dy = CRAB
    return place(img, s, dx, CRAB_DY.get(mood, dy))


def shell_frame(img, name):
    return place(place(img, *FITS[name]), *SHELL)


def webp(img, width=None, quality=QUALITY):
    if width and img.width != width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=quality, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def layer(img):
    """Crop a master-frame canvas to the creature box and encode it."""
    return webp(img.crop(BOX), SAVE_W)


def to_units(x, y):
    return round((x - BOX[0]) / UNIT, 1), round((y - BOX[1]) / UNIT, 1)


def alpha(img, t=40):
    return np.asarray(img)[..., 3] > t


def grow(m, r):
    """Dilate a mask by about r/2 pixels."""
    return distance_transform_edt(~m) <= r / 2


def shrink(m, r):
    """Erode a mask by about r/2 pixels."""
    return distance_transform_edt(m) > r / 2


# ---------- recolor ----------

def rgb_to_hsl(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    l = (mx + mn) / 2
    d = mx - mn
    s = np.where(d == 0, 0, d / np.maximum(1 - np.abs(2 * l - 1), 1e-6))
    h = np.zeros_like(l)
    nz = d > 0
    rm = nz & (mx == r)
    gm = nz & (mx == g) & ~rm
    bm = nz & ~rm & ~gm
    h[rm] = ((g - b)[rm] / d[rm]) % 6
    h[gm] = (b - r)[gm] / d[gm] + 2
    h[bm] = (r - g)[bm] / d[bm] + 4
    return h * 60, np.clip(s, 0, 1), l


def hsl_to_rgb(h, s, l):
    c = (1 - np.abs(2 * l - 1)) * s
    x = c * (1 - np.abs((h / 60) % 2 - 1))
    m = l - c / 2
    z = np.zeros_like(h)
    sec = (h // 60).astype(int) % 6
    r = np.select([sec == 0, sec == 1, sec == 2, sec == 3, sec == 4], [c, x, z, z, x], c)
    g = np.select([sec == 0, sec == 1, sec == 2, sec == 3, sec == 4], [x, c, c, x, z], z)
    b = np.select([sec == 0, sec == 1, sec == 2, sec == 3, sec == 4], [z, z, x, c, c], x)
    return np.stack([r + m, g + m, b + m], -1)


def hex_hsl(hx):
    a = np.array([[[int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]]])
    h, s, l = rgb_to_hsl(a)
    return float(h[0, 0]), float(s[0, 0]), float(l[0, 0])


H0, S0, L0 = hex_hsl(BODY["coral"])


def recolor(img, target):
    """Shift only the coral body pixels to the target body color, keeping their light and shadow."""
    if target == BODY["coral"]:
        return img
    a = np.asarray(img).astype(float) / 255
    rgb = a[..., :3]
    h, s, l = rgb_to_hsl(rgb)
    ht, st, lt = hex_hsl(target)
    hue_ok = (h <= 26) | (h >= 348)
    w = hue_ok * np.clip((s - 0.35) / 0.25, 0, 1) * np.clip((0.79 - l) / 0.05, 0, 1) * (l > 0.16)
    dh = ((h - H0 + 180) % 360) - 180
    nh = (ht + dh) % 360
    ns = np.clip(s * st / S0, 0, 1)
    nl = np.clip(l + (lt - L0) * np.clip(l / L0, 0, 1), 0, 1)
    new = hsl_to_rgb(nh, ns, nl)
    out = rgb * (1 - w[..., None]) + new * w[..., None]
    res = np.concatenate([out, a[..., 3:]], -1)
    return Image.fromarray((res * 255).round().astype(np.uint8))


# ---------- pieces ----------

def crab_layers():
    crabs, blinks = {}, {}
    ex0, ey0, ex1, ey1 = EYES
    s, dx, dy = CRAB
    eye_box = (round(ex0 * s + dx), round(ey0 * s + dy), round(ex1 * s + dx), round(ey1 * s + dy))
    for mood in MOODS:
        src = load(f"crab-{mood}")
        crabs[mood] = {c: layer(crab_frame(recolor(src, hx), mood)) for c, hx in BODY.items()}
        if mood in BLINKS:
            blink = load(f"crab-{mood}-blink")
            out = {}
            for c, hx in BODY.items():
                full = crab_frame(recolor(blink, hx), mood)
                patch = full.crop(eye_box)
                out[c] = webp(patch, round(patch.width * SAVE_W / (BOX[2] - BOX[0])))
            blinks[mood] = out
    bx, by = to_units(eye_box[0], eye_box[1])
    return crabs, blinks, {"x": bx, "y": by, "w": round((eye_box[2] - eye_box[0]) / UNIT, 1),
                           "h": round((eye_box[3] - eye_box[1]) / UNIT, 1)}


def gap_backing(shell_img, crab_masks):
    """Dark fill for slivers between shell and crab back, drawn behind the crab."""
    s = alpha(shell_img)
    gap = np.zeros_like(s)
    for c in crab_masks:
        u = s | c
        gap |= shrink(grow(u, 45), 45) & ~u & grow(s, 25)
    gap = grow(gap, 5)
    a = np.zeros((1024, 1024, 4), np.uint8)
    a[gap] = (*INTERIOR, 255)
    return Image.fromarray(a)


def decoration_slots(shell_img, n=8):
    """Spread-out points on the visible shell surface, away from its dark opening and edges."""
    a = np.asarray(shell_img).astype(int)
    m = (a[..., 3] > 200) & (a[..., :3].max(-1) > 110)
    m = shrink(m, 68)  # 8.5-unit clearance for a 15-unit sticker and its outline.
    # The shell is drawn in front of the crab. Its lower-right rim overlaps the
    # head, so shell opacity alone is not a safe place for a sticker. Keep the
    # whole sticker left of the face, even at the renderer's largest 1.14 scale
    # around (95, 135): 95 + (108 + 7.5 - 95) * 1.14 < 120.
    yy, xx = np.indices(m.shape)
    m &= (xx <= BOX[0] + 108 * UNIT) & (yy <= BOX[1] + 110 * UNIT)
    ys, xs = np.nonzero(m)
    if len(xs) == 0:
        return []
    pts = np.stack([xs, ys], 1)
    # Start near the top-middle of the shell, then add the point farthest from all chosen ones.
    cx = (xs.min() + xs.max()) / 2
    first = np.argmin(np.abs(pts[:, 0] - cx) + (pts[:, 1] - ys.min()) * 0.6)
    chosen = [pts[first]]
    d = np.linalg.norm(pts - chosen[0], axis=1)
    while len(chosen) < n:
        i = int(np.argmax(d))
        chosen.append(pts[i])
        d = np.minimum(d, np.linalg.norm(pts - pts[i], axis=1))
    return [list(to_units(*p)) for p in chosen]


def shell_layers():
    crab_masks = [alpha(crab_frame(load(f"crab-{m}"), m)) for m in ("happy", "curious", "celebrating", "sleepy")]
    shells, meta = {}, {}
    for name in FITS:
        img = shell_frame(load(f"shell-{name}"), name)
        entry = {"shell": layer(img), "back": layer(gap_backing(img, crab_masks))}
        if name in GENERIC:
            # White band; the renderer tints it and multiplies it over the shell so outlines stay dark.
            entry["band"] = layer(shell_frame(load(f"band-{name}"), name))
        shells[name] = entry
        op = alpha(img, 128)
        ys, xs = np.nonzero(op)
        x0, y0 = to_units(xs.min(), ys.min())
        x1, y1 = to_units(xs.max(), ys.max())
        meta[name] = {"box": [x0, y0, x1, y1], "slots": decoration_slots(img)}
    return shells, meta


def stage_layers():
    """Egg art from the zip, scaled so the egg sits on the crab's ground line."""
    ground = 841  # master y of the crab's feet
    img = load("stage-egg")
    img = img.crop(img.getchannel("A").getbbox())
    s = 300 / img.height
    img = img.resize((round(img.width * s), 300), Image.LANCZOS)
    canvas = Image.new("RGBA", (1024, 1024))
    canvas.alpha_composite(img, (round(470 - img.width / 2), ground - 300))
    return {"egg": layer(canvas)}


def trim_cell(cell):
    """Drop small bits of neighbouring stickers that poke over the cell edge, then crop to the content."""
    a = np.asarray(cell).copy()
    solid = a[..., 3] > 40
    labels, n = label(solid)
    if n:
        sizes = np.bincount(labels.ravel())
        edge = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
        for i in edge:
            if sizes[i] < 0.15 * solid.sum():
                a[labels == i, 3] = 0
    out = Image.fromarray(a)
    bb = out.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
    return out.crop(bb) if bb else None


def cut_sheet(name, cols, rows):
    """Split a sticker sheet into grid cells, trim each to its content."""
    path = ART / f"{name}.png"
    if not path.exists():
        return None
    img = Image.open(path).convert("RGBA")
    bb = img.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
    x0, y0, x1, y1 = bb
    cw, ch = (x1 - x0) / cols, (y1 - y0) / rows
    cells = []
    for r in range(rows):
        for c in range(cols):
            cell = img.crop((round(x0 + c * cw), round(y0 + r * ch), round(x0 + (c + 1) * cw), round(y0 + (r + 1) * ch)))
            cells.append(trim_cell(cell))
    return cells


def sprite(img, max_px=96):
    s = max_px / max(img.size)
    w, h = round(img.width * s), round(img.height * s)
    return {"src": webp(img, w, 82), "w": w, "h": h}


def sheets():
    decos = cut_sheet("sheet-decorations", 3, 2)
    props = cut_sheet("sheet-props", 4, 3)
    out = {}
    if decos:
        out["decorations"] = dict(zip(["barnacle", "star", "flower", "flower2", "heart", "pebble"],
                                      [sprite(d, 64) for d in decos]))
    if props:
        names = ["question", "papers", "cloud", "z", "sparkle", "sparks", "nightcap", "cobweb",
                 "leaf", "giftShell", "giftStar", "confetti"]
        out["props"] = {n: sprite(p, 128) for n, p in zip(names, props) if p is not None}
    return out


def write_shell_interiors():
    """A solid aperture behind the crab, following each shell at every growth size.

    The convex envelope closes the lower-right opening. Clipping to the opening
    leaves conch spikes, the mug handle, and other outside details transparent.
    """
    paths = {}
    for name in FITS:
        img = shell_frame(load(f"shell-{name}"), name)
        ys, xs = np.nonzero(alpha(img, 128))
        points = np.stack([xs, ys], axis=1)
        hull = points[ConvexHull(points).vertices]
        polygon = [list(to_units(*point)) for point in hull]
        # Sutherland-Hodgman clipping to the aperture, in shared frame units.
        for axis, bound, keep_greater in [(0, 70, True), (1, 60, True), (1, 145, False)]:
            clipped = []
            previous = polygon[-1]
            for current in polygon:
                inside = lambda p: p[axis] >= bound if keep_greater else p[axis] <= bound
                if inside(previous) != inside(current):
                    t = (bound - previous[axis]) / (current[axis] - previous[axis])
                    clipped.append([previous[j] + t * (current[j] - previous[j]) for j in range(2)])
                if inside(current):
                    clipped.append(current)
                previous = current
            polygon = clipped
        paths[name] = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in polygon) + "Z"
    target = OUT.with_name("shell-interiors.json")
    target.write_text(json.dumps(paths, indent=2) + "\n")
    print(f"wrote {target.relative_to(ROOT)}")


def write_decoration_slots():
    """Regenerate placement metadata without re-encoding any image assets."""
    slots = {name: decoration_slots(shell_frame(load(f"shell-{name}"), name)) for name in FITS}
    target = OUT.with_name("decoration-slots.json")
    target.write_text(json.dumps(slots, indent=2) + "\n")
    print(f"wrote {target.relative_to(ROOT)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slots-only", action="store_true", help="update shell placement and interior metadata without re-encoding artwork")
    args = parser.parse_args()
    write_decoration_slots()
    write_shell_interiors()
    if args.slots_only:
        return
    crabs, blinks, eye_box = crab_layers()
    shells, shell_meta = shell_layers()
    stages = stage_layers()
    extra = sheets()
    data = {
        "frame": {"w": (BOX[2] - BOX[0]) / UNIT, "h": (BOX[3] - BOX[1]) / UNIT, "ground": to_units(0, 841)[1]},
        "eyeBox": eye_box,
        "crabs": crabs,
        "blinks": blinks,
        "shells": shells,
        "shellMeta": shell_meta,
        "stages": stages,
        **extra,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(data, separators=(",", ":"))
    OUT.write_text(
        "// Generated by scripts/build-art.py from art/*.png. Do not edit by hand.\n"
        'import type { ArtData } from "./types";\n\n'
        f"export const ART: ArtData = {body};\n"
    )
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)"
          f"{'' if extra.get('props') else ' - no sticker sheets yet, using drawn props'}")


if __name__ == "__main__":
    main()
