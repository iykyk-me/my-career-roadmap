"use client";

import { useState, useEffect } from "react";
import { Smile, Frown, Meh, Star } from "lucide-react"; // Using diverse icons for mood

interface DailyReflectionProps {
    initialReflection: string;
    initialMood: 1 | 2 | 3 | 4 | 5;
    initialStudyHours: number;
    onSave: (reflection: string, mood: number, studyHours: number) => void;
}

const moods = [
    { value: 1, icon: Frown, label: '나쁨', color: 'bg-red-100 text-red-500' },
    { value: 2, icon: Meh, label: '보통', color: 'bg-orange-100 text-orange-500' },
    { value: 3, icon: Smile, label: '좋음', color: 'bg-yellow-100 text-yellow-600' },
    { value: 4, icon: Smile, label: '아주 좋음', color: 'bg-lime-100 text-lime-600' }, // Reusing smile for simplicity or better icon
    { value: 5, icon: Star, label: '최고', color: 'bg-green-100 text-green-600' },
];

export default function DailyReflection({ initialReflection, initialMood, initialStudyHours, onSave }: DailyReflectionProps) {
    const [reflection, setReflection] = useState(initialReflection);
    const [mood, setMood] = useState(initialMood);
    const [studyHours, setStudyHours] = useState(initialStudyHours);

    // Auto-save on change (debounced could be better, but simple save on blur or explicit button is safer for now)
    // Let's use an explicit save or "onBlur" style? 
    // For simplicity, let's just expose a save button or save on change (with useEffect).
    // Given user requirements for "Input", let's update local state and have a parent save mechanism or auto-save via effect.

    useEffect(() => {
        // Debounce save or just save on unmount? 
        // Let's rely on parent saving when these values change? 
        // Or just provide a "Save" button for explicit action.
        // The requirement says "Daily Reflection... Input".
        // I'll add a save button for clarity.
    }, [reflection, mood, studyHours]);

    const handleSave = () => {
        onSave(reflection, mood, studyHours);
        alert("저장되었습니다!"); // Simple feedback
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full">
            <h3 className="text-lg font-bold mb-4 text-neutral dark:text-slate-100">오늘의 회고</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">오늘의 기분</label>
                    <div className="flex gap-2">
                        {moods.map((m) => {
                            const Icon = m.icon;
                            const isSelected = mood === m.value;
                            return (
                                <button
                                    key={m.value}
                                    onClick={() => setMood(m.value as any)}
                                    className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${isSelected
                                        ? `${m.color} ring-2 ring-offset-1 ring-primary dark:ring-offset-slate-900`
                                        : 'bg-slate-50 text-slate-400 dark:bg-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-xs font-medium">{m.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">공부 시간 (시간)</label>
                    <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={studyHours}
                        onChange={(e) => setStudyHours(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">회고 내용</label>
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="오늘 무엇을 배웠나요? 어떤 점이 아쉬웠나요?"
                        className="w-full h-32 px-3 py-2 border rounded-lg resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}
