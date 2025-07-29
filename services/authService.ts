import api from './api';
import { LoginData, RegisterData,User,AddUser, AuthResponse, ApiResponse, Role } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/register', data);
    return response.data;
  },

  async registerU(data: Partial<AddUser>): Promise<ApiResponse<User>> {
    const response = await api.post('/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<{ response_code: number; status: string; message: string; data_user_list: any }> {
    const response = await api.get('/get-user');
    return response.data;
  },

  async getRoles():Promise<ApiResponse<Role[]>>{
    const responce = await api.get('get-roles');
    return responce.data;
  }
};