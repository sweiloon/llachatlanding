import type { Metadata } from "next";
import { Manrope, Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
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
      <body className={`${manrope.variable} ${inter.variable} ${firaCode.variable} antialiased bg-[#050505] text-white`}>
        {children}
      </body>
    </html>
  );
}
