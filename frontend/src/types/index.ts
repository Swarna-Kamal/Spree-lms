export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  departmentId: number;
  departmentName: string;
  teacherId: number;
  teacherName: string;
  isPublished: boolean;
  thumbnailUrl?: string;
  enrollmentCount?: number;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  courseCount?: number;
  createdAt: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  lessonOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  content: string;
  fileUrl?: string;
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED';
  grade?: {
    score: number;
    feedback: string;
    gradedAt: string;
  };
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  description: string;
  timeLimitMinutes?: number;
  maxAttempts: number;
  isPublished: boolean;
  questionCount?: number;
  createdAt: string;
}

export interface Announcement {
  id: number;
  courseId?: number;
  courseName?: string;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  isGlobal: boolean;
  createdAt: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
