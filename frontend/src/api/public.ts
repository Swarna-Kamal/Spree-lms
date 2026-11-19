import client from './client';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PublicStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDepartments: number;
  totalEnrollments: number;
}

export const publicApi = {
  getStats: () => client.get<ApiResponse<PublicStats>>('/api/stats/public'),
  getCourses: () => client.get<ApiResponse<any[]>>('/api/courses/public'),
  getDepartments: () => client.get<ApiResponse<any[]>>('/api/departments/public'),
};
