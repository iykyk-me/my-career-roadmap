"use client";

import { useState } from "react";
import { useMilestones } from "@/hooks/useLocalStorage";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import MilestoneForm from "@/components/roadmap/MilestoneForm";
import Modal from "@/components/common/Modal";
import { Milestone, Category } from "@/lib/types";
import { Plus, Filter, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

const templates = {
    dev: [
        { title: "HTML/CSS 기초", description: "웹 표준과 스타일링 기초 학습", category: "study", duration: 30 },
        { title: "JavaScript 심화", description: "ES6+ 문법 및 비동기 프로그래밍", category: "study", duration: 45 },
        { title: "React 프로젝트", description: "컴포넌트 기반 웹 앱 개발", category: "project", duration: 60 },
        { title: "정보처리기능사", description: "필기 및 실기 취득", category: "certificate", duration: 90 },
    ],
    design: [
        { title: "포토샵/일러스트레이터", description: "디자인 툴 숙련도 향상", category: "study", duration: 45 },
        { title: "UI/UX 기초", description: "사용자 경험 설계 원칙 학습", category: "study", duration: 30 },
        { title: "GTQ 1급", description: "그래픽기술자격 취득", category: "certificate", duration: 30 },
        { title: "포트폴리오 제작", description: "비핸스/노션 포트폴리오", category: "project", duration: 60 },
    ]
};

export default function RoadmapPage() {
    const { data: milestones, setData: setMilestones } = useMilestones();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

    const filteredMilestones = filterCategory === 'all'
        ? milestones
        : milestones.filter(m => m.category === filterCategory);

    const handleCreate = (data: Omit<Milestone, "id" | "progress" | "order">) => {
        const newMilestone: Milestone = {
            ...data,
            id: crypto.randomUUID(),
            progress: 0,
            order: milestones.length + 1,
        };
        setMilestones([...milestones, newMilestone]);
        setIsModalOpen(false);
    };

    const handleUpdate = (data: Omit<Milestone, "id" | "progress" | "order">) => {
        if (!editingMilestone) return;

        // Calculate progress
        const totalTasks = data.tasks.length;
        const completedTasks = data.tasks.filter(t => t.completed).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const updatedMilestones = milestones.map(m =>
            m.id === editingMilestone.id
                ? { ...m, ...data, progress }
                : m
        );
        setMilestones(updatedMilestones);
        setIsModalOpen(false);
        setEditingMilestone(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("정말 삭제하시겠습니까? (복구할 수 없습니다)")) {
            setMilestones(milestones.filter(m => m.id !== id));
        }
    };

    const handleToggleTask = (milestoneId: string, taskId: string) => {
        const updatedMilestones = milestones.map(m => {
            if (m.id !== milestoneId) return m;

            const newTasks = m.tasks.map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            );

            const completedCount = newTasks.filter(t => t.completed).length;
            const progress = newTasks.length === 0 ? 0 : Math.round((completedCount / newTasks.length) * 100);

            // Auto-update status based on progress
            let status = m.status;
            if (progress === 100) status = 'completed';
            else if (progress > 0) status = 'in-progress';

            return { ...m, tasks: newTasks, progress, status };
        });
        setMilestones(updatedMilestones);
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
    const loadTemplate = (type: 'dev' | 'design') => {
        if (!confirm("현재 로드맵에 템플릿 마일스톤이 추가됩니다. 계속하시겠습니까?")) return;

        const templateItems = templates[type];
        const today = new Date();

        const newMilestones = templateItems.map((item, index) => {
            const start = new Date(today);
            start.setDate(today.getDate() + (index * 30)); // Stagger by month roughly
            const end = new Date(start);
            end.setDate(start.getDate() + item.duration);

            return {
                id: crypto.randomUUID(),
                title: item.title,
                description: item.description,
                category: item.category as Category,
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                status: 'not-started' as const,
                progress: 0,
                tasks: [],
                order: milestones.length + index + 1
            };
        });

        setMilestones([...milestones, ...newMilestones]);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral dark:text-slate-100">커리어 로드맵</h2>
                    <p className="text-slate-500 dark:text-slate-400">꿈을 향한 여정을 단계별로 계획해보세요.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => loadTemplate('dev')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                        <Wand2 className="w-4 h-4" />
                        템플릿
                    </button>
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
