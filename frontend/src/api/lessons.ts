import apiClient from './client';
import type { Lesson } from '../types';

export interface LessonRequest {
  courseId: number;
  moduleId?: number;
  title: string;
  content?: string;
  lessonOrder: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const lessonsApi = {
  getByCourse: (courseId: number) => apiClient.get<ApiResponse<Lesson[]>>(`/api/lessons/course/${courseId}`),
  getById: (id: number) => apiClient.get<ApiResponse<Lesson>>(`/api/lessons/${id}`),
  create: (data: LessonRequest) => apiClient.post<ApiResponse<Lesson>>('/api/lessons', data),
  update: (id: number, data: LessonRequest) => apiClient.put<ApiResponse<Lesson>>(`/api/lessons/${id}`, data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/api/lessons/${id}`),
  publish: (id: number, published: boolean) => apiClient.patch<ApiResponse<Lesson>>(`/api/lessons/${id}/publish?published=${published}`),
};
