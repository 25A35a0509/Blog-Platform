import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify a stored token

  // On first load, if a token exists, fetch the current profile to confirm it's valid.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      // Show the cached user immediately for a snappy UI, then verify in the background.
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          /* ignore malformed cache */
        }
      }

      try {
        const profile = await authApi.getProfile();
        setUser((prev) => ({ ...prev, ...profile, token }));
        localStorage.setItem('user', JSON.stringify({ ...profile, token }));
      } catch {
        // Token invalid/expired — clear stale auth state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const persist = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persist(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (data) => {
    persist({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
