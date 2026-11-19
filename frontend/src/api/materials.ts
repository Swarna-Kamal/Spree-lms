import client from './client';
import type { Material } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const materialsApi = {
  upload: (data: {
    courseId: number;
    lessonId?: number;
    title?: string;
    description?: string;
    file: File;
  }) => {
    const formData = new FormData();
    formData.append('courseId', data.courseId.toString());
    if (data.lessonId) formData.append('lessonId', data.lessonId.toString());
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('file', data.file);

    return client.post<ApiResponse<Material>>('/api/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getByCourse: (courseId: number) =>
    client.get<ApiResponse<Material[]>>(`/api/materials/course/${courseId}`),

  getForStudent: () =>
    client.get<ApiResponse<Material[]>>('/api/materials/student'),

  getForTeacher: () =>
    client.get<ApiResponse<Material[]>>('/api/materials/teacher'),

  getByLesson: (lessonId: number) =>
    client.get<ApiResponse<Material[]>>(`/api/materials/lesson/${lessonId}`),

  delete: (id: number) =>
    client.delete<ApiResponse<void>>(`/api/materials/${id}`),

  downloadUrl: (id: number) => `/api/materials/${id}/download`,

  downloadFile: async (id: number, fileName: string) => {
    const res = await client.get(`/api/materials/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'document');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
