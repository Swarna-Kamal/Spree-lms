-- V7: Create assignments, submissions, and grades tables
CREATE TABLE IF NOT EXISTS assignments (
    id          BIGSERIAL PRIMARY KEY,
    course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    due_date    TIMESTAMPTZ,
    max_score   NUMERIC(5, 2),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);

CREATE TABLE IF NOT EXISTS submissions (
    id            BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content       TEXT,
    file_url      TEXT,
    submitted_at  TIMESTAMPTZ,
    status        VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                      CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);

CREATE TABLE IF NOT EXISTS grades (
    id            BIGSERIAL PRIMARY KEY,
    submission_id BIGINT UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    graded_by     BIGINT NOT NULL REFERENCES users(id),
    score         NUMERIC(5, 2) NOT NULL,
    feedback      TEXT,
    graded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
