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

export interface Department {
  id: number;
  name: string;
  description: string | null;
  courseCount?: number;
  createdAt: string;
  updatedAt?: string | null;
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
  updatedAt?: string;
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  moduleOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  courseTitle?: string;
  moduleId?: number;
  moduleTitle?: string;
  title: string;
  content: string;
  lessonOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Assignment {
  id: number;
  courseId: number;
  courseTitle?: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  assignmentTitle?: string;
  studentId: number;
  studentName: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  downloadUrl?: string;
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED';
  grade?: {
    score: number;
    feedback: string;
    gradedAt: string;
    gradedByName?: string;
  };
}

export interface Material {
  id: number;
  courseId: number;
  courseTitle: string;
  lessonId?: number | null;
  lessonTitle?: string | null;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  uploadedByName?: string;
  createdAt: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseTitle: string;
  enrolledAt: string;
  isActive: boolean;
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
  updatedAt?: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeCourses: number;
  totalDepartments: number;
  totalEnrollments: number;
  pendingSubmissions: number;
  recentCourses: Course[];
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
