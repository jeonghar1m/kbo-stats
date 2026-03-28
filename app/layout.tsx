import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KBO 경기 결과",
  description: "KBO 프로야구 경기 결과 및 AI 분석",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="text-center text-sm text-gray-500 py-4">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://jeongharim.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500"
          >
            Jeong Harim
          </a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
