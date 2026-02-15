"use client";

import { useAdminStudents } from "@/hooks/useSupabase";
import { useState } from "react";
import { User, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminPage() {
    const { students, loading } = useAdminStudents();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = students.filter(s =>
        s.name?.includes(searchTerm) ||
        s.student_number?.includes(searchTerm) ||
        s.department?.includes(searchTerm)
    );

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral dark:text-slate-100">학생 관리</h2>
                <p className="text-slate-500 dark:text-slate-400">등록된 학생 목록을 조회하고 관리합니다.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="이름, 학번, 학과로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">학생 정보</th>
                            <th className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">학과/학년</th>
                            <th className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">희망 직무</th>
                            <th className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">상태</th>
                            <th className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id} className="border-b last:border-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.student_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{student.department}</p>
                                        <p className="text-xs text-slate-500">{student.grade}학년</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {student.target_job || "미정"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            재학
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/student?id=${student.id}`} className="text-slate-400 hover:text-primary transition-colors inline-block p-2">
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
