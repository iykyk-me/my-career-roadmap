"use client";

import { useState, useEffect } from "react";
import {
    UserProfile,
    Milestone,
    DailyGoal,
    PortfolioItem,
    DashboardStats,
} from "../lib/types";

const STORAGE_PREFIX = "career-roadmap-";

// Sample Data
const initialProfile: UserProfile = {
    role: "student",
    name: "김학생",
    school: "코딩특성화고등학교",
    department: "소프트웨어과",
    grade: 2,
    targetJob: "프론트엔드 개발자",
    targetCompany: ["네이버", "카카오", "토스"],
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    introduction: "안녕하세요! 사용자 경험을 중요하게 생각하는 프론트엔드 개발자 지망생입니다.",
};

const initialMilestones: Milestone[] = [
    {
        id: "m1",
        title: "정보처리기능사 취득",
        description: "전공 필수 자격증 취득하기",
        category: "certificate",
        startDate: "2024-03-01",
        endDate: "2024-06-30",
        status: "in-progress",
        progress: 60,
        tasks: [
            { id: "t1", title: "필기 기출문제 풀기", completed: true },
            { id: "t2", title: "실기 강의 수강", completed: false },
        ],
        order: 1,
    },
    {
        id: "m2",
        title: "개인 블로그 포트폴리오 제작",
        description: "Next.js를 활용한 나만의 블로그 만들기",
        category: "project",
        startDate: "2024-05-01",
        endDate: "2024-08-31",
        status: "in-progress",
        progress: 30,
        tasks: [
            { id: "t3", title: "기획 및 디자인", completed: true },
            { id: "t4", title: "개발 환경 설정", completed: true },
            { id: "t5", title: "메인 페이지 구현", completed: false },
        ],
        order: 2,
    },
];

const initialDailyGoals: DailyGoal[] = [];
// We generally start empty or maybe with today's empty entry, but let's leave it empty for now 
// to let the UI handle creation.

const initialPortfolio: PortfolioItem[] = [
    {
        id: "p1",
        type: "project",
        title: "급식 알리미 앱",
        description: "학교 급식 메뉴를 매일 아침 알려주는 안드로이드 앱",
        date: "2023-11-20",
        tags: ["Android", "Kotlin", "Jsoup"],
        details: "# 급식 알리미 앱\n\n학교 홈페이지를 파싱하여 오늘의 급식을 보여주는 앱입니다.",
        links: { github: "https://github.com/kimstudent/school-meal-app" }
    }
];


// Generic Hook Factory
function createStorageHook<T>(key: string, initialValue: T) {
    return function useStorageHook() {
        const [data, setData] = useState<T>(initialValue);
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            const stored = localStorage.getItem(STORAGE_PREFIX + key);
            if (stored) {
                try {
                    setData(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse storage", e);
                }
            } else {
                // Initialize with default if empty
                localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialValue));
            }
            setLoaded(true);
        }, []);

        const setValue = (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(data) : value;
                setData(valueToStore);
                if (typeof window !== "undefined") {
                    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(error);
            }
        };

        return { data, setData: setValue, loaded };
    };
}

export const useProfile = createStorageHook<UserProfile>("profile", initialProfile);
export const useMilestones = createStorageHook<Milestone[]>("milestones", initialMilestones);
export const useDailyGoals = createStorageHook<DailyGoal[]>("daily-goals", initialDailyGoals);
export const usePortfolio = createStorageHook<PortfolioItem[]>("portfolio", initialPortfolio);

export function useDashboardStats() {
    const { data: milestones } = useMilestones();
    const { data: dailyGoals } = useDailyGoals();
    const { data: portfolio } = usePortfolio();

    const [stats, setStats] = useState<DashboardStats>({
        totalGoalsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyHours: 0,
        completedMilestones: 0,
        totalMilestones: 0,
        portfolioItemCount: 0
    });

    useEffect(() => {
        let totalGoals = 0;
        let totalHours = 0;
        let streak = 0;
        // Simple streak calculation (consecutive days with at least one completed goal)
        // Sort daily goals by date descending
        const sortedGoals = [...dailyGoals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate Streak logic could be more complex, simplification for now:
        // We need to check if 'today' or 'yesterday' matches the latest entry and chain backwards.

        sortedGoals.forEach(day => {
            const completedInDay = day.goals.filter(g => g.completed).length;
            totalGoals += completedInDay;
            totalHours += day.studyHours || 0;
        });

        const completedMilestones = milestones.filter(m => m.status === 'completed').length;

        setStats({
            totalGoalsCompleted: totalGoals,
            currentStreak: 0, // Todo: Implement correct streak logic
            longestStreak: 0, // Todo
            totalStudyHours: totalHours,
            completedMilestones,
            totalMilestones: milestones.length,
            portfolioItemCount: portfolio.length
        });
    }, [milestones, dailyGoals, portfolio]);

    return stats;
}
