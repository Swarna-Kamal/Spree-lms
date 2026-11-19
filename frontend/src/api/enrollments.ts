import apiClient from './client';
import type { Enrollment } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const enrollmentsApi = {
  enroll: (courseId: number) => apiClient.post<ApiResponse<Enrollment>>(`/api/enrollments/courses/${courseId}/enroll`),
  unenroll: (courseId: number) => apiClient.delete<ApiResponse<void>>(`/api/enrollments/courses/${courseId}/unenroll`),
  getMyEnrollments: () => apiClient.get<ApiResponse<Enrollment[]>>('/api/enrollments/my'),
  getCourseEnrollments: (courseId: number) => apiClient.get<ApiResponse<Enrollment[]>>(`/api/enrollments/courses/${courseId}`),
  manualEnroll: (courseId: number, studentId: number) => apiClient.post<ApiResponse<Enrollment>>(`/api/enrollments/courses/${courseId}/students/${studentId}`),
  manualUnenroll: (courseId: number, studentId: number) => apiClient.delete<ApiResponse<void>>(`/api/enrollments/courses/${courseId}/students/${studentId}`),
};
