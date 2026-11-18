-- =============================================================================
-- SPREE LMS - Database Schema
-- Compatible with: PostgreSQL / Supabase
-- Description: Full schema for the Spree Learning Management System
-- Run this BEFORE supabase_seed.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. roles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id          BIGSERIAL    PRIMARY KEY,
    name        TEXT         NOT NULL UNIQUE,
    description TEXT
);

-- ---------------------------------------------------------------------------
-- 2. users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id                  BIGSERIAL       PRIMARY KEY,
    email               TEXT            NOT NULL UNIQUE,
    password_hash       TEXT            NOT NULL,
    first_name          TEXT            NOT NULL,
    last_name           TEXT            NOT NULL,
    role_id             BIGINT          NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    profile_picture_url TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role_id  ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ---------------------------------------------------------------------------
-- 3. departments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id          BIGSERIAL   PRIMARY KEY,
    name        TEXT        NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. courses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    id              BIGSERIAL   PRIMARY KEY,
    title           TEXT        NOT NULL,
    description     TEXT,
    department_id   BIGINT      NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    teacher_id      BIGINT      NOT NULL REFERENCES users(id)       ON DELETE RESTRICT,
    is_published    BOOLEAN     NOT NULL DEFAULT FALSE,
    thumbnail_url   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id    ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published  ON courses(is_published);

-- ---------------------------------------------------------------------------
-- 5. enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id          BIGSERIAL   PRIMARY KEY,
    student_id  BIGINT      NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    course_id   BIGINT      NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id  ON enrollments(course_id);

-- ---------------------------------------------------------------------------
-- 6. lessons
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lessons (
    id           BIGSERIAL   PRIMARY KEY,
    course_id    BIGINT      NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title        TEXT        NOT NULL,
    content      TEXT,
    lesson_order INT         NOT NULL DEFAULT 0,
    is_published BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id    ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_order ON lessons(course_id, lesson_order);

-- ---------------------------------------------------------------------------
-- 7. materials
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS materials (
    id         BIGSERIAL   PRIMARY KEY,
    lesson_id  BIGINT      NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title      TEXT        NOT NULL,
    file_url   TEXT        NOT NULL,
    file_type  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_lesson_id ON materials(lesson_id);

-- ---------------------------------------------------------------------------
-- 8. assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
    id          BIGSERIAL    PRIMARY KEY,
    course_id   BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       TEXT         NOT NULL,
    description TEXT,
    due_date    TIMESTAMPTZ,
    max_score   NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date  ON assignments(due_date);

-- ---------------------------------------------------------------------------
-- 9. submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id            BIGSERIAL   PRIMARY KEY,
    assignment_id BIGINT      NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id    BIGINT      NOT NULL REFERENCES users(id)        ON DELETE CASCADE,
    content       TEXT,
    file_url      TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status        TEXT        NOT NULL DEFAULT 'DRAFT'
                                CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id    ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status        ON submissions(status);

-- ---------------------------------------------------------------------------
-- 10. grades
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grades (
    id            BIGSERIAL    PRIMARY KEY,
    submission_id BIGINT       NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
    graded_by     BIGINT       NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    score         NUMERIC(5,2) NOT NULL,
    feedback      TEXT,
    graded_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grades_graded_by ON grades(graded_by);

-- ---------------------------------------------------------------------------
-- 11. quizzes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quizzes (
    id                 BIGSERIAL   PRIMARY KEY,
    course_id          BIGINT      NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title              TEXT        NOT NULL,
    description        TEXT,
    time_limit_minutes INT,
    max_attempts       INT         NOT NULL DEFAULT 1,
    is_published       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_course_id    ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_published ON quizzes(is_published);

-- ---------------------------------------------------------------------------
-- 12. questions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id             BIGSERIAL    PRIMARY KEY,
    quiz_id        BIGINT       NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text  TEXT         NOT NULL,
    question_type  TEXT         NOT NULL
                                  CHECK (question_type IN ('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER')),
    question_order INT          NOT NULL DEFAULT 0,
    points         NUMERIC(5,2) NOT NULL DEFAULT 1.00
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz_id        ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_order ON questions(quiz_id, question_order);

-- ---------------------------------------------------------------------------
-- 13. question_options
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_options (
    id          BIGSERIAL PRIMARY KEY,
    question_id BIGINT    NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT      NOT NULL,
    is_correct  BOOLEAN   NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

-- ---------------------------------------------------------------------------
-- 14. quiz_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id           BIGSERIAL    PRIMARY KEY,
    quiz_id      BIGINT       NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id   BIGINT       NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    started_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score        NUMERIC(5,2),
    UNIQUE (quiz_id, student_id, started_at)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id    ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON quiz_attempts(student_id);

-- ---------------------------------------------------------------------------
-- 15. attempt_answers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempt_answers (
    id                 BIGSERIAL PRIMARY KEY,
    attempt_id         BIGINT    NOT NULL REFERENCES quiz_attempts(id)   ON DELETE CASCADE,
    question_id        BIGINT    NOT NULL REFERENCES questions(id)        ON DELETE CASCADE,
    selected_option_id BIGINT             REFERENCES question_options(id) ON DELETE SET NULL,
    text_answer        TEXT
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_id  ON attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_question_id ON attempt_answers(question_id);

-- ---------------------------------------------------------------------------
-- 16. announcements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id         BIGSERIAL   PRIMARY KEY,
    course_id  BIGINT               REFERENCES courses(id) ON DELETE CASCADE,
    author_id  BIGINT      NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
    title      TEXT        NOT NULL,
    content    TEXT        NOT NULL,
    is_global  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_course_id ON announcements(course_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_is_global ON announcements(is_global);

-- ---------------------------------------------------------------------------
-- 17. progress_tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress_tracking (
    id           BIGSERIAL   PRIMARY KEY,
    student_id   BIGINT      NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    lesson_id    BIGINT      NOT NULL REFERENCES lessons(id)  ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_tracking_student_id ON progress_tracking(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_lesson_id  ON progress_tracking(lesson_id);

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
