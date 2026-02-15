-- Add missing columns to career_guides
ALTER TABLE career_guides 
ADD COLUMN title text NOT NULL DEFAULT '',
ADD COLUMN description text,
ADD COLUMN roadmap_template jsonb;
