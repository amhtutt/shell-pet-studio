import type { Metadata } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700", "800"] });
const body = Atkinson_Hyperlegible({ variable: "--font-body", subsets: ["latin"], weight: ["400", "700"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "shell-pet — a tiny hermit crab for every repository",
  description: "An SVG badge for your README. Stars feed it, releases grow its shell, neglect empties it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>{children}</body>
    </html>
  );
}
