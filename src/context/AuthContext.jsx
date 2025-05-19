import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as authLogin, getCurrentUser, logoutUser, registerUser as authRegister, updateUser as authUpdateUser } from '../lib/auth';

// Criar contexto de autenticação
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário da sessão ao montar o componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          console.log("Usuário autenticado carregado:", currentUser);
          setUser(currentUser);
        } else {
          console.log("Nenhum usuário autenticado encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = (email, password) => {
    try {
      const loggedInUser = authLogin(email, password);
      
      if (loggedInUser) {
        console.log("Login bem-sucedido:", loggedInUser);
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      } else {
        console.log("Login falhou: credenciais inválidas");
        return { success: false, message: "Credenciais inválidas" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  // Função de logout
  const logout = () => {
    try {
      logoutUser();
      setUser(null);
      console.log("Logout bem-sucedido");
      return true;
    } catch (error) {
      console.error("Erro no logout:", error);
      return false;
    }
  };

  // Função de registro
  const registerUser = (userData) => {
    const result = authRegister(userData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  // Função de atualização do usuário
  const updateUser = (userData) => {
    if (!user) return { success: false };
    
    const result = authUpdateUser(user.id, userData);
    if (result.success) {
      // Atualizar o estado do usuário com os novos dados
      setUser(prev => ({
        ...prev,
        ...userData
      }));
    }
    return result;
  };

  // Valores fornecidos pelo contexto
  const value = {
    user,
    login,
    logout,
    registerUser,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
