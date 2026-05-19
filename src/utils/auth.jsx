import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser as storageLogin, logoutUser as storageLogout, seedData } from './storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedData();
    const saved = getCurrentUser();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const u = storageLogin(username, password);
    if (u) { setUser(u); return u; }
    return null;
  };

  const logout = () => {
    storageLogout();
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
