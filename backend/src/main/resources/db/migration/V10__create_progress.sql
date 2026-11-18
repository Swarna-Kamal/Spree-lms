-- V10: Create progress_tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
    id           BIGSERIAL PRIMARY KEY,
    student_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id    BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_progress UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_student_id ON progress_tracking(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress_tracking(lesson_id);
