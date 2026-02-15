import { PortfolioItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Github, Globe, Hash } from "lucide-react";
// The plan said "details: Markdown content". I didn't install react-markdown.
// I'll implement a simple whitespace pre-wrap renderer for this step to avoid missing dependency error unless I add it.
// Or I can add it to the install list. But for now, let's use whitespace-pre-line.
// Actually, `react-markdown` was not in the install list. So I'll do basic text rendering.

interface PortfolioDetailProps {
    item: PortfolioItem;
    onEdit: () => void;
    onDelete: () => void;
}

export default function PortfolioDetail({ item, onEdit, onDelete }: PortfolioDetailProps) {
    return (
        <div className="space-y-6">
            {/* Header Image */}
            {item.images && item.images.length > 0 && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain bg-black/5" />
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                        {item.type}
                    </span>
                    <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.date}
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-neutral dark:text-slate-100 mb-2">{item.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>

            {/* Links */}
            {(item.links?.github || item.links?.demo) && (
                <div className="flex gap-3">
                    {item.links.github && (
                        <a href={item.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                            <Github className="w-4 h-4" /> GitHub
                        </a>
                    )}
                    {item.links.demo && (
                        <a href={item.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors">
                            <Globe className="w-4 h-4" /> Demo / Link
                        </a>
                    )}
                </div>
            )}

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Content */}
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {item.details}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
                {item.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm dark:bg-slate-800 dark:text-slate-400">
                        <Hash className="w-3 h-3" /> {tag}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    수정
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                >
                    삭제
                </button>
            </div>
        </div>
    );
}
