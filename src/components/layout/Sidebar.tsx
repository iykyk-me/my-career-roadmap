"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSupabaseProfile } from "@/hooks/useSupabase";
import { LayoutDashboard, Map, CheckSquare, Briefcase, User, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const navigation = [
    { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
    { name: "로드맵", href: "/roadmap", icon: Map },
    { name: "일일 목표", href: "/daily", icon: CheckSquare },
    { name: "포트폴리오", href: "/portfolio", icon: Briefcase },
    { name: "프로필", href: "/profile", icon: User },
];

const adminNavigation = [
    { name: "학생 관리", href: "/admin", icon: Users },
    // { name: "상담 일지", href: "/admin/counseling", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { profile } = useSupabaseProfile();
    const isAdmin = user?.email?.includes("admin") || profile?.role === 'admin';

    const links = isAdmin ? adminNavigation : navigation;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:z-[100] lg:border-r lg:bg-white dark:lg:bg-slate-900 lg:border-slate-200 dark:lg:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-800">
                <Link href="/dashboard">
                    <h1 className="text-xl font-bold text-primary dark:text-blue-400 cursor-pointer">My Career Roadmap</h1>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col flex-grow p-4 gap-2 overflow-y-auto">
                {links.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Footer with User Profile and Logout */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
                        {profile?.profileImage ? (
                            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{profile?.name?.[0]}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral dark:text-slate-100 truncate">{profile?.name || "사용자"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{isAdmin ? "관리자" : profile?.targetJob || "학생"}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    로그아웃
                </button>
            </div>
        </div>
    );
}
