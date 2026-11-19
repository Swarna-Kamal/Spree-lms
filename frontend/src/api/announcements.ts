import apiClient from './client';
import type { Announcement } from '../types';

export interface AnnouncementRequest {
  courseId?: number;
  title: string;
  content: string;
  isGlobal?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const announcementsApi = {
  getAll: () => apiClient.get<ApiResponse<Announcement[]>>('/api/announcements'),
  getGlobal: () => apiClient.get<ApiResponse<Announcement[]>>('/api/announcements/global'),
  getByCourse: (courseId: number) => apiClient.get<ApiResponse<Announcement[]>>(`/api/announcements/course/${courseId}`),
  getForStudent: () => apiClient.get<ApiResponse<Announcement[]>>('/api/announcements/student'),
  create: (data: AnnouncementRequest) => apiClient.post<ApiResponse<Announcement>>('/api/announcements', data),
  update: (id: number, data: AnnouncementRequest) => apiClient.put<ApiResponse<Announcement>>(`/api/announcements/${id}`, data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/api/announcements/${id}`),
};
