import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedaAI — AI Teacher's Toolkit",
  description: "Upload question papers and student answer sheets. Get instant AI-powered question extraction, answer mapping, and grading.",
  keywords: ["teacher toolkit", "AI grading", "answer sheet", "question extraction"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F5F5F5] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
