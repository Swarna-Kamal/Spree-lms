-- =============================================================================
-- SPREE LMS - Seed Data
-- Compatible with: PostgreSQL / Supabase
-- Description: Demo data for development and testing
-- Run this AFTER supabase_schema.sql
--
-- All passwords represent: Spree@123
-- bcrypt hash (cost 12): $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Roles
-- ---------------------------------------------------------------------------
INSERT INTO roles (name, description) VALUES
    ('ADMIN',   'Full platform administrator with unrestricted access'),
    ('TEACHER', 'Course creator and instructor'),
    ('STUDENT', 'Learner enrolled in one or more courses')
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Users
-- ---------------------------------------------------------------------------
-- Admin
INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active) VALUES
    (
        'admin@spree.edu',
        -- bcrypt hash of Spree@123 (cost factor 12)
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'System', 'Administrator',
        (SELECT id FROM roles WHERE name = 'ADMIN'),
        TRUE
    )
ON CONFLICT (email) DO NOTHING;

-- Teachers
INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active) VALUES
    (
        'teacher1@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Alice', 'Morgan',
        (SELECT id FROM roles WHERE name = 'TEACHER'),
        TRUE
    ),
    (
        'teacher2@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Bob', 'Nguyen',
        (SELECT id FROM roles WHERE name = 'TEACHER'),
        TRUE
    )
ON CONFLICT (email) DO NOTHING;

-- Students
INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active) VALUES
    (
        'student1@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Carlos', 'Rivera',
        (SELECT id FROM roles WHERE name = 'STUDENT'),
        TRUE
    ),
    (
        'student2@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Diana', 'Chen',
        (SELECT id FROM roles WHERE name = 'STUDENT'),
        TRUE
    ),
    (
        'student3@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Ethan', 'Kim',
        (SELECT id FROM roles WHERE name = 'STUDENT'),
        TRUE
    ),
    (
        'student4@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'Fatima', 'Hassan',
        (SELECT id FROM roles WHERE name = 'STUDENT'),
        TRUE
    ),
    (
        'student5@spree.edu',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0NKdSpreeX',
        'George', 'Patel',
        (SELECT id FROM roles WHERE name = 'STUDENT'),
        TRUE
    )
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Departments
-- ---------------------------------------------------------------------------
INSERT INTO departments (name, description) VALUES
    ('Computer Science', 'Programming, algorithms, software engineering, and AI'),
    ('Mathematics',      'Pure and applied mathematics, statistics, and logic'),
    ('Business',         'Management, marketing, finance, and entrepreneurship')
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. Courses
-- ---------------------------------------------------------------------------
INSERT INTO courses (title, description, department_id, teacher_id, is_published) VALUES
    (
        'Introduction to Python Programming',
        'A beginner-friendly course covering Python fundamentals, data structures, and basic scripting.',
        (SELECT id FROM departments WHERE name = 'Computer Science'),
        (SELECT id FROM users      WHERE email = 'teacher1@spree.edu'),
        TRUE
    ),
    (
        'Data Structures & Algorithms',
        'Deep dive into arrays, linked lists, trees, graphs, sorting, and complexity analysis.',
        (SELECT id FROM departments WHERE name = 'Computer Science'),
        (SELECT id FROM users      WHERE email = 'teacher1@spree.edu'),
        TRUE
    ),
    (
        'Calculus I',
        'Limits, derivatives, integrals, and the fundamental theorem of calculus.',
        (SELECT id FROM departments WHERE name = 'Mathematics'),
        (SELECT id FROM users      WHERE email = 'teacher2@spree.edu'),
        TRUE
    ),
    (
        'Principles of Marketing',
        'Market research, consumer behavior, branding, digital marketing, and campaign strategy.',
        (SELECT id FROM departments WHERE name = 'Business'),
        (SELECT id FROM users      WHERE email = 'teacher2@spree.edu'),
        FALSE
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5. Enrollments  (students 1-3 in Python; students 2-4 in Calculus I)
-- ---------------------------------------------------------------------------
INSERT INTO enrollments (student_id, course_id, is_active) VALUES
    -- Python Programming
    ((SELECT id FROM users WHERE email = 'student1@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'), TRUE),
    ((SELECT id FROM users WHERE email = 'student2@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'), TRUE),
    ((SELECT id FROM users WHERE email = 'student3@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'), TRUE),
    -- Data Structures
    ((SELECT id FROM users WHERE email = 'student1@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Data Structures & Algorithms'), TRUE),
    ((SELECT id FROM users WHERE email = 'student4@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Data Structures & Algorithms'), TRUE),
    -- Calculus I
    ((SELECT id FROM users WHERE email = 'student2@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Calculus I'), TRUE),
    ((SELECT id FROM users WHERE email = 'student3@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Calculus I'), TRUE),
    ((SELECT id FROM users WHERE email = 'student4@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Calculus I'), TRUE),
    -- Marketing (not yet published but enrollments pre-seeded)
    ((SELECT id FROM users WHERE email = 'student5@spree.edu'),
     (SELECT id FROM courses WHERE title = 'Principles of Marketing'), TRUE)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6. Lessons  (Python course gets 3 lessons; Calculus I gets 2)
-- ---------------------------------------------------------------------------
INSERT INTO lessons (course_id, title, content, lesson_order, is_published) VALUES
    -- Python
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        'Getting Started with Python',
        '# Getting Started with Python\n\nIn this lesson we install Python 3, set up a virtual environment, and write our first "Hello, World!" script.\n\n## Topics\n- Installing Python\n- Using pip\n- Running scripts from the terminal',
        1, TRUE
    ),
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        'Variables, Types, and Operators',
        '# Variables, Types, and Operators\n\nLearn about Python''s dynamic type system, built-in types (int, float, str, bool), and arithmetic/comparison operators.',
        2, TRUE
    ),
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        'Control Flow: if, for, while',
        '# Control Flow\n\nMaster conditional branching with if/elif/else and iteration with for loops and while loops.',
        3, TRUE
    ),
    -- Calculus I
    (
        (SELECT id FROM courses WHERE title = 'Calculus I'),
        'Limits and Continuity',
        '# Limits and Continuity\n\nWe explore the intuitive and formal (epsilon-delta) definitions of a limit, and what it means for a function to be continuous.',
        1, TRUE
    ),
    (
        (SELECT id FROM courses WHERE title = 'Calculus I'),
        'Introduction to Derivatives',
        '# Introduction to Derivatives\n\nThe derivative as a rate of change and slope of the tangent line. Power rule, product rule, and chain rule.',
        2, TRUE
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 7. Materials  (one attachment per lesson for the first Python lesson)
-- ---------------------------------------------------------------------------
INSERT INTO materials (lesson_id, title, file_url, file_type) VALUES
    (
        (SELECT id FROM lessons WHERE title = 'Getting Started with Python'),
        'Python 3 Installation Guide (PDF)',
        'https://cdn.spree.edu/materials/python-install-guide.pdf',
        'PDF'
    ),
    (
        (SELECT id FROM lessons WHERE title = 'Getting Started with Python'),
        'Hello World Starter Script',
        'https://cdn.spree.edu/materials/hello_world.py',
        'PY'
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 8. Assignments  (one per published CS course)
-- ---------------------------------------------------------------------------
INSERT INTO assignments (course_id, title, description, due_date, max_score) VALUES
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        'Assignment 1: FizzBuzz',
        'Write a Python script that prints numbers from 1 to 100. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
        NOW() + INTERVAL '14 days',
        100.00
    ),
    (
        (SELECT id FROM courses WHERE title = 'Data Structures & Algorithms'),
        'Assignment 1: Implement a Linked List',
        'Implement a singly linked list in Python with insert, delete, and search operations. Include unit tests.',
        NOW() + INTERVAL '21 days',
        100.00
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 9. Submissions  (student1 submits the Python assignment)
-- ---------------------------------------------------------------------------
INSERT INTO submissions (assignment_id, student_id, content, submitted_at, status) VALUES
    (
        (SELECT id FROM assignments WHERE title = 'Assignment 1: FizzBuzz'),
        (SELECT id FROM users WHERE email = 'student1@spree.edu'),
        'for i in range(1, 101):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
        NOW(),
        'SUBMITTED'
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 10. Grades  (teacher grades student1's FizzBuzz submission)
-- ---------------------------------------------------------------------------
INSERT INTO grades (submission_id, graded_by, score, feedback, graded_at) VALUES
    (
        (
            SELECT s.id FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
            JOIN users u       ON u.id = s.student_id
            WHERE a.title = 'Assignment 1: FizzBuzz'
              AND u.email = 'student1@spree.edu'
            LIMIT 1
        ),
        (SELECT id FROM users WHERE email = 'teacher1@spree.edu'),
        95.00,
        'Excellent solution! Clean logic using the mod-15 trick. Add a brief docstring for full marks.',
        NOW()
    )
ON CONFLICT (submission_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 11. Quiz  (Python course)
-- ---------------------------------------------------------------------------
INSERT INTO quizzes (course_id, title, description, time_limit_minutes, max_attempts, is_published) VALUES
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        'Python Basics Quiz',
        'Test your knowledge of Python fundamentals covered in Lessons 1 and 2.',
        20,
        2,
        TRUE
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 12. Questions
-- ---------------------------------------------------------------------------
INSERT INTO questions (quiz_id, question_text, question_type, question_order, points) VALUES
    (
        (SELECT id FROM quizzes WHERE title = 'Python Basics Quiz'),
        'Which keyword is used to define a function in Python?',
        'MCQ',
        1,
        2.00
    ),
    (
        (SELECT id FROM quizzes WHERE title = 'Python Basics Quiz'),
        'Python is a statically typed language.',
        'TRUE_FALSE',
        2,
        1.00
    ),
    (
        (SELECT id FROM quizzes WHERE title = 'Python Basics Quiz'),
        'What does the len() function return when called on a list?',
        'SHORT_ANSWER',
        3,
        2.00
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 13. Question Options  (MCQ and TRUE_FALSE)
-- ---------------------------------------------------------------------------
-- Q1: "Which keyword is used to define a function?"
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
    ((SELECT id FROM questions WHERE question_text = 'Which keyword is used to define a function in Python?' LIMIT 1), 'function', FALSE),
    ((SELECT id FROM questions WHERE question_text = 'Which keyword is used to define a function in Python?' LIMIT 1), 'def',      TRUE),
    ((SELECT id FROM questions WHERE question_text = 'Which keyword is used to define a function in Python?' LIMIT 1), 'fun',      FALSE),
    ((SELECT id FROM questions WHERE question_text = 'Which keyword is used to define a function in Python?' LIMIT 1), 'lambda',   FALSE)
ON CONFLICT DO NOTHING;

-- Q2: "Python is a statically typed language."
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
    ((SELECT id FROM questions WHERE question_text = 'Python is a statically typed language.' LIMIT 1), 'True',  FALSE),
    ((SELECT id FROM questions WHERE question_text = 'Python is a statically typed language.' LIMIT 1), 'False', TRUE)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 14. Quiz Attempt  (student2 completes the quiz)
-- ---------------------------------------------------------------------------
INSERT INTO quiz_attempts (quiz_id, student_id, started_at, completed_at, score) VALUES
    (
        (SELECT id FROM quizzes WHERE title = 'Python Basics Quiz'),
        (SELECT id FROM users   WHERE email  = 'student2@spree.edu'),
        NOW() - INTERVAL '30 minutes',
        NOW() - INTERVAL '10 minutes',
        4.00
    )
ON CONFLICT (quiz_id, student_id, started_at) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 15. Attempt Answers
-- ---------------------------------------------------------------------------
-- Answer to Q1 (selected 'def' — correct)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, text_answer) VALUES
    (
        (
            SELECT qa.id FROM quiz_attempts qa
            JOIN users u ON u.id = qa.student_id
            WHERE u.email = 'student2@spree.edu'
            ORDER BY qa.started_at DESC LIMIT 1
        ),
        (SELECT id FROM questions WHERE question_text = 'Which keyword is used to define a function in Python?' LIMIT 1),
        (SELECT id FROM question_options WHERE option_text = 'def' LIMIT 1),
        NULL
    )
ON CONFLICT DO NOTHING;

-- Answer to Q2 (selected 'False' — correct)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, text_answer) VALUES
    (
        (
            SELECT qa.id FROM quiz_attempts qa
            JOIN users u ON u.id = qa.student_id
            WHERE u.email = 'student2@spree.edu'
            ORDER BY qa.started_at DESC LIMIT 1
        ),
        (SELECT id FROM questions WHERE question_text = 'Python is a statically typed language.' LIMIT 1),
        (SELECT id FROM question_options WHERE option_text = 'False' LIMIT 1),
        NULL
    )
ON CONFLICT DO NOTHING;

-- Answer to Q3 (short answer)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, text_answer) VALUES
    (
        (
            SELECT qa.id FROM quiz_attempts qa
            JOIN users u ON u.id = qa.student_id
            WHERE u.email = 'student2@spree.edu'
            ORDER BY qa.started_at DESC LIMIT 1
        ),
        (SELECT id FROM questions WHERE question_text = 'What does the len() function return when called on a list?' LIMIT 1),
        NULL,
        'The number of elements in the list.'
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 16. Announcements
-- ---------------------------------------------------------------------------
INSERT INTO announcements (course_id, author_id, title, content, is_global) VALUES
    -- Global platform announcement
    (
        NULL,
        (SELECT id FROM users WHERE email = 'admin@spree.edu'),
        'Welcome to Spree LMS!',
        'We are excited to launch the Spree Learning Management System. Explore your courses, complete assignments, and track your progress. For support, contact admin@spree.edu.',
        TRUE
    ),
    -- Course-specific announcement
    (
        (SELECT id FROM courses WHERE title = 'Introduction to Python Programming'),
        (SELECT id FROM users WHERE email = 'teacher1@spree.edu'),
        'Week 1 Kick-off: Python Setup Instructions',
        'Please ensure Python 3.11+ is installed before our first live session. Follow the PDF guide in Lesson 1 materials. See you there!',
        FALSE
    )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 17. Progress Tracking  (student1 and student2 completed lesson 1 of Python)
-- ---------------------------------------------------------------------------
INSERT INTO progress_tracking (student_id, lesson_id, completed_at) VALUES
    (
        (SELECT id FROM users   WHERE email = 'student1@spree.edu'),
        (SELECT id FROM lessons WHERE title = 'Getting Started with Python'),
        NOW() - INTERVAL '5 days'
    ),
    (
        (SELECT id FROM users   WHERE email = 'student2@spree.edu'),
        (SELECT id FROM lessons WHERE title = 'Getting Started with Python'),
        NOW() - INTERVAL '3 days'
    ),
    (
        (SELECT id FROM users   WHERE email = 'student1@spree.edu'),
        (SELECT id FROM lessons WHERE title = 'Variables, Types, and Operators'),
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (student_id, lesson_id) DO NOTHING;

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
