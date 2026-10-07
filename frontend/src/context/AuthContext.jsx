import { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const profileData = await api.getMe();
        if (isMounted) {
          if (profileData && profileData.user) {
            setUser(profileData.user);
            setTokenState(storedToken);
          } else {
            setUser(null);
            removeToken();
            setTokenState(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to restore session:', err);
          setUser(null);
          removeToken();
          setTokenState(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      const authenticatedUser = res.data?.user;
      const authToken = res.data?.token;

      if (authToken) {
        setToken(authToken);
        setTokenState(authToken);
      }
      setUser(authenticatedUser);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    setError(null);
    try {
      const res = await api.register(name, email, password, role);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setTokenState(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isLoggedIn: Boolean(user),
    isRecruiter: user?.role === 'recruiter',
    isJobSeeker: user?.role === 'job_seeker',
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
