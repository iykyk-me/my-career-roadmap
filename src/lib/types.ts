
export type Category = 'study' | 'certificate' | 'project' | 'activity' | 'job-prep' | 'award' | 'experience';

export interface UserProfile {
    role: 'student' | 'admin';
    name: string;
    school: string;
    department: string;
    grade: number;
    targetJob: string;
    targetCompany: string[];
    skills: string[];
    introduction: string;
    profileImage?: string; // Base64 or URL
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    category: Category;
    startDate: string;
    endDate: string;
    status: 'not-started' | 'in-progress' | 'completed';
    progress: number; // 0-100
    tasks: Task[];
    order: number;
}

export interface GoalItem {
    id: string;
    text: string;
    completed: boolean;
    category: Category;
    linkedMilestoneId?: string;
}

export interface DailyGoal {
    id: string;
    date: string; // YYYY-MM-DD
    goals: GoalItem[];
    reflection: string;
    mood: 1 | 2 | 3 | 4 | 5; // 1: Very Bad, 5: Very Good
    studyHours: number;
}

export interface PortfolioItem {
    id: string;
    type: 'project' | 'certificate' | 'award' | 'activity' | 'experience';
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    tags: string[];
    images?: string[]; // Base64 or URL
    links?: {
        github?: string;
        demo?: string;
        other?: string;
    };
    details: string; // Markdown content
}

export interface DashboardStats {
    totalGoalsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyHours: number;
    completedMilestones: number;
    totalMilestones: number;
    portfolioItemCount: number;
}
