import type { Metadata } from "next";
import { Syne, Bricolage_Grotesque, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "LLachat AI — AI That Feels Human",
  description:
    "Next-generation conversational AI so natural, your customers won't know the difference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bricolage.variable} ${outfit.variable} ${jetbrains.variable} ${syne.variable} antialiased bg-[#050505] text-white`}>
        {children}
      </body>
    </html>
  );
}
