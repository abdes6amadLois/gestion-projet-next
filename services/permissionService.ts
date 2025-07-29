import api from './api';
import { Privilege } from '@/types';

export const permissionsService = {
  async getPermissions(): Promise<{ permissions: Privilege[] }> {
    const response = await api.get('/permissions');
    return response.data;
  },

  async getPermission(id: number): Promise<Privilege> {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  async createPermission(data: Partial<Privilege>): Promise<Privilege> {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  async updateRole(id: number, data: Partial<Privilege>): Promise<Privilege> {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data;
  },

  async deleteRole(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  }
};