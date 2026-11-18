-- V8: Create quizzes, questions, options, attempts, and answers tables
CREATE TABLE IF NOT EXISTS quizzes (
    id                 BIGSERIAL PRIMARY KEY,
    course_id          BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    time_limit_minutes INT,
    max_attempts       INT NOT NULL DEFAULT 1,
    is_published       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);

CREATE TABLE IF NOT EXISTS questions (
    id             BIGSERIAL PRIMARY KEY,
    quiz_id        BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text  TEXT NOT NULL,
    question_type  VARCHAR(20) NOT NULL
                       CHECK (question_type IN ('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER')),
    question_order INT NOT NULL DEFAULT 0,
    points         NUMERIC(5, 2)
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);

CREATE TABLE IF NOT EXISTS question_options (
    id          BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id           BIGSERIAL PRIMARY KEY,
    quiz_id      BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score        NUMERIC(5, 2)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_id ON quiz_attempts(student_id);

CREATE TABLE IF NOT EXISTS attempt_answers (
    id                 BIGSERIAL PRIMARY KEY,
    attempt_id         BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id        BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id BIGINT REFERENCES question_options(id) ON DELETE SET NULL,
    text_answer        TEXT
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_id ON attempt_answers(attempt_id);
