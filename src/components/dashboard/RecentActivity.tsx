"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Award, BookOpen, User } from "lucide-react";

// Mock data for now, ideally derived from a unified activity log
const activities = [
    { id: 1, type: "study", text: "정보처리기능사 필기 기출문제 풀기 완료", date: "2시간 전", icon: BookOpen, color: "text-blue-500 bg-blue-100" },
    { id: 2, type: "project", text: "개인 블로그 메인 페이지 UI 구현", date: "5시간 전", icon: User, color: "text-green-500 bg-green-100" },
    { id: 3, type: "goal", text: "오늘의 목표 100% 달성! 🔥", date: "어제", icon: CheckCircle2, color: "text-orange-500 bg-orange-100" },
    { id: 4, type: "certificate", text: "ITQ 엑셀 A등급 취득", date: "3일 전", icon: Award, color: "text-purple-500 bg-purple-100" },
];

export default function RecentActivity() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
        >
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">최근 활동</h3>
            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={activity.id} className="flex gap-4 items-start">
                            <div className={`mt-1 p-2 rounded-full ${activity.color} bg-opacity-20`}>
                                <Icon className={`w-4 h-4 ${activity.color.replace('bg-', 'text-').replace('100', '600')}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.text}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    );
}
