import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can switch to Pretendard if we add custom font loading
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Career Roadmap",
  description: "특성화고 취업 준비 포트폴리오 관리",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full lg:pl-64 h-full relative">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  );
}
