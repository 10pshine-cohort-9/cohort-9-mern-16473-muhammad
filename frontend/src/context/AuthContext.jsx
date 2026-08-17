import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Bumped on every manual auth action so a slow, stale /auth/me response
  // from initial page load can't overwrite a newer login/logout result.
  const sessionRef = useRef(0);

  useEffect(() => {
    const requestId = sessionRef.current;
    api.get('/auth/me')
      .then((res) => {
        if (sessionRef.current === requestId) setUser(res.data.user);
      })
      .catch(() => {
        if (sessionRef.current === requestId) setUser(null);
      })
      .finally(() => {
        if (sessionRef.current === requestId) setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      sessionRef.current += 1;
      setUser(res.data.user);
    } catch (err) {
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear local state, even if the network request itself failed —
      // the user shouldn't stay "logged in" in the UI on a failed logout call.
      sessionRef.current += 1;
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);