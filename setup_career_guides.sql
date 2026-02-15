-- Create career_guides table with full schema
CREATE TABLE IF NOT EXISTS career_guides (
  id uuid default uuid_generate_v4() primary key,
  job_category text not null,
  title text not null DEFAULT '',
  description text,
  roadmap_template jsonb,
  guide_text text not null DEFAULT '',
  recommended_activities text[],
  checklist text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE career_guides ENABLE ROW LEVEL SECURITY;

-- Create Policy if not exists (using DO block to avoid error if policy exists, or just CREATE POLICY IF NOT EXISTS in newer PG versions)
-- For simplicity in Supabase SQL editor which might not support complex DO blocks easily, we just run CREATE.
-- If policy exists, it will error, but table creation is main goal.
-- We can DROP POLICY IF EXISTS first to be safe.
DROP POLICY IF EXISTS "Guides are viewable by everyone." ON career_guides;
CREATE POLICY "Guides are viewable by everyone." ON career_guides FOR SELECT USING ( true );

-- Insert sample Career Guides (Seed Data)
INSERT INTO career_guides (job_category, title, description, recommended_activities, roadmap_template)
VALUES 
(
    '프론트엔드 개발자',
    '프론트엔드 개발자 로드맵',
    '웹 프론트엔드 개발자가 되기 위한 단계별 학습 가이드입니다.',
    ARRAY['Github 1일 1커밋', '기술 블로그 운영', '오픈소스 기여'],
    '[
        {"title": "HTML/CSS 기초", "description": "웹 표준과 스타일링 기초 학습", "category": "study", "duration": 30},
        {"title": "JavaScript 심화", "description": "ES6+ 문법 및 비동기 프로그래밍", "category": "study", "duration": 45},
        {"title": "React 프로젝트", "description": "컴포넌트 기반 웹 앱 개발", "category": "project", "duration": 60},
        {"title": "정보처리기능사", "description": "필기 및 실기 취득", "category": "certificate", "duration": 90}
    ]'::jsonb
),
(
    'UI/UX 디자이너',
    'UI/UX 디자이너 로드맵',
    '사용자 경험을 설계하는 디자이너가 되기 위한 가이드입니다.',
    ARRAY['Behance 포트폴리오 관리', 'Daily UI Challenge', '디자인 시스템 분석'],
    '[
        {"title": "포토샵/일러스트레이터", "description": "디자인 툴 숙련도 향상", "category": "study", "duration": 45},
        {"title": "UI/UX 기초", "description": "사용자 경험 설계 원칙 학습", "category": "study", "duration": 30},
        {"title": "GTQ 1급", "description": "그래픽기술자격 취득", "category": "certificate", "duration": 30},
        {"title": "포트폴리오 제작", "description": "비핸스/노션 포트폴리오", "category": "project", "duration": 60}
    ]'::jsonb
);
