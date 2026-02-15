"use client";

import { useState, useEffect } from "react";
import { useSupabaseDailyGoals } from "@/hooks/useSupabase";
import GoalChecklist from "@/components/daily/GoalChecklist";
import DailyReflection from "@/components/daily/DailyReflection";
import CalendarHeatmap from "@/components/daily/CalendarHeatmap";
import { DailyGoal, Category } from "@/lib/types";
import { format, addDays, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyPage() {
    const { dailyGoals, loading, updateDailyGoal } = useSupabaseDailyGoals();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Helper to find or create daily entry safely (without mutating state directly in render)
    const getDailyEntry = (date: string): DailyGoal => {
        return dailyGoals.find(g => g.date === date) || {
            id: crypto.randomUUID(),
            date: date,
            goals: [],
            reflection: "",
            mood: 3,
            studyHours: 0
        };
    };

    const currentEntry = getDailyEntry(selectedDate);

    const updateEntry = (updatedEntry: DailyGoal) => {
        // We only explicitly update. The hook handles upsert.
        // We pass the fields to updateDailyGoal
        updateDailyGoal(selectedDate, {
            goals: updatedEntry.goals,
            reflection: updatedEntry.reflection,
            mood: updatedEntry.mood,
            studyHours: updatedEntry.studyHours
        });
    };

    const handleAddGoal = (text: string, category: Category) => {
        const newGoal = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            category
        };
        updateEntry({
            ...currentEntry,
            goals: [...currentEntry.goals, newGoal]
        });
    };

    const handleToggleGoal = (id: string) => {
        updateEntry({
            ...currentEntry,
            goals: currentEntry.goals.map(g =>
                g.id === id ? { ...g, completed: !g.completed } : g
            )
        });
    };

    const handleDeleteGoal = (id: string) => {
        updateEntry({
            ...currentEntry,
            goals: currentEntry.goals.filter(g => g.id !== id)
        });
    };

    const handleSaveReflection = (reflection: string, mood: number, studyHours: number) => {
        updateEntry({
            ...currentEntry,
            reflection,
            mood: mood as any,
            studyHours
        });
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const date = new Date(selectedDate);
        const newDate = direction === 'prev' ? subDays(date, 1) : addDays(date, 1);
        setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    };

    // Calculate completion percentage
    const completedCount = currentEntry.goals.filter(g => g.completed).length;
    const totalCount = currentEntry.goals.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral dark:text-slate-100">일일 목표 관리</h2>
                    <p className="text-slate-500 dark:text-slate-400">매일의 작은 성공이 모여 큰 꿈을 이룹니다.</p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg min-w-[140px] text-center">
                        {format(new Date(selectedDate), 'M월 d일 (eee)', { locale: ko })}
                    </span>
                    <button
                        onClick={() => navigateDate('next')}
                        disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Card */}
                    <div className="bg-gradient-to-r from-primary to-sub rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">오늘의 달성률</p>
                                <h3 className="text-3xl font-bold">{progress}%</h3>
                            </div>
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                                {progress === 100 ? '🎉' : '🔥'}
                            </div>
                        </div>
                        {/* Background decorative circles */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    </div>

                    <GoalChecklist
                        goals={currentEntry.goals}
                        onAdd={handleAddGoal}
                        onToggle={handleToggleGoal}
                        onDelete={handleDeleteGoal}
                    />
                </div>

                <div>
                    <DailyReflection
                        initialReflection={currentEntry.reflection}
                        initialMood={currentEntry.mood}
                        initialStudyHours={currentEntry.studyHours}
                        onSave={handleSaveReflection}
                    />
                </div>
            </div>

            <CalendarHeatmap
                dailyGoals={dailyGoals}
                onDateClick={setSelectedDate}
                selectedDate={selectedDate}
            />
        </div>
    );
}
