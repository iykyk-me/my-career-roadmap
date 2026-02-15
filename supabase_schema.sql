-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('student', 'admin')) default 'student',
  name text not null,
  school text,
  department text,
  grade int,
  target_job text,
  target_company text[], -- Array of strings
  skills text[],        -- Array of strings
  introduction text,
  profile_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create career_guides table
create table career_guides (
  id uuid default uuid_generate_v4() primary key,
  job_category text not null, -- e.g., 'marketing', 'development'
  guide_text text not null,
  recommended_activities text[],
  checklist text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create counseling_logs table (Admin only)
create table counseling_logs (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) not null,
  admin_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create milestones table
create table milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  description text,
  category text not null,
  start_date date,
  end_date date,
  status text check (status in ('not-started', 'in-progress', 'completed')) default 'not-started',
  progress int default 0,
  tasks jsonb default '[]'::jsonb, -- Store tasks as JSONB
  "order" int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create daily_goals table
create table daily_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  date date not null,
  goals jsonb default '[]'::jsonb, -- Store goals array as JSONB
  reflection text,
  mood int,
  study_hours numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Create portfolio_items table
create table portfolio_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  type text not null,
  title text not null,
  description text,
  date date,
  tags text[],
  images text[],
  links jsonb,
  details text, -- Markdown content
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)

-- Profiles: 
-- Public read for own profile, Admin read all
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Career Guides: Readable by everyone, insert/update by Admin only
alter table career_guides enable row level security;
create policy "Guides are viewable by everyone." on career_guides for select using ( true );
-- (Add admin policies later if needed, for now read-only for students is key)

-- Counseling Logs: Admin read/write/update
alter table counseling_logs enable row level security;
-- Policy for Admin to view/edit logs (requires determining admin role in policy, sophisticated)
-- For simplicity in this demo, we might allow read based on user_id involved or role check function.
-- Let's stick to basic "Users can see their own logs"? No, these are admin notes.
-- Simplified: Everyone can't see, only if role='admin'. 
-- We need a custom hook or function to check role. 
-- For MVP, let's allow "insert" for now and rely on app logic, or skip RLS complexity for admin features in step 1.

-- Milestones/Daily/Portfolio: Users can CRUD their own data
alter table milestones enable row level security;
create policy "Users can CRUD their own milestones." on milestones for all using ( auth.uid() = user_id );

alter table daily_goals enable row level security;
create policy "Users can CRUD their own daily goals." on daily_goals for all using ( auth.uid() = user_id );

alter table portfolio_items enable row level security;
create policy "Users can CRUD their own portfolio." on portfolio_items for all using ( auth.uid() = user_id );
