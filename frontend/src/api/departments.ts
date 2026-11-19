import apiClient from './client';

export interface Department {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface DepartmentRequest {
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getDepartments = () =>
  apiClient.get<ApiResponse<Department[]>>('/api/departments');

export const createDepartment = (data: DepartmentRequest) =>
  apiClient.post<ApiResponse<Department>>('/api/departments', data);

export const updateDepartment = (id: number, data: DepartmentRequest) =>
  apiClient.put<ApiResponse<Department>>(`/api/departments/${id}`, data);

export const deleteDepartment = (id: number) =>
  apiClient.delete<ApiResponse<void>>(`/api/departments/${id}`);