import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONA_SYS | Hackable Terminal Resume",
  description: "Interactive TRON-inspired terminal resume with unlockable layers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
