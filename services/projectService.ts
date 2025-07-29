import api from './api';
import { Project, Sprint, ApiResponse } from '@/types';

export const projectService = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await api.get('/projects');
    return response.data;
  },

  async getProject(id: number): Promise<ApiResponse<Project>> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: Partial<Project>): Promise<ApiResponse<Project>> {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async updateProject(id: number, data: Partial<Project>): Promise<ApiResponse<Project>> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async getProjectSprints(projectId: number): Promise<ApiResponse<Sprint[]>> {
    const response = await api.get(`/projects/${projectId}/sprints`);
    return response.data;
  },

  async createSprint(projectId: number, data: Partial<Sprint>): Promise<ApiResponse<Sprint>> {
    const response = await api.post(`/projects/${projectId}/Sprints`, data);
    return response.data;
  },

  async updateSprint(projectId: number, SprintId: string, data: Partial<Sprint>): Promise<ApiResponse<Sprint>> {
    const response = await api.put(`/projects/${projectId}/Sprints/${SprintId}`, data);
    return response.data;
  },

  async deleteSprint(projectId: number, SprintId: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/projects/${projectId}/Sprints/${SprintId}`);
    return response.data;
  }
};