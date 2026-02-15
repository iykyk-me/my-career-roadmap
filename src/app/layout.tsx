import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can switch to Pretendard if we add custom font loading
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AppShell from "@/components/layout/AppShell";

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
      <body className={`${inter.className} bg-background dark:bg-slate-950 text-foreground dark:text-slate-100`}>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
