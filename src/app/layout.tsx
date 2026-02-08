import type { Metadata } from "next";
import { Urbanist, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      <body className={`${urbanist.variable} ${dmSans.variable} ${dmMono.variable} antialiased bg-[#050505] text-white`}>
        {children}
      </body>
    </html>
  );
}
