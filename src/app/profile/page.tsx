"use client";

import { useSupabaseProfile, useSupabaseMilestones, useSupabaseDailyGoals, useSupabasePortfolio } from "@/hooks/useSupabase";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, School, Book, Award, Download, Upload, Save, X, Plus } from "lucide-react";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
    const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile();
    const { milestones } = useSupabaseMilestones();
    const { dailyGoals } = useSupabaseDailyGoals();
    const { portfolio } = useSupabasePortfolio();

    // Hooks need initial data for editForm, but hooks are async.
    // We need useEffect to set editForm when profile loads.

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (profile) setEditForm(profile);
    }, [profile]);

    const [newSkill, setNewSkill] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel
            setEditForm(profile);
            setIsEditing(false);
        } else {
            // Start editing
            setEditForm(profile);
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!editForm) return;
        await updateProfile(editForm);
        setIsEditing(false);
        alert("프로필이 저장되었습니다.");
    };

    const handleChange = (field: keyof UserProfile, value: any) => {
        setEditForm(prev => {
            if (!prev) return null;
            return { ...prev, [field]: value };
        });
    };

    const addSkill = () => {
        if (!editForm) return;
        if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
            setEditForm(prev => {
                if (!prev) return null;
                const current = prev as UserProfile; // Explicit cast to avoid type inference issues
                return {
                    ...current,
                    skills: [...current.skills, newSkill.trim()]
                };
            });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        if (!editForm) return;
        setEditForm(prev => {
            if (!prev) return null;
            return {
                ...prev,
                skills: prev.skills.filter(s => s !== skill)
            };
        });
    };

    const handleExport = () => {
        const data = {
            profile,
            milestones,
            dailyGoals,
            portfolio,
            exportedAt: new Date().toISOString(),
            version: 1
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-roadmap-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        alert("온라인 모드에서는 백업 불러오기가 아직 지원되지 않습니다. 관리자에게 문의하세요.");
    };

    const handleReset = () => {
        // Not implemented for Supabase yet
        alert("온라인 모드에서는 초기화 기능이 제한됩니다.");
    };

    if (profileLoading) return <div className="p-20 text-center">로딩 중...</div>;
    if (!profile || !editForm) return null;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral dark:text-slate-100">프로필</h2>
                <p className="text-slate-500 dark:text-slate-400">나의 정보를 관리하고 데이터를 백업하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center"
                    >
                        <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                            {/* Placeholder for now */}
                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-neutral dark:text-slate-100">{profile.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{profile.targetJob}</p>

                        <div className="w-full space-y-2 text-left text-sm">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <School className="w-4 h-4 text-primary" />
                                <span>{profile.school}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <Book className="w-4 h-4 text-green-500" />
                                <span>{profile.department} {profile.grade}학년</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <h4 className="font-bold mb-4 text-neutral dark:text-slate-100 flex items-center gap-2">
                            <Award className="w-5 h-5 text-point" />
                            활동 요약
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">완료한 마일스톤</span>
                                <span className="font-bold text-neutral dark:text-slate-100">
                                    {milestones.filter(m => m.status === 'completed').length}개
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">포트폴리오 항목</span>
                                <span className="font-bold text-neutral dark:text-slate-100">
                                    {portfolio.length}개
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">총 공부 시간</span>
                                <span className="font-bold text-neutral dark:text-slate-100">
                                    {dailyGoals.reduce((acc, curr) => acc + (curr.studyHours || 0), 0)}시간
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="md:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-neutral dark:text-slate-100">기본 정보 수정</h3>
                            {!isEditing ? (
                                <button
                                    onClick={handleEditToggle}
                                    className="text-primary hover:text-teal-700 font-medium text-sm"
                                >
                                    수정하기
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditToggle}
                                        className="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded text-sm"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-teal-700 text-sm flex items-center gap-1"
                                    >
                                        <Save className="w-3 h-3" /> 저장
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">이름</label>
                                    <input
                                        type="text"
                                        value={isEditing ? editForm.name : profile.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">희망 직무</label>
                                    <input
                                        type="text"
                                        value={isEditing ? editForm.targetJob : profile.targetJob}
                                        onChange={(e) => handleChange('targetJob', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">학교</label>
                                    <input
                                        type="text"
                                        value={isEditing ? editForm.school : profile.school}
                                        onChange={(e) => handleChange('school', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">학과</label>
                                    <input
                                        type="text"
                                        value={isEditing ? editForm.department : profile.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">학년</label>
                                    <input
                                        type="number"
                                        value={isEditing ? editForm.grade : profile.grade}
                                        onChange={(e) => handleChange('grade', parseInt(e.target.value))}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">자기소개</label>
                                <textarea
                                    value={isEditing ? editForm.introduction : profile.introduction}
                                    onChange={(e) => handleChange('introduction', e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">보유 스킬</label>
                                <div className="flex flex-wrap gap-2 mb-2 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 min-h-[60px]">
                                    {(isEditing ? editForm.skills : profile.skills).map((skill) => (
                                        <span key={skill} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-200 shadow-sm">
                                            {skill}
                                            {isEditing && (
                                                <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                    {isEditing && (
                                        <div className="flex items-center gap-1 min-w-[120px]">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                                placeholder="스킬 추가..."
                                                className="w-full bg-transparent text-sm focus:outline-none"
                                            />
                                            <button onClick={addSkill} className="text-primary hover:text-teal-600">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <h3 className="text-lg font-bold mb-4 text-neutral dark:text-slate-100">데이터 관리</h3>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                백업 다운로드
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                백업 불러오기
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".json"
                                className="hidden"
                            />

                            <div className="flex-1"></div>

                            <button
                                onClick={handleReset}
                                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:border-red-900/50 dark:hover:bg-red-900/20"
                            >
                                초기화
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
