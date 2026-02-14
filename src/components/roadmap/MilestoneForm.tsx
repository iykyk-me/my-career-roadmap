"use client";

import { Milestone, Category } from "@/lib/types";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface MilestoneFormProps {
    initialData?: Milestone | null;
    onSubmit: (data: Omit<Milestone, "id" | "progress" | "order">) => void;
    onCancel: () => void;
}

const categories: { value: Category; label: string }[] = [
    { value: 'study', label: '학습' },
    { value: 'certificate', label: '자격증' },
    { value: 'project', label: '프로젝트' },
    { value: 'activity', label: '대외활동' },
    { value: 'job-prep', label: '취업준비' },
];

export default function MilestoneForm({ initialData, onSubmit, onCancel }: MilestoneFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState<Category>(initialData?.category || "study");
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [endDate, setEndDate] = useState(initialData?.endDate || "");
    const [status, setStatus] = useState<Milestone['status']>(initialData?.status || "not-started");
    const [tasks, setTasks] = useState<{ id: string; title: string; completed: boolean }[]>(
        initialData?.tasks || []
    );
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            category,
            startDate,
            endDate,
            status,
            tasks,
        });
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        setTasks([...tasks, { id: crypto.randomUUID(), title: newTaskTitle, completed: false }]);
        setNewTaskTitle("");
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">설명</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">카테고리</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                        {categories.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">상태</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Milestone['status'])}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                        <option value="not-started">시작 전</option>
                        <option value="in-progress">진행 중</option>
                        <option value="completed">완료됨</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">시작일</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">종료일</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">하위 과제</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                        placeholder="과제 추가 (Enter)"
                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={addTask}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-sm dark:text-slate-300">{task.title}</span>
                            <button
                                type="button"
                                onClick={() => removeTask(task.id)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                >
                    저장하기
                </button>
            </div>
        </form>
    );
}
