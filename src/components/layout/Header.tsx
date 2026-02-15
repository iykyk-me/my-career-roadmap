"use client";

import { Moon, Sun, Flame, Home } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setDarkMode(true);
        }
    };

    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 lg:ml-64">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{today}</span>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" aria-label="Go to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </Link>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-point/10 text-point rounded-full dark:bg-orange-900/20 dark:text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-bold">3일 연속 달성!</span>
                </div>

                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
}
