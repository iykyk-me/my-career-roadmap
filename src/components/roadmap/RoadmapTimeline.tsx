"use client";

import { Milestone } from "@/lib/types";
import MilestoneCard from "./MilestoneCard";
import { motion } from "framer-motion";

interface RoadmapTimelineProps {
    milestones: Milestone[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleTask: (milestoneId: string, taskId: string) => void;
}

export default function RoadmapTimeline({ milestones, onEdit, onDelete, onToggleTask }: RoadmapTimelineProps) {
    if (milestones.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">등록된 마일스톤이 없습니다.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">새로운 목표를 추가해보세요!</p>
            </div>
        );
    }

    // Sort milestones by start date
    const sortedMilestones = [...milestones].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return (
        <div className="relative pl-4 space-y-0">
            {/* Vertical Line Background */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

            {sortedMilestones.map((milestone, index) => (
                <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <MilestoneCard
                        milestone={milestone}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleTask={onToggleTask}
                    />
                </motion.div>
            ))}
        </div>
    );
}
