"use client";

import { PortfolioItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    item: PortfolioItem;
    onClick: () => void;
}

const typeLabels: Record<string, string> = {
    project: '프로젝트',
    certificate: '자격증',
    award: '수상',
    activity: '활동',
    experience: '경험',
};

const typeColors: Record<string, string> = {
    project: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    certificate: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    award: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    activity: 'bg-primary/20 text-primary dark:bg-blue-900/30 dark:text-blue-300',
    experience: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function ProjectCard({ item, onClick }: ProjectCardProps) {
    return (
        <motion.div
            layoutId={`card-${item.id}`}
            onClick={onClick}
            className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
        >
            {/* Thumbnail placeholder or image */}
            <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <span className="text-4xl">🖼️</span>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded shadow-sm", typeColors[item.type])}>
                        {typeLabels[item.type]}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-neutral dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.date}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
