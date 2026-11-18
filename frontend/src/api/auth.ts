import apiClient from './client';
import type { AuthResponse } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName?: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data),
};
