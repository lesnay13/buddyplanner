import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/Axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Function to refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      
      const response = await axiosInstance.post('/api/token/refresh/', {
        refresh: refreshToken,
      });
      
      localStorage.setItem('accessToken', response.data.access);
      const decodedUser = jwtDecode(response.data.access);
      setCurrentUser(decodedUser);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('accessToken');
      if (token) {
        if (isTokenExpired(token)) {
          // Token is expired, try to refresh
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            // If refresh failed, logout
            logout(false); // Pass false to prevent navigation during initialization
          }
        } else {
          // Token is valid, set user
          const decodedUser = jwtDecode(token);
          setCurrentUser(decodedUser);
        }
      }
      setLoading(false); // End loading
    };
    
    initAuth();
  }, []);

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        logout();
      }, 20 * 60 * 1000); // 20 minutes
    };

    if (currentUser) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      resetTimer(); // Initial timer start
    }

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [currentUser]);

  const login = async (credentials) => {
    const response = await axiosInstance.post('/api/token/', credentials);
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    const decodedUser = jwtDecode(response.data.access);
    setCurrentUser(decodedUser);
    navigate('/');
  };

  const logout = (shouldNavigate = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    if (shouldNavigate) {
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
