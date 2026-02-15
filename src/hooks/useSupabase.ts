"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Database } from "@/lib/database.types";
import {
    Milestone,
    DailyGoal,
    PortfolioItem,
    UserProfile,
    Category
} from "@/lib/types";

type MilestoneRow = Database['public']['Tables']['milestones']['Row'];
type DailyGoalRow = Database['public']['Tables']['daily_goals']['Row'];
type PortfolioRow = Database['public']['Tables']['portfolio_items']['Row'];
type CareerGuideRow = Database['public']['Tables']['career_guides']['Row'];

// --- Mappers to convert DB snake_case to App camelCase ---

const mapMilestone = (row: MilestoneRow): Milestone => ({
    id: row.id,
    title: row.title,
    description: row.description || "",
    category: row.category as Category,
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    status: row.status as any,
    progress: row.progress || 0,
    tasks: row.tasks ? JSON.parse(JSON.stringify(row.tasks)) : [],
    order: row.order || 0
});

const mapDailyGoal = (row: DailyGoalRow): DailyGoal => ({
    id: row.id,
    date: row.date,
    goals: row.goals ? JSON.parse(JSON.stringify(row.goals)) : [],
    reflection: row.reflection || "",
    mood: (row.mood as 1 | 2 | 3 | 4 | 5) || 3,
    studyHours: row.study_hours || 0
});

const mapPortfolio = (row: PortfolioRow): PortfolioItem => ({
    id: row.id,
    type: row.type as any,
    title: row.title,
    description: row.description || "",
    date: row.date || "",
    tags: row.tags || [],
    images: row.images || [],
    links: row.links ? JSON.parse(JSON.stringify(row.links)) : undefined,
    details: row.details || ""
});

// --- Hooks ---

export function useSupabaseProfile() {
    const { profile, session } = useAuth();
    const [loading, setLoading] = useState(false);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!session?.user) return;
        setLoading(true);
        try {
            const dbUpdates = {
                name: updates.name,
                school: updates.school,
                department: updates.department,
                grade: updates.grade,
                target_job: updates.targetJob,
                target_company: updates.targetCompany,
                skills: updates.skills,
                introduction: updates.introduction,
                profile_image: updates.profileImage,
            };

            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', session.user.id);

            if (error) throw error;
            // Optimistic update or refetch? AuthProvider listens to changes usually, 
            // but manual refetch might be needed if AuthProvider doesn't poll.
            // Ideally AuthProvider should expose a refresh function.
            window.location.reload(); // Simple brute force refresh for profile updates or use a context method
        } catch (e) {
            console.error(e);
            alert("프로필 수정 실패");
        } finally {
            setLoading(false);
        }
    };

    const uploadProfileImage = async (file: File) => {
        if (!session?.user) return;
        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await updateProfile({ profileImage: publicUrl });
        } catch (e) {
            console.error(e);
            alert("이미지 업로드 실패");
        } finally {
            setLoading(false);
        }
    };

    const userProfile: UserProfile | null = profile ? {
        role: profile.role,
        name: profile.name,
        school: profile.school || "",
        department: profile.department || "",
        grade: profile.grade || 0,
        targetJob: profile.target_job || "",
        targetCompany: profile.target_company || [],
        skills: profile.skills || [],
        introduction: profile.introduction || "",
        profileImage: profile.profile_image || undefined
    } : null;

    return { profile: userProfile, updateProfile, uploadProfileImage, loading };
}

export function useSupabaseMilestones() {
    const { user } = useAuth();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMilestones = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('milestones')
                .select('*')
                .eq('user_id', user.id)
                .order('order', { ascending: true }); // or start_date

            if (error) throw error;
            setMilestones((data || []).map(mapMilestone));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMilestones();
    }, [fetchMilestones]);

    // CRUD wrappers
    const addMilestone = async (m: Milestone) => {
        if (!user) return;
        const { error } = await supabase.from('milestones').insert({
            user_id: user.id,
            title: m.title,
            description: m.description,
            category: m.category,
            start_date: m.startDate,
            end_date: m.endDate,
            status: m.status,
            progress: m.progress,
            tasks: m.tasks as any, // JSON
            order: m.order
        });
        if (!error) fetchMilestones();
    };

    const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
        if (!user) return;
        // Map updates to snake_case... simplified for now
        // This part requires careful mapping.
        // For MVP, assume full object replacement or specific field updates.
        // Let's implement full update for simplicity if we pass full object, 
        // but hook usually gets Partial.

        const dbUpdates: any = {};
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.category) dbUpdates.category = updates.category;
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
        if (updates.tasks) dbUpdates.tasks = updates.tasks;
        if (updates.order !== undefined) dbUpdates.order = updates.order;

        const { error } = await supabase.from('milestones').update(dbUpdates).eq('id', id);
        if (!error) fetchMilestones();
    };

    const deleteMilestone = async (id: string) => {
        const { error } = await supabase.from('milestones').delete().eq('id', id);
        if (!error) fetchMilestones();
    };

    return { milestones, loading, addMilestone, updateMilestone, deleteMilestone, refresh: fetchMilestones };
}

export function useSupabaseDailyGoals() {
    const { user } = useAuth();
    const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDailyGoals = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('daily_goals')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setDailyGoals((data || []).map(mapDailyGoal));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDailyGoals();
    }, [fetchDailyGoals]);

    const updateDailyGoal = async (date: string, updates: Partial<DailyGoal>) => {
        if (!user) return;

        // Upsert logic is better for daily goals
        // First check if exists
        const { data: existing } = await supabase
            .from('daily_goals')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', date)
            .single();

        const dbUpdates: any = {
            user_id: user.id,
            date: date
        };
        if (updates.goals) dbUpdates.goals = updates.goals;
        if (updates.reflection) dbUpdates.reflection = updates.reflection;
        if (updates.mood) dbUpdates.mood = updates.mood;
        if (updates.studyHours !== undefined) dbUpdates.study_hours = updates.studyHours;

        let error;
        if (existing) {
            const { error: e } = await supabase.from('daily_goals').update(dbUpdates).eq('id', existing.id);
            error = e;
        } else {
            const { error: e } = await supabase.from('daily_goals').insert(dbUpdates);
            error = e;
        }

        if (!error) fetchDailyGoals();
    };

    return { dailyGoals, loading, updateDailyGoal, refresh: fetchDailyGoals };
}

export function useSupabasePortfolio() {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPortfolio = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('*')
                .eq('user_id', user.id);
            if (error) throw error;
            setPortfolio((data || []).map(mapPortfolio));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

    // CRUD...
    const addPortfolio = async (item: PortfolioItem) => {
        if (!user) return;
        const { error } = await supabase.from('portfolio_items').insert({
            user_id: user.id,
            type: item.type,
            title: item.title,
            description: item.description,
            date: item.date,
            tags: item.tags,
            images: item.images,
            links: item.links as any,
            details: item.details
        });
        if (!error) fetchPortfolio();
    };

    const updatePortfolio = async (id: string, item: Partial<PortfolioItem>) => {
        if (!user) return;
        const dbUpdates: any = {};
        // Mapping...
        if (item.title) dbUpdates.title = item.title;
        // ... (simplified)
        if (item.details) dbUpdates.details = item.details;

        const { error } = await supabase.from('portfolio_items').update(dbUpdates).eq('id', id);
        if (!error) fetchPortfolio();
    };

    const deletePortfolio = async (id: string) => {
        const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
        if (!error) fetchPortfolio();
    };

    return { portfolio, loading, addPortfolio, updatePortfolio, deletePortfolio, refresh: fetchPortfolio };
}

export function useCareerGuides() {
    const [guides, setGuides] = useState<CareerGuideRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from('career_guides').select('*').then(({ data }) => {
            setGuides(data || []);
            setLoading(false);
        });
    }, []);

    return { guides, loading };
}

export function useSupabaseDashboardStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalGoalsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyHours: 0,
        completedMilestones: 0,
        totalMilestones: 0,
        portfolioItemCount: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        try {
            // Parallel fetch for efficiency
            const [
                { data: milestones },
                { data: dailyGoals },
                { count: portfolioCount }
            ] = await Promise.all([
                supabase.from('milestones').select('status').eq('user_id', user.id),
                supabase.from('daily_goals').select('goals, study_hours, date').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
            ]);

            let totalGoals = 0;
            let totalHours = 0;

            // Goals & Hours
            (dailyGoals || []).forEach((day: any) => {
                const goals = day.goals ? (typeof day.goals === 'string' ? JSON.parse(day.goals) : day.goals) : [];
                const completed = Array.isArray(goals) ? goals.filter((g: any) => g.completed).length : 0;
                totalGoals += completed;
                totalHours += day.study_hours || 0;
            });

            // Milestones logic
            const totalMilestones = milestones?.length || 0;
            const completedMilestones = milestones?.filter((m: any) => m.status === 'completed').length || 0;

            setStats({
                totalGoalsCompleted: totalGoals,
                currentStreak: 0, // Implement streak logic later if needed
                longestStreak: 0,
                totalStudyHours: totalHours,
                completedMilestones,
                totalMilestones,
                portfolioItemCount: portfolioCount || 0
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return { stats, loading, refresh: fetchStats };
}

// --- Admin Hooks ---

export function useAdminStudents() {
    const { user } = useAuth();
    const [students, setStudents] = useState<any[]>([]); // Replace any with proper type
    const [loading, setLoading] = useState(true);

    const fetchStudents = useCallback(async () => {
        if (!user) return;
        // Check if admin? AuthProvider should handle protection, but RLS will also enforce.
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('student_number', { ascending: true }); // Assuming student_number exists or maps to it

            if (error) throw error;
            setStudents(data || []);
        } catch (e) {
            console.error("Fetch students failed", e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    return { students, loading, refresh: fetchStudents };
}

export function useCounselingLogs(studentId?: string) {
    const { user } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        if (!user) return;
        try {
            let query = supabase.from('counseling_logs').select('*').order('created_at', { ascending: false });
            if (studentId) {
                query = query.eq('student_id', studentId);
            }

            const { data, error } = await query;
            if (error) throw error;
            setLogs(data || []);
        } catch (e) {
            console.error("Fetch logs failed", e);
        } finally {
            setLoading(false);
        }
    }, [user, studentId]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const addLog = async (log: { student_id: string, content: string, type: 'regular' | 'career' | 'crisis' }) => {
        if (!user) return;
        const { error } = await supabase.from('counseling_logs').insert({
            counselor_id: user.id,
            student_id: log.student_id,
            content: log.content,
            type: log.type,
            date: new Date().toISOString()
        });
        if (!error) fetchLogs();
    };

    return { logs, loading, addLog, refresh: fetchLogs };
}
