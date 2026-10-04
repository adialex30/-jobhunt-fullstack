import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const profile = await authService.getMe();
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
            setToken(null);
          }
        } catch {
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async ({ name, email, password, role }) => {
    return await authService.register({ name, email, password, role });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isLoggedIn: Boolean(user && token),
    isJobSeeker: user?.role === 'job_seeker',
    isRecruiter: user?.role === 'recruiter',
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
