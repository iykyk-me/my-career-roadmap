"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCounselingLogs } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, User, Calendar, MessageSquare, Plus, Save, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function StudentDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [student, setStudent] = useState<any>(null);
    const [loadingStudent, setLoadingStudent] = useState(true);

    // Counseling Logs
    const { logs, loading: logsLoading, addLog } = useCounselingLogs(id);
    const [newLogContent, setNewLogContent] = useState("");
    const [logType, setLogType] = useState<'regular' | 'career' | 'crisis'>('regular');

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) return;
            const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (!error) setStudent(data);
            setLoadingStudent(false);
        };
        fetchStudent();
    }, [id]);

    const handleAddLog = async () => {
        if (!newLogContent.trim()) return;
        await addLog({
            student_id: id,
            content: newLogContent,
            type: logType
        });
        setNewLogContent("");
        alert("상담 일지가 등록되었습니다.");
    };

    if (loadingStudent || logsLoading) return <div className="p-20 text-center">로딩 중...</div>;
    if (!student) return <div className="p-20 text-center">학생을 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <Link href="/admin" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로 돌아가기
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 flex items-center justify-center">
                                <User className="w-12 h-12 text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.name}</h2>
                            <p className="text-slate-500">{student.student_number}</p>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span className="text-slate-500">학과</span>
                                <span className="font-medium text-slate-900 dark:text-slate-200">{student.department}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span className="text-slate-500">학년</span>
                                <span className="font-medium text-slate-900 dark:text-slate-200">{student.grade}학년</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span className="text-slate-500">희망 직무</span>
                                <span className="font-medium text-slate-900 dark:text-slate-200">{student.target_job}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span className="text-slate-500">희망 기업</span>
                                <span className="font-medium text-slate-900 dark:text-slate-200">
                                    {Array.isArray(student.target_company) ? student.target_company.join(", ") : student.target_company}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">자기소개</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                {student.introduction || "작성된 자기소개가 없습니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Counseling Logs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            상담 일지 작성
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                {(['regular', 'career', 'crisis'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setLogType(type)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${logType === type
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                            }`}
                                    >
                                        {type === 'regular' ? '정기상담' : type === 'career' ? '진로지도' : '위기상담'}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={newLogContent}
                                onChange={(e) => setNewLogContent(e.target.value)}
                                placeholder="상담 내용을 입력하세요..."
                                rows={4}
                                className="w-full px-4 py-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddLog}
                                    disabled={!newLogContent.trim()}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    일지 저장
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 ml-1">상담 기록 ({logs.length})</h3>
                        {logs.length > 0 ? (
                            logs.map(log => (
                                <div key={log.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.type === 'crisis' ? 'bg-red-100 text-red-700' :
                                                    log.type === 'career' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {log.type === 'regular' ? '정기상담' : log.type === 'career' ? '진로지도' : '위기상담'}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(log.date), 'yyyy.MM.dd HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{log.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300">
                                기록된 상담 일지가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
