-- 1. Create PROFILES table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  name text,
  school text,
  department text,
  grade int,
  student_number text,
  target_job text,
  target_company text[],
  skills text[],
  introduction text,
  profile_image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create CAREER_GUIDES table
CREATE TABLE IF NOT EXISTS public.career_guides (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_category text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text,
  roadmap_template jsonb,
  guide_text text NOT NULL DEFAULT '',
  recommended_activities text[],
  checklist text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create COUNSELING_LOGS table
CREATE TABLE IF NOT EXISTS public.counseling_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) NOT NULL,
  admin_id uuid REFERENCES public.profiles(id),
  content text NOT NULL,
  type text DEFAULT 'regular' CHECK (type IN ('regular', 'career', 'crisis')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create MILESTONES table
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  start_date date,
  end_date date,
  status text CHECK (status IN ('not-started', 'in-progress', 'completed')) DEFAULT 'not-started',
  progress int DEFAULT 0,
  tasks jsonb DEFAULT '[]'::jsonb,
  "order" int,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create DAILY_GOALS table
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  date date NOT NULL,
  goals jsonb DEFAULT '[]'::jsonb,
  reflection text,
  mood int,
  study_hours numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

-- 6. Create PORTFOLIO_ITEMS table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  date date,
  tags text[],
  images text[],
  links jsonb,
  details text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- 8. Create Policies (Drop existing first to avoid errors)

-- PROFILES Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- CAREER_GUIDES Policies
DROP POLICY IF EXISTS "Guides are viewable by everyone." ON public.career_guides;
CREATE POLICY "Guides are viewable by everyone." ON public.career_guides FOR SELECT USING (true);

-- MILESTONES / DAILY_GOALS / PORTFOLIO Policies
DROP POLICY IF EXISTS "Users can CRUD their own milestones." ON public.milestones;
CREATE POLICY "Users can CRUD their own milestones." ON public.milestones FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD their own daily goals." ON public.daily_goals;
CREATE POLICY "Users can CRUD their own daily goals." ON public.daily_goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD their own portfolio." ON public.portfolio_items;
CREATE POLICY "Users can CRUD their own portfolio." ON public.portfolio_items FOR ALL USING (auth.uid() = user_id);

-- COUNSELING_LOGS Policies
DROP POLICY IF EXISTS "Student can see own logs" ON public.counseling_logs;
CREATE POLICY "Student can see own logs" ON public.counseling_logs FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Authenticated users can insert logs" ON public.counseling_logs;
CREATE POLICY "Authenticated users can insert logs" ON public.counseling_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 9. Create Trigger for New User Profile Creation
-- This automatically creates a profile row when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
