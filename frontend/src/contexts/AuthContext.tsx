'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface User {
  id: number | string;
  email: string;
  username: string;
  full_name: string;
  role: 'student' | 'admin';
  is_active?: boolean;
  usn?: string;
  semester?: number;
  branch?: string;
  section?: string;
  cgpa?: number;
  employee_id?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  login: (username: string, password: string, role: 'student' | 'admin') => Promise<User>;
  register: (data: any, role: 'student' | 'admin') => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
      setIsOnline(true);
    } catch {
      api.clearToken();
      setUser(null);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string, role: 'student' | 'admin'): Promise<User> => {
    const data = await api.login(username, password);
    if (data.user.role !== role) {
      throw new Error(`This account is registered as ${data.user.role}, not ${role}`);
    }
    setUser(data.user);
    setIsOnline(true);
    router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
    return data.user;
  };

  const register = async (data: any, role: 'student' | 'admin') => {
    const response = await api.register({ ...data, role });
    setUser(response.user);
    setIsOnline(true);
    router.push(response.user.role === 'admin' ? '/admin' : '/dashboard');
    return response.user;
  };

  const logout = () => {
    api.logout().catch(() => {});
    setUser(null);
    setIsOnline(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnline,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
