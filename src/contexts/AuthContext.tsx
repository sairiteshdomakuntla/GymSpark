
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin data
const MOCK_ADMIN: Admin = {
  id: '1',
  email: 'admin@gymspark.com',
  name: 'Admin User',
};

// Mock password
const MOCK_PASSWORD = 'password123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved authentication
    const savedAdmin = localStorage.getItem('gymspark_admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === MOCK_ADMIN.email && password === MOCK_PASSWORD) {
      setAdmin(MOCK_ADMIN);
      localStorage.setItem('gymspark_admin', JSON.stringify(MOCK_ADMIN));
      toast.success('Logged in successfully');
      setLoading(false);
      return true;
    } else {
      toast.error('Invalid email or password');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('gymspark_admin');
    toast.info('Logged out successfully');
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
