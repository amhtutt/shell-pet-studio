import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// One guard covers /dev and every nested inspection page, including /dev/view.
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
