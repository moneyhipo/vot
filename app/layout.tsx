import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "투표 앱",
  description: "간단하고 빠른 투표 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-blue-600">
            <a href="/">🗳️ 우리들의 투표 앱</a>
          </h1>
          <div className="text-sm font-medium text-gray-600">
            🧑‍💻 운영자: <strong>[윤재건]</strong>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
