
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as authLogin, getCurrentUser, logoutUser, registerUser as authRegister, updateUser as authUpdateUser } from '../lib/auth';
import { useToast } from '../components/ui/use-toast';

// Criar contexto de autenticação
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        toast.success("Login realizado com sucesso!");
        return { success: true, user: loggedInUser };
      } else {
        console.log("Login falhou: credenciais inválidas");
        toast.error("Credenciais inválidas");
        return { success: false, message: "Credenciais inválidas" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login");
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  // Função de logout
  const logout = () => {
    try {
      logoutUser();
      setUser(null);
      console.log("Logout bem-sucedido");
      toast.success("Logout realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
      return false;
    }
  };

  // Função de registro
  const registerUser = (userData) => {
    const result = authRegister(userData);
    if (result.success) {
      setUser(result.user);
      toast.success("Cadastro realizado com sucesso!");
    } else {
      toast.error(result.message || "Erro ao cadastrar usuário");
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
      toast.success("Perfil atualizado com sucesso!");
    } else {
      toast.error(result.message || "Erro ao atualizar perfil");
    }
    return result;
  };

  // Verificar se o usuário é organizador
  const isOrganizer = () => {
    return user && user.role === 'organizer';
  };

  // Valores fornecidos pelo contexto
  const value = {
    user,
    login,
    logout,
    registerUser,
    updateUser,
    loading,
    isOrganizer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
