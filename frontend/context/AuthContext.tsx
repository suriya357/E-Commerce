'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface IAuthContext {
  token: string | null;
  email: string | null; // Add email here
  login: (token: string, email: string) => void; // Update login signature
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // Add email state

  useEffect(() => {
    // Load token and email from localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const login = (newToken: string, userEmail: string) => {
    setToken(newToken);
    setEmail(userEmail); // Set email state
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userEmail', userEmail); // Save email to localStorage
  };

  const logout = () => {
    setToken(null);
    setEmail(null); // Clear email state
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail'); // Remove email from localStorage
  };

  return (
    // Provide email in the context value
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};