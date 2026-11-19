import apiClient from './client';
import type { Assignment } from '../types';

export interface AssignmentRequest {
  courseId: number;
  title: string;
  description?: string;
  dueDate?: string;
  maxScore?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const assignmentsApi = {
  getByCourse: (courseId: number) => apiClient.get<ApiResponse<Assignment[]>>(`/api/assignments/course/${courseId}`),
  getById: (id: number) => apiClient.get<ApiResponse<Assignment>>(`/api/assignments/${id}`),
  create: (data: AssignmentRequest) => apiClient.post<ApiResponse<Assignment>>('/api/assignments', data),
  update: (id: number, data: AssignmentRequest) => apiClient.put<ApiResponse<Assignment>>(`/api/assignments/${id}`, data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/api/assignments/${id}`),
  getForStudent: () => apiClient.get<ApiResponse<Assignment[]>>('/api/assignments/student'),
};
