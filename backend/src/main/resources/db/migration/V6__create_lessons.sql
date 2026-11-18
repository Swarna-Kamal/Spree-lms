-- V6: Create lessons and materials tables
CREATE TABLE IF NOT EXISTS lessons (
    id           BIGSERIAL PRIMARY KEY,
    course_id    BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title        VARCHAR(255) NOT NULL,
    content      TEXT,
    lesson_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);

CREATE TABLE IF NOT EXISTS materials (
    id         BIGSERIAL PRIMARY KEY,
    lesson_id  BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    file_url   TEXT NOT NULL,
    file_type  VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_lesson_id ON materials(lesson_id);
