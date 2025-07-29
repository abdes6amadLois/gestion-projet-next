'use client';

import { User,Privilege } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PERMISSIONS_KEY = 'auth_permission';

export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  setPermissions:(Permissions: Privilege[]):void=>{
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(Permissions));
    }
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  logout: (): void => {
    auth.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};