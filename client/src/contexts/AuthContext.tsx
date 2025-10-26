import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { trpc } from '@/lib/trpc';

interface User {
  id: string;
  username: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use TRPC hooks
  const verifyTokenQuery = trpc.auth.verifyToken.useQuery(undefined, {
    enabled: false, // We'll trigger this manually
    retry: false,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        setUser(data.user);
        setError(null);
      } else {
        setError(data.message || 'Login failed');
      }
    },
    onError: (error) => {
      setError(error.message || 'Login failed');
    },
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verify token with server
      verifyTokenQuery.refetch()
        .then((result) => {
          if (result.data) {
            setUser(result.data);
          } else {
            localStorage.removeItem('admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
        });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await loginMutation.mutateAsync({ username, password });
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setError(null);
  };

  const loading = verifyTokenQuery.isLoading || loginMutation.isPending;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        error,
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
