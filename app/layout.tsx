import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lang0 Detect - AI-Powered Language Detection",
  description:
    "Detect any language instantly with AI-powered accuracy. Harness the power of OpenAI to identify languages in your text with incredible precision and confidence scores.",
  keywords: [
    "language detection",
    "AI",
    "OpenAI",
    "text analysis",
    "language identifier",
  ],
  authors: [{ name: "Lang0 Detect" }],
  creator: "Lang0 Detect",
  publisher: "Lang0 Detect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lang0-detect.vercel.app"),
  openGraph: {
    title: "Lang0 Detect - AI-Powered Language Detection",
    description: "Detect any language instantly with AI-powered accuracy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lang0 Detect - AI-Powered Language Detection",
    description: "Detect any language instantly with AI-powered accuracy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
