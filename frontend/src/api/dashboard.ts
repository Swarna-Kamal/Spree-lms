import apiClient from './client';
import type { AdminStats } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardApi = {
  getAdminStats: () => apiClient.get<ApiResponse<AdminStats>>('/api/admin/dashboard/stats'),
};
