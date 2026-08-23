import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('internhub_token');
    const storedUser = localStorage.getItem('internhub_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    const { token, role, name, userId, profileComplete } = authResponse;
    const userData = { userId, name, role, profileComplete };
    setToken(token);
    setUser(userData);
    localStorage.setItem('internhub_token', token);
    localStorage.setItem('internhub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('internhub_token');
    localStorage.removeItem('internhub_user');
  };

  const isCandidate = () => user?.role === 'CANDIDATE';
  const isRecruiter = () => user?.role === 'RECRUITER';
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout,
      isCandidate, isRecruiter, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
