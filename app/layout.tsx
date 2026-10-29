import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shell-pet — Your code. Their home.",
  description: "A little life in your README. Meet the hermit crab that grows with your GitHub repository.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://shell-pet.vercel.app"),
  openGraph: {
    title: "shell-pet — Your code. Their home.",
    description: "A tiny hermit crab for your README. It grows with your stars, reacts to your commits, and wears a shell for your language.",
    url: "/",
    siteName: "shell-pet",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router's root layout loads these fonts for every route. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=DM+Mono:wght@400;500&family=Nunito+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
