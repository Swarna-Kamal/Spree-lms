import apiClient from './client';
import type { Course } from '../types';

export interface CourseRequest {
  title: string;
  description: string;
  departmentId: number;
  teacherId?: number;
  thumbnailUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const coursesApi = {
  getAll: () => apiClient.get<ApiResponse<Course[]>>('/api/courses'),
  getById: (id: number) => apiClient.get<ApiResponse<Course>>(`/api/courses/${id}`),
  create: (data: CourseRequest) => apiClient.post<ApiResponse<Course>>('/api/courses', data),
  update: (id: number, data: CourseRequest) => apiClient.put<ApiResponse<Course>>(`/api/courses/${id}`, data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/api/courses/${id}`),
  publish: (id: number, published: boolean) => apiClient.patch<ApiResponse<Course>>(`/api/courses/${id}/publish?published=${published}`),
};
