import apiClient from './client';
import type { User } from '../types';

export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName?: string;
}

export interface UserUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleName?: string;
  isActive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const usersApi = {
  getAll: () => apiClient.get<ApiResponse<User[]>>('/api/users'),
  getById: (id: number) => apiClient.get<ApiResponse<User>>(`/api/users/${id}`),
  create: (data: UserCreateRequest) => apiClient.post<ApiResponse<User>>('/api/users', data),
  update: (id: number, data: UserUpdateRequest) => apiClient.put<ApiResponse<User>>(`/api/users/${id}`, data),
  toggleActive: (id: number, active: boolean) => apiClient.patch<ApiResponse<void>>(`/api/users/${id}/active?active=${active}`),
  search: (query: string) => apiClient.get<ApiResponse<User[]>>(`/api/users/search?q=${encodeURIComponent(query)}`),
  getByRole: (role: string) => apiClient.get<ApiResponse<User[]>>(`/api/users/role/${role}`),
};
