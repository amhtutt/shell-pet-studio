# shell-pet layer prompts

Every badge is two layers stacked: a **crab without a shell** (one per mood), then a **shell** placed on its back. Shells don't know about moods and crabs don't know about shells, so any mood can wear any shell. I recolor the body in code for the 8 colors and the navy shiny, so make everything **coral**.

Put the files in `art/` with the exact names below. Send transparent **PNGs** (best: I'll trace and shrink them myself) or SVGs like your zip; either works.

## Keep from your zip, no need to redo

`stage-egg`, `stage-cracking`, `stage-hatchling` and `stage-abandoned`. These never combine with anything else, so the whole pictures work as they are.

## The three rules

1. **Base every image on one master.** Use your "Normal" crab image (the one `variant-normal.svg` was traced from). Upload it with **every** prompt and say "edit this image". Layers made from scratch won't line up.
2. **Same canvas, same spot:** 1024×1024, transparent background. The crab and shell must stay exactly where they are in the master, the same size and angle. No zooming, cropping or moving.
3. **Coral only, plain shells.** Don't recolor the crab, and don't put stickers on the shells. Decorations come from a separate sheet so they can follow the contributor count.

If a result moves, changes size or changes style, regenerate it. Small shifts break the stacking.

## Style block

Paste this at the start of every prompt:

> Cute flat vector sticker illustration, matching the attached image exactly: same thick dark-brown outline (#2B1D1A), same flat colors with one soft shadow tone, no gradients, no glow, no texture, no drop shadow. Side view, facing right. Transparent background, 1024×1024. No text, no ground, no background elements.

---

## 1. Crabs without shells (12 images)

Start every prompt with:
> [style block] Edit this image. **Remove the shell completely.** Keep the crab in exactly the same position, size and pose. Where the shell was, finish the back of the crab's body as a plain rounded coral shape (it will be hidden under a shell later). Keep both claws, the legs, the eye stalks and the cheek blush. Then change only the face to…

| File | Face / pose |
|---|---|
| `crab-happy.png` | happy closed ^ ^ eyes, big open smile, small claw waving |
| `crab-celebrating.png` | eyes squeezed shut with joy, big open laughing mouth; the crab is in a little jump (lifted slightly off the ground, legs tucked) |
| `crab-grateful.png` | open shiny eyes, soft smile, bigger blush, hugging a gold star with its claw |
| `crab-curious.png` | eyes wide open on fully raised eye stalks, small "o" mouth |
| `crab-anxious.png` | worried eyes with slanted brows, wavy mouth, a blue sweat drop |
| `crab-lonely.png` | half-lidded eyes looking down, small frown, slightly slumped (same position) |
| `crab-sleepy.png` | heavy droopy eyelids, eye stalks drooping forward, flat tired mouth, slouched (same position) |

Blink frames: same as the image above, **only the eyes fully closed** (thin curved lines). Upload that mood's image with each prompt.

| File | Based on |
|---|---|
| `crab-grateful-blink.png` | `crab-grateful.png` |
| `crab-curious-blink.png` | `crab-curious.png` |
| `crab-anxious-blink.png` | `crab-anxious.png` |
| `crab-lonely-blink.png` | `crab-lonely.png` |
| `crab-sleepy-blink.png` | `crab-sleepy.png` |

Happy and celebrating already have closed eyes. Sleeping needs no crab: it's an empty shell with a nightcap from the props sheet.

---

## 2. Shells on their own (18 images)

Start every prompt with:
> [style block] Edit this image. **Remove the crab completely and keep only the shell**, in exactly the same size, angle and position. Its opening faces lower-right and shows a dark empty interior. No stickers or decorations on it. Change the shell to…

### Generic shells (every language without its own shell)

Plain cream with **no band**; I add the band in each language's GitHub color.

| File | Shell |
|---|---|
| `shell-spiral.png` | the master's round spiral shell, band removed |
| `shell-conch.png` | a spiky conch shell with 4 rounded spikes along the top |
| `shell-round.png` | a smooth round shell with one big spiral swirl on its side |
| `shell-cone.png` | a tall pointed cone shell, tilted back |

For each one, the band on its own, uploading that shell image:

| File | Prompt |
|---|---|
| `band-spiral.png` | "Keep only the decorative band/stripe that belongs on this shell, as **solid pure white** shapes in the exact spot it would sit. Remove the shell itself." |
| `band-conch.png` | same, for the conch |
| `band-round.png` | same, for the round shell |
| `band-cone.png` | same, for the cone |

### Language shells

You already have these in the zip, but each one has a crab inside. Remake them as **shell only**, with the same look, size and position as the master's shell. Upload your existing picture of each as a style reference, along with the master.

| File | Shell |
|---|---|
| `shell-typescript.png` | glossy blue spiral with one white stripe |
| `shell-javascript.png` | yellow spiral with a darker yellow band |
| `shell-python.png` | coiled shell, blue top half and yellow bottom half |
| `shell-rust.png` | orange-brown iron shell with rivets and two gears |
| `shell-go.png` | smooth light-cyan round spiral |
| `shell-java.png` | coffee mug with a bean emblem and a steam curl |
| `shell-cpp.png` | gray hex nut |
| `shell-ruby.png` | red faceted gem |
| `shell-swift.png` | orange shell with one swept-back fin |
| `shell-bash.png` | tiny dark terminal monitor with a green `>` and cursor |

---

## 3. Sticker sheets (2 images)

Use the style block and upload the master for style. Ask for **lots of empty space between items**, and no overlapping, so I can cut them apart.

**`sheet-decorations.png`**
> A sticker sheet of 6 small separate shell decorations in a 3×2 grid with lots of space between them: a white barnacle (rounded octagon with a dark center dot), a pink star sticker, a pink five-petal flower, a lilac five-petal flower, a light-blue heart, a smooth gray pebble. Same size as the stickers on the attached crab's shell.

**`sheet-props.png`**
> A sticker sheet of separate small props in a 4×4 grid with lots of space between them: a bold "?" question mark; a small stack of 4 cream papers; a puffy pale-blue sigh cloud; a single bold letter "z"; a golden four-point sparkle; three short yellow "happy spark" dashes; a light-blue nightcap with a white pom-pom, drawn so it pokes sideways out of a shell opening; a white cobweb; a dry orange-brown leaf; a tiny cream seashell gift; a tiny gold star gift; 4 confetti pieces (yellow, pink, blue, lilac), shown separately.

---

## What I'll do with them

- Cut out and line up every layer against the master.
- Trace and shrink them, aiming for about 20–30 KB per badge.
- Recolor the body for each repo and for the shiny.
- Tint the generic bands with each language's color.
- Place the decorations by contributor count, and grow the shell with stars.
- Animate: bob, blink (swap in the `-blink` frame), the celebration jump, confetti, z's, sparkles.

## Checklist

**1. Crabs**
- [ ] `crab-happy.png`
- [ ] `crab-celebrating.png`
- [ ] `crab-grateful.png`
- [ ] `crab-curious.png`
- [ ] `crab-anxious.png`
- [ ] `crab-lonely.png`
- [ ] `crab-sleepy.png`
- [ ] `crab-grateful-blink.png`
- [ ] `crab-curious-blink.png`
- [ ] `crab-anxious-blink.png`
- [ ] `crab-lonely-blink.png`
- [ ] `crab-sleepy-blink.png`

**2. Shells**
- [ ] `shell-spiral.png`
- [ ] `shell-conch.png`
- [ ] `shell-round.png`
- [ ] `shell-cone.png`
- [ ] `band-spiral.png`
- [ ] `band-conch.png`
- [ ] `band-round.png`
- [ ] `band-cone.png`
- [ ] `shell-typescript.png`
- [ ] `shell-javascript.png`
- [ ] `shell-python.png`
- [ ] `shell-rust.png`
- [ ] `shell-go.png`
- [ ] `shell-java.png`
- [ ] `shell-cpp.png`
- [ ] `shell-ruby.png`
- [ ] `shell-swift.png`
- [ ] `shell-bash.png`

**3. Sheets**
- [ ] `sheet-decorations.png`
- [ ] `sheet-props.png`

That's 32 images. Send `crab-happy.png` and `shell-spiral.png` first. I'll check that they stack cleanly before you make the rest.
