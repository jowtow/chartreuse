import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "chartreuse — color rhythm game",
  description:
    "A fast-paced color-rhythm game. Match the color name, hit the beat, earn points. Unlock upgrades. Go fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#050505] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
