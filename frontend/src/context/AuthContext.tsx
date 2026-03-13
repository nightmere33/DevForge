// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import API from '../api/axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'client' | 'developer';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  role: 'client' | 'developer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, if token exists, verify and set user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          // Optionally verify token with backend (e.g., /api/users/me/)
          // For now, just decode it
          const decoded: any = jwtDecode(token);
          setUser({
            id: decoded.user_id,
            username: decoded.username,
            role: decoded.role,
            email: decoded.email || '', // email might not be in token
          });
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await API.post('/users/login/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setAccessToken(access);
      const decoded: any = jwtDecode(access);
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        email: decoded.email || '',
      });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await API.post('/users/register/', userData);
      // Optionally auto-login after registration
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};