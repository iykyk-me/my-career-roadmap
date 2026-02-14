"use client";

import { GoalItem, Category } from "@/lib/types";
import { useState } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoalChecklistProps {
    goals: GoalItem[];
    onAdd: (text: string, category: Category) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const categories: { value: Category; label: string; color: string }[] = [
    { value: 'study', label: '학습', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'project', label: '프로젝트', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'certificate', label: '자격증', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'activity', label: '활동', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'job-prep', label: '취업', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
];

export default function GoalChecklist({ goals, onAdd, onToggle, onDelete }: GoalChecklistProps) {
    const [newGoalText, setNewGoalText] = useState("");
    const [newGoalCategory, setNewGoalCategory] = useState<Category>('study');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalText.trim()) return;
        onAdd(newGoalText, newGoalCategory);
        setNewGoalText("");
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                오늘의 목표
                <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {goals.filter(g => g.completed).length} / {goals.length}
                </span>
            </h3>

            <div className="space-y-3 mb-6">
                <AnimatePresence>
                    {goals.map(goal => (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                goal.completed
                                    ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-800"
                                    : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                            )}
                        >
                            <button
                                onClick={() => onToggle(goal.id)}
                                className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                    goal.completed
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                                )}
                            >
                                {goal.completed && <Check className="w-4 h-4" />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    goal.completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"
                                )}>
                                    {goal.text}
                                </p>
                            </div>

                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded flex-shrink-0",
                                categories.find(c => c.value === goal.category)?.color
                            )}>
                                {categories.find(c => c.value === goal.category)?.label}
                            </span>

                            <button
                                onClick={() => onDelete(goal.id)}
                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                    {goals.length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            아직 등록된 목표가 없습니다.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value as Category)}
                    className="w-24 px-2 py-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="목표를 입력하세요..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
