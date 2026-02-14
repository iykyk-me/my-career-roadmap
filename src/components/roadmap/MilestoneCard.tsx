"use client";

import { Milestone, Task } from "@/lib/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Edit2, Trash2, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
    milestone: Milestone;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleTask: (milestoneId: string, taskId: string) => void;
}

const statusColors = {
    'not-started': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'completed': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
};

const categoryLabels: Record<string, string> = {
    study: '스터디',
    certificate: '자격증',
    project: '프로젝트',
    activity: '대외활동',
    'job-prep': '취업준비',
};

export default function MilestoneCard({ milestone, onEdit, onDelete, onToggleTask }: MilestoneCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate days remaining or duration
    const start = new Date(milestone.startDate);
    const end = new Date(milestone.endDate);
    const period = `${format(start, 'yyyy.MM.dd')} ~ ${format(end, 'yyyy.MM.dd')}`;

    return (
        <motion.div
            layout
            className={cn(
                "relative pl-8 pb-8 border-l-2 border-slate-200 dark:border-slate-800 last:border-l-0 last:pb-0",
                milestone.status === 'completed' && "border-green-500 dark:border-green-500"
            )}
        >
            {/* Timeline Dot */}
            <div className={cn(
                "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900",
                milestone.status === 'completed' ? "border-green-500 bg-green-500" :
                    milestone.status === 'in-progress' ? "border-blue-500" : "border-slate-300 dark:border-slate-600"
            )} />

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2 mb-1">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", statusColors[milestone.status])}>
                            {milestone.status === 'not-started' ? '시작 전' :
                                milestone.status === 'in-progress' ? '진행 중' : '완료됨'}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {categoryLabels[milestone.category]}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => onEdit(milestone.id)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(milestone.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{milestone.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{milestone.description}</p>

                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{period}</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{milestone.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${milestone.progress}%` }}></div>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    {isExpanded ? '접기' : `하위 과제 ${milestone.tasks.length}개 보기`}
                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3"
                        >
                            {milestone.tasks.map(task => (
                                <div key={task.id}
                                    onClick={() => onToggleTask(milestone.id, task.id)}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer group"
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                        task.completed
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "border-slate-300 dark:border-slate-600 group-hover:border-blue-400"
                                    )}>
                                        {task.completed && <CheckCircle className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className={cn(
                                        "text-sm",
                                        task.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"
                                    )}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-2">
                                <button className="text-xs text-blue-500 font-medium hover:underline">+ 과제 추가하기</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
