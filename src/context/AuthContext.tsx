import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAddress, IUser } from '../types';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => Promise<boolean>;
  addAddress: (address: Partial<IAddress>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('maurya_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('maurya_token');
      const storedUser = localStorage.getItem('maurya_user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // invalid json
        }
      }

      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
          }
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401) {
            localStorage.removeItem('maurya_token');
            localStorage.removeItem('maurya_user');
            setToken(null);
            setUser(null);
  }
  // else: keep existing token/user as-is, user stays logged in, try again next time
}
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('maurya_token', res.data.token);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const res = await authAPI.register({ name, email, phone, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('maurya_token', res.data.token);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast('Registration successful! Welcome to Maurya Grocery.', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('maurya_token');
    localStorage.removeItem('maurya_user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (name: string, phone: string): Promise<boolean> => {
    try {
      const res = await authAPI.updateProfile({ name, phone });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast('Profile updated successfully', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
      return false;
    }
  };

  const addAddress = async (addressData: Partial<IAddress>): Promise<boolean> => {
    try {
      const res = await authAPI.addAddress(addressData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast('Address added successfully', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add address', 'error');
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      const res = await authAPI.deleteAddress(id);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast('Address removed', 'info');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete address', 'error');
      return false;
    }
  };

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    try {
      const res = await authAPI.setDefaultAddress(id);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('maurya_user', JSON.stringify(res.data.user));
        showToast('Default address updated', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to set default address', 'error');
      return false;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
