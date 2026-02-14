"use client";

import { Tooltip } from "recharts"; // Reusing recharts tooltip or custom? Custom is easier for grid.
import { DailyGoal } from "@/lib/types";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface CalendarHeatmapProps {
    dailyGoals: DailyGoal[];
    onDateClick: (date: string) => void;
    selectedDate: string;
}

export default function CalendarHeatmap({ dailyGoals, onDateClick, selectedDate }: CalendarHeatmapProps) {
    // Generate last 365 days (or similar range)
    const today = new Date();
    const startDate = subDays(today, 119); // ~4 months roughly for compact view
    const days = eachDayOfInterval({ start: startDate, end: today });

    const getColor = (date: Date) => {
        const dayStr = format(date, 'yyyy-MM-dd');
        const entry = dailyGoals.find(g => g.date === dayStr);

        if (!entry || entry.goals.length === 0) return 'bg-slate-100 dark:bg-slate-800';

        // Calculate completion rate
        const completed = entry.goals.filter(g => g.completed).length;
        const total = entry.goals.length;
        const rate = total === 0 ? 0 : completed / total;

        if (rate === 0) return 'bg-slate-200 dark:bg-slate-700'; // Had goals but none done
        if (rate <= 0.3) return 'bg-blue-200 dark:bg-blue-900/40';
        if (rate <= 0.6) return 'bg-blue-400 dark:bg-blue-700';
        if (rate <= 0.9) return 'bg-blue-600 dark:bg-blue-500';
        return 'bg-blue-800 dark:bg-blue-400';
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">활동 기록</h3>
            <div className="flex flex-wrap gap-1">
                {days.map((day) => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dayStr;
                    return (
                        <div
                            key={dayStr}
                            onClick={() => onDateClick(dayStr)}
                            title={`${dayStr}: ${dailyGoals.find(g => g.date === dayStr)?.goals.length || 0} goals`}
                            className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${getColor(day)} ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-slate-900' : 'hover:scale-125'}`}
                        />
                    );
                })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-slate-500">
                <span>Less</span>
                <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/40 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-800 dark:bg-blue-400 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
}
