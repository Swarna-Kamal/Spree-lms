-- V11: Seed default roles
INSERT INTO roles (name, description)
VALUES
    ('ADMIN',   'System administrator with full access'),
    ('TEACHER', 'Instructor who creates and manages courses'),
    ('STUDENT', 'Learner who enrolls in and takes courses')
ON CONFLICT (name) DO NOTHING;
