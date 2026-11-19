-- V13: Enhance materials table and submissions for file management
ALTER TABLE materials ADD COLUMN IF NOT EXISTS course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE materials ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS uploaded_by BIGINT REFERENCES users(id);

-- Alter lesson_id in materials to be NULLABLE so materials can be course-level or lesson-level
ALTER TABLE materials ALTER COLUMN lesson_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_materials_course_id ON materials(course_id);

-- Add file metadata columns to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_size BIGINT;
