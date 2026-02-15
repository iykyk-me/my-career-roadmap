"use client";

import { useState } from "react";
import { useSupabaseProfile, useSupabasePortfolio } from "@/hooks/useSupabase";
import ProjectCard from "@/components/portfolio/ProjectCard";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import PortfolioDetail from "@/components/portfolio/PortfolioDetail";
import Modal from "@/components/common/Modal";
import { PortfolioItem } from "@/lib/types";
import { Plus, Printer, FileDown } from "lucide-react";
import { motion } from "framer-motion";

const filters = [
    { id: 'all', label: '전체' },
    { id: 'project', label: '프로젝트' },
    { id: 'certificate', label: '자격증' },
    { id: 'award', label: '수상' },
    { id: 'activity', label: '활동' },
    { id: 'experience', label: '경험' },
];

export default function PortfolioPage() {
    const { portfolio, loading: portfolioLoading, addPortfolio, updatePortfolio, deletePortfolio } = useSupabasePortfolio();
    const { profile, loading: profileLoading } = useSupabaseProfile();

    const [filter, setFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredItems = filter === 'all'
        ? portfolio
        : portfolio.filter(item => item.type === filter);

    // Sorting by date desc
    const sortedItems = [...filteredItems].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const handleCreate = async (data: Omit<PortfolioItem, "id">) => {
        const newItem: PortfolioItem = {
            ...data,
            id: crypto.randomUUID(),
        };
        await addPortfolio(newItem);
        setIsFormOpen(false);
    };

    const handleUpdate = async (data: Omit<PortfolioItem, "id">) => {
        if (!editingItem) return;
        await updatePortfolio(editingItem.id, data);
        setIsFormOpen(false);
        setEditingItem(null);

        // Also update selected item if it's the one being edited
        if (selectedItem?.id === editingItem.id) {
            setSelectedItem({ ...selectedItem, ...data });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            await deletePortfolio(id);
            setIsDetailOpen(false);
            setSelectedItem(null);
        }
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const openEditModal = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const openDetailModal = (item: PortfolioItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    if (portfolioLoading || profileLoading) return <div className="p-20 text-center">로딩 중...</div>;
    if (!profile) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">포트폴리오</h2>
                    <p className="text-slate-500 dark:text-slate-400">나만의 경험과 성과를 기록하고 증명하세요.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                        <Printer className="w-4 h-4" />
                        PDF 내보내기
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-500/30"
                    >
                        <Plus className="w-4 h-4" />
                        항목 추가
                    </button>
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold mb-2">{profile.name}의 포트폴리오</h1>
                <p className="text-lg">{profile.school} {profile.department} | {profile.targetJob}</p>
                <p className="text-sm mt-2 text-gray-600">{profile.introduction}</p>
            </div>

            <div className="mb-6 flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-print">
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {portfolio.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">등록된 포트폴리오가 없습니다.</p>
                    <button onClick={openCreateModal} className="text-blue-600 hover:underline mt-2 text-sm">
                        첫 프로젝트를 등록해보세요!
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedItems.map(item => (
                        <ProjectCard
                            key={item.id}
                            item={item}
                            onClick={() => openDetailModal(item)}
                        />
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="포트폴리오 상세"
            >
                {selectedItem && (
                    <PortfolioDetail
                        item={selectedItem}
                        onEdit={() => openEditModal(selectedItem)}
                        onDelete={() => handleDelete(selectedItem.id)}
                    />
                )}
            </Modal>

            {/* Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? "포트폴리오 수정" : "새 항목 추가"}
            >
                <PortfolioForm
                    initialData={editingItem}
                    onSubmit={editingItem ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>
        </div>
    );
}
