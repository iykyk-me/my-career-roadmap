"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, CheckSquare, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "대시보드", href: "/", icon: LayoutDashboard },
    { name: "로드맵", href: "/roadmap", icon: Map },
    { name: "일일 목표", href: "/daily", icon: CheckSquare },
    { name: "포트폴리오", href: "/portfolio", icon: Briefcase },
    { name: "프로필", href: "/profile", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:border-r lg:bg-white dark:lg:bg-slate-900 lg:border-slate-200 dark:lg:border-slate-800">
            <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">My Career Roadmap</h1>
            </div>
            <div className="flex flex-col flex-grow p-4 gap-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">학생 이름</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">프론트엔드 개발자</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
