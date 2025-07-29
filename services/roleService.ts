import api from './api';
import { Role } from '@/types';

export const roleService = {
  async getRoles(): Promise<{ roles: Role[] }> {
    const response = await api.get('/roles');
    return response.data;
  },

  async getRole(id: number): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  async createRole(data: Partial<Role>): Promise<Role> {
    const response = await api.post('/roles', data);
    return response.data;
  },

  async updateRole(id: number, data: Partial<Role>): Promise<Role> {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  async assignPerm(id: number, ids: number[]): Promise<Role> {
    const response = await api.put(`/roles/${id}/assign`, {
        permissions: ids, 
    });
    return response.data;
    }
};