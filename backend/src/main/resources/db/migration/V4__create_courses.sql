-- V4: Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    department_id   BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    teacher_id      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
