import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowledge Base",
  description: "Collaborative document platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 min-h-screen text-gray-800`}
      >
        <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur border-b shadow">
          <h1 className="text-xl font-semibold">📘 Knowledge Base</h1>
          <Header />
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
