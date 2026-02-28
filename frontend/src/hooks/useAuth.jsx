import { useState, useEffect, useContext, createContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('pam_token'));

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...');
      const storedToken = localStorage.getItem('pam_token');
      const storedUser = localStorage.getItem('pam_user');
      
      console.log('Stored token:', storedToken);
      console.log('Stored user:', storedUser);

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          console.log('Verifying token...');
          const response = await authAPI.getCurrentUser();
          console.log('Current user response:', response.data);
          
          if (response.data) {
            setUser(response.data);
            setToken(storedToken);
            console.log('Auth initialized successfully');
          } else {
            console.error('No user data in response');
            localStorage.removeItem('pam_token');
            localStorage.removeItem('pam_user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          // Token invalid, clear storage
          console.error('Token verification failed:', error);
          console.log('Clearing invalid token...');
          localStorage.removeItem('pam_token');
          localStorage.removeItem('pam_user');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('No stored token or user found');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      const { user: userData, token: userToken } = response.data;
      
      console.log('Extracted user data:', userData);
      console.log('Extracted token:', userToken);
      
      setUser(userData);
      setToken(userToken);
      
      // Store in localStorage
      localStorage.setItem('pam_token', userToken);
      localStorage.setItem('pam_user', JSON.stringify(userData));
      
      console.log('Login successful, stored in localStorage');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await authAPI.register(userData);
      console.log('Register response:', response.data);
      
      // Auto-login after registration for pending users
      // For pending users, they can login but might have limited access
      const loginResult = await login({
        username: userData.username,
        password: userData.password
      });
      
      return { 
        success: true, 
        message: response.data.message || 'Registration successful! Please wait for account activation.',
        autoLogin: loginResult.success
      };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('pam_token');
      localStorage.removeItem('pam_user');
    }
  };

  const hasPermission = (resource, action) => {
    if (!user) return false;
    if (user.access_level === 'super_admin') return true;
    
    // Check if user has specific permission
    // This would need to be enhanced with actual permission checking
    return true; // Simplified for now
  };

  const hasAccessLevel = (requiredLevel) => {
    if (!user) return false;
    
    const levels = {
      'basic': 1,
      'intermediate': 2,
      'advanced': 3,
      'admin': 4,
      'super_admin': 5
    };
    
    return levels[user.access_level] >= levels[requiredLevel];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasPermission,
    hasAccessLevel,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
