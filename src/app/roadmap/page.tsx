"use client";

import { useState } from "react";
import { useSupabaseMilestones, useCareerGuides } from "@/hooks/useSupabase";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import MilestoneForm from "@/components/roadmap/MilestoneForm";
import Modal from "@/components/common/Modal";
import { Milestone, Category } from "@/lib/types";
import { Plus, Filter, Wand2 } from "lucide-react";
import { motion } from "framer-motion";


export default function RoadmapPage() {
    const { milestones, loading: milestonesLoading, addMilestone, updateMilestone, deleteMilestone } = useSupabaseMilestones(); // updated hook signature to expose CRUD
    const { guides, loading: guidesLoading } = useCareerGuides();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

    const filteredMilestones = filterCategory === 'all'
        ? milestones
        : milestones.filter(m => m.category === filterCategory);

    const handleCreate = async (data: Omit<Milestone, "id" | "progress" | "order">) => {
        const newMilestone: Milestone = {
            ...data,
            id: crypto.randomUUID(), // DB will generate ID if omitted, but for optimistic UI or strict typing we might need it. Supabase ignores ID on insert if default, or we can omit. 
            // My hook expects Milestone object. Let's pass what we have.
            // Actually my hook addMilestone takes Milestone.
            progress: 0,
            order: milestones.length + 1,
            tasks: []
        };
        await addMilestone(newMilestone);
        setIsModalOpen(false);
    };

    const handleUpdate = async (data: Omit<Milestone, "id" | "progress" | "order">) => {
        if (!editingMilestone) return;

        // Calculate progress
        const totalTasks = data.tasks.length;
        const completedTasks = data.tasks.filter(t => t.completed).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        await updateMilestone(editingMilestone.id, { ...data, progress });
        setIsModalOpen(false);
        setEditingMilestone(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말 삭제하시겠습니까? (복구할 수 없습니다)")) {
            await deleteMilestone(id);
        }
    };

    const handleToggleTask = async (milestoneId: string, taskId: string) => {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (!milestone) return;

        const newTasks = milestone.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );

        const completedCount = newTasks.filter(t => t.completed).length;
        const progress = newTasks.length === 0 ? 0 : Math.round((completedCount / newTasks.length) * 100);

        // Auto-update status based on progress
        let status = milestone.status;
        if (progress === 100) status = 'completed';
        else if (progress > 0) status = 'in-progress';

        await updateMilestone(milestoneId, { tasks: newTasks, progress, status });
    };

    const openCreateModal = () => {
        setEditingMilestone(null);
        setIsModalOpen(true);
    };

    const openEditModal = (id: string) => {
        const milestone = milestones.find(m => m.id === id);
        if (milestone) {
            setEditingMilestone(milestone);
            setIsModalOpen(true);
        }
    };

    // Simplified Template Loader
    // Template Loader from Guides
    const loadTemplate = async (guideId: string) => {
        const guide = guides.find(g => g.id === guideId);
        if (!guide) return;

        if (!confirm(`'${guide.title}' 템플릿을 로드하시겠습니까?`)) return;

        const templateItems = typeof guide.roadmap_template === 'string'
            ? JSON.parse(guide.roadmap_template)
            : guide.roadmap_template;

        if (!Array.isArray(templateItems)) {
            alert("템플릿 형식이 올바르지 않습니다.");
            return;
        }

        const today = new Date();

        // Sequential insert to maintain order
        for (let i = 0; i < templateItems.length; i++) {
            const item = templateItems[i];
            const start = new Date(today);
            start.setDate(today.getDate() + (i * 30)); // Rough estimation
            const end = new Date(start);
            end.setDate(start.getDate() + (item.duration || 30));

            const newMilestone: Milestone = {
                id: crypto.randomUUID(),
                title: item.title,
                description: item.description,
                category: item.category as Category,
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                status: 'not-started',
                progress: 0,
                tasks: [],
                order: milestones.length + i + 1
            };
            await addMilestone(newMilestone);
        }
        alert("로드맵이 생성되었습니다.");
    };

    if (milestonesLoading) return <div className="p-20 text-center">로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral dark:text-slate-100">커리어 로드맵</h2>
                    <p className="text-slate-500 dark:text-slate-400">꿈을 향한 여정을 단계별로 계획해보세요.</p>
                </div>
                <div className="flex gap-2">
                    {guidesLoading ? (
                        <span className="text-sm text-slate-400 self-center">가이드 로딩 중...</span>
                    ) : (
                        guides.map(guide => (
                            <button
                                key={guide.id}
                                onClick={() => loadTemplate(guide.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                                <Wand2 className="w-4 h-4" />
                                {guide.job_category}
                            </button>
                        ))
                    )}
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm shadow-primary/30"
                    >
                        <Plus className="w-4 h-4" />
                        마일스톤 추가
                    </button>
                </div>
            </div>

            <div className="mb-6 flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === 'all'
                        ? 'bg-neutral text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                        }`}
                >
                    전체 보기
                </button>
                {/* Can generate other filter buttons dynamically if needed */}
                {['study', 'certificate', 'project', 'activity'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat as Category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === cat
                            ? 'bg-neutral text-white dark:bg-white dark:text-slate-900'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                    >
                        {cat === 'study' ? '학습' : cat === 'certificate' ? '자격증' : cat === 'project' ? '프로젝트' : '대외활동'}
                    </button>
                ))}
            </div>

            <RoadmapTimeline
                milestones={filteredMilestones}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggleTask={handleToggleTask}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMilestone ? "마일스톤 수정" : "새 마일스톤 추가"}
            >
                <MilestoneForm
                    initialData={editingMilestone}
                    onSubmit={editingMilestone ? handleUpdate : handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
