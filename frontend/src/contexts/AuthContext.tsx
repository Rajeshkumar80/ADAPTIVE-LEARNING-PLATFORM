'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDB, User } from '@/lib/mockdb';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: 'student' | 'admin') => Promise<User>;
  register: (data: any, role: 'student' | 'admin') => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    mockDB.init();
    const currentUser = mockDB.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'student' | 'admin'): Promise<User> => {
    const loggedInUser = mockDB.login(username, password, role);
    if (!loggedInUser) {
      throw new Error('Invalid credentials or wrong role');
    }
    setUser(loggedInUser);
    
    // Redirect based on role
    if (loggedInUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    
    return loggedInUser;
  };

  const register = async (data: any, role: 'student' | 'admin'): Promise<User> => {
    const newUser = mockDB.register(data, role);
    if (!newUser) {
      throw new Error('User already exists');
    }
    setUser(newUser);
    
    if (newUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    
    return newUser;
  };

  const logout = () => {
    mockDB.logout();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
