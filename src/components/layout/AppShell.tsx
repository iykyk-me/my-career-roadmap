"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    // Public routes that don't need auth
    const isPublicRoute = pathname === "/login" || pathname === "/";

    useEffect(() => {
        if (!loading && !user && !isPublicRoute) {
            router.push("/login");
        }
        if (!loading && user && pathname === "/login") {
            router.push("/dashboard");
        }
    }, [user, loading, isPublicRoute, router, pathname]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If on login page, just render children (the login form)
    if (isPublicRoute) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
    }

    // If not authenticated and not public (will redirect via effect, but return null/loader meanwhile)
    if (!user) {
        return null;
    }

    // Authenticated Shell
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full relative overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
