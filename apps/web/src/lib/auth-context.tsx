'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authApi, setAuthCookies, clearAuthCookies } from './api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; accessToken: string; refreshToken: string }>;
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await authApi.getMe();
      setUser(data);
    } catch {
      clearAuthCookies();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setAuthCookies(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (payload: { name: string; email: string; password: string; role: string }) => {
    const data = await authApi.register(payload);
    setAuthCookies(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthCookies();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
