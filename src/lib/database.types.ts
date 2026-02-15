export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'student' | 'admin'
                    name: string
                    school: string | null
                    department: string | null
                    grade: number | null
                    target_job: string | null
                    target_company: string[] | null
                    skills: string[] | null
                    introduction: string | null
                    profile_image: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    role?: 'student' | 'admin'
                    name: string
                    school?: string | null
                    department?: string | null
                    grade?: number | null
                    target_job?: string | null
                    target_company?: string[] | null
                    skills?: string[] | null
                    introduction?: string | null
                    profile_image?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'student' | 'admin'
                    name?: string
                    school?: string | null
                    department?: string | null
                    grade?: number | null
                    target_job?: string | null
                    target_company?: string[] | null
                    skills?: string[] | null
                    introduction?: string | null
                    profile_image?: string | null
                    created_at?: string
                }
            }
            career_guides: {
                Row: {
                    id: string
                    job_category: string
                    title: string
                    description: string | null
                    roadmap_template: Json | null
                    guide_text: string
                    recommended_activities: string[] | null
                    checklist: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    job_category: string
                    title: string
                    description?: string | null
                    roadmap_template?: Json | null
                    guide_text: string
                    recommended_activities?: string[] | null
                    checklist?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    job_category?: string
                    title?: string
                    description?: string | null
                    roadmap_template?: Json | null
                    guide_text?: string
                    recommended_activities?: string[] | null
                    checklist?: string[] | null
                    created_at?: string
                }
            }
            counseling_logs: {
                Row: {
                    id: string
                    student_id: string
                    admin_id: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    admin_id: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    admin_id?: string
                    content?: string
                    created_at?: string
                }
            }
            milestones: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    category: string
                    start_date: string | null
                    end_date: string | null
                    status: 'not-started' | 'in-progress' | 'completed'
                    progress: number
                    tasks: Json | null
                    order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    category: string
                    start_date?: string | null
                    end_date?: string | null
                    status?: 'not-started' | 'in-progress' | 'completed'
                    progress?: number
                    tasks?: Json | null
                    order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    category?: string
                    start_date?: string | null
                    end_date?: string | null
                    status?: 'not-started' | 'in-progress' | 'completed'
                    progress?: number
                    tasks?: Json | null
                    order?: number | null
                    created_at?: string
                }
            }
            daily_goals: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    goals: Json | null
                    reflection: string | null
                    mood: number | null
                    study_hours: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    goals?: Json | null
                    reflection?: string | null
                    mood?: number | null
                    study_hours?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    goals?: Json | null
                    reflection?: string | null
                    mood?: number | null
                    study_hours?: number | null
                    created_at?: string
                }
            }
            portfolio_items: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    title: string
                    description: string | null
                    date: string | null
                    tags: string[] | null
                    images: string[] | null
                    links: Json | null
                    details: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    title: string
                    description?: string | null
                    date?: string | null
                    tags?: string[] | null
                    images?: string[] | null
                    links?: Json | null
                    details?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type: string
                    title: string
                    description?: string | null
                    date?: string | null
                    tags?: string[] | null
                    images?: string[] | null
                    links?: Json | null
                    details?: string | null
                    created_at?: string
                }
            }
        }
    }
}
