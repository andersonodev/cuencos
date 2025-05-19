
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUser } from '../lib/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }
    return { success: false, message: "Credenciais inválidas" };
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const register = async (userData) => {
    const result = registerUser(userData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const updateUserInfo = async (userId, updatedData) => {
    const result = updateUser(userId, updatedData);
    if (result.success && userId === user?.id) {
      // Update the user in context if it's the current user
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
