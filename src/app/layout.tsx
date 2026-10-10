import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import AppLayout from "@/components/AppLayout";
import "@/styles/design-system.css";
import "@/styles/pages.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FITNESS HUB — Your AI-Powered Fitness Companion",
  description:
    "Achieve your goals with personalized AI workouts, precision nutrition plans, and intelligent progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
