import type { Metadata } from "next";
import { Geist, Geist_Mono, Syncopate, Syne, Cinzel, Orbitron, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
});

const syne = Syne({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "800", "900"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "700", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DEV NOIR — Premium Freelance Web Services & Digital Studio",
  description: "High-precision freelance web development, custom digital design, and cinematic web experiences tailored to your brand by Dev Noir.",
  icons: {
    icon: "/logo_white.svg",
    shortcut: "/logo_white.svg",
    apple: "/logo_white.svg",
  },
  keywords: [
    "freelance web services",
    "freelance web developer",
    "custom web development",
    "cinematic UI design",
    "premium digital experiences",
    "portfolio development"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syncopate.variable} ${syne.variable} ${cinzel.variable} ${orbitron.variable} ${hankenGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#060608] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
