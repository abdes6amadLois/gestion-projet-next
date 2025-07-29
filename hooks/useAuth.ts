'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    const userData = auth.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    auth.setToken(token);
    auth.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && auth.isAuthenticated();
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };
};