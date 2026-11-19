import apiClient from './client';
import type { Submission } from '../types';

export interface SubmissionRequest {
  assignmentId: number;
  content?: string;
  fileUrl?: string;
}

export interface GradeRequest {
  score: number;
  feedback?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const submissionsApi = {
  submit: (data: SubmissionRequest) => apiClient.post<ApiResponse<Submission>>('/api/submissions', data),
  
  submitWithFile: (assignmentId: number, content?: string, file?: File) => {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId.toString());
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);
    return apiClient.post<ApiResponse<Submission>>('/api/submissions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  saveDraft: (data: SubmissionRequest) => apiClient.post<ApiResponse<Submission>>('/api/submissions/draft', data),
  getByAssignment: (assignmentId: number) => apiClient.get<ApiResponse<Submission[]>>(`/api/submissions/assignment/${assignmentId}`),
  getById: (id: number) => apiClient.get<ApiResponse<Submission>>(`/api/submissions/${id}`),
  getMySubmission: (assignmentId: number) => apiClient.get<ApiResponse<Submission>>(`/api/submissions/assignment/${assignmentId}/my`),
  grade: (id: number, data: GradeRequest) => apiClient.post<ApiResponse<Submission>>(`/api/submissions/${id}/grade`, data),

  downloadSubmissionFile: async (id: number, fileName: string) => {
    const res = await apiClient.get(`/api/submissions/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'submission');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
