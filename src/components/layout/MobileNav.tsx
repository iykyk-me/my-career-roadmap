"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, CheckSquare, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "홈", href: "/", icon: LayoutDashboard },
    { name: "로드맵", href: "/roadmap", icon: Map },
    { name: "목표", href: "/daily", icon: CheckSquare },
    { name: "포트폴리오", href: "/portfolio", icon: Briefcase },
    { name: "프로필", href: "/profile", icon: User },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 lg:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive
                                    ? "text-primary dark:text-blue-400"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
