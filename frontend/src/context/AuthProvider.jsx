import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import AuthContext from './authContext'; 


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error("Token invalid:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enter error during login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('You have logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};