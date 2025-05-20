
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as authLogin, getCurrentUser, logoutUser, registerUser as authRegister, updateUser as authUpdateUser, isOrganizer as authIsOrganizer } from '../lib/auth';
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
        toast({
          title: "Login realizado com sucesso!",
          variant: "success"
        });
        return { success: true, user: loggedInUser };
      } else {
        console.log("Login falhou: credenciais inválidas");
        toast({
          title: "Credenciais inválidas",
          variant: "destructive"
        });
        return { success: false, message: "Credenciais inválidas" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  // Função de logout
  const logout = () => {
    try {
      logoutUser();
      setUser(null);
      console.log("Logout bem-sucedido");
      toast({
        title: "Logout realizado com sucesso!",
        variant: "success"
      });
      return true;
    } catch (error) {
      console.error("Erro no logout:", error);
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive"
      });
      return false;
    }
  };

  // Função de registro
  const registerUser = (userData) => {
    const result = authRegister(userData);
    if (result.success) {
      setUser(result.user);
      toast({
        title: "Cadastro realizado com sucesso!",
        variant: "success"
      });
    } else {
      toast({
        title: "Erro ao cadastrar usuário",
        description: result.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
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
      toast({
        title: "Perfil atualizado com sucesso!",
        variant: "success"
      });
    } else {
      toast({
        title: "Erro ao atualizar perfil",
        description: result.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
    return result;
  };

  // Verificar se o usuário é organizador
  const isOrganizer = () => {
    return user && user.tipo === 'organizador';
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

