
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Página de índice que redireciona para a página inicial ou dashboard conforme o tipo de usuário
const Index = () => {
  const { user, isOrganizer } = useAuth();
  
  // Se o usuário for organizador, redireciona para o dashboard
  if (user && isOrganizer()) {
    return <Navigate to="/dashboard" />;
  }
  
  // Caso contrário, redireciona para a página inicial
  return <Navigate to="/" />;
};

export default Index;
