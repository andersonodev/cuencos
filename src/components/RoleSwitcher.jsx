
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { UserCog, User, SwitchCamera } from 'lucide-react';

const RoleSwitcher = () => {
  const { isOrganizer, switchUserRole, previousRole } = useAuth();
  const navigate = useNavigate();
  
  const handleSwitchRole = () => {
    // A função switchUserRole agora lidará com o redirecionamento
    switchUserRole(navigate);
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-purple-500 transition-all duration-300 rounded-full px-4 py-2 shadow-md hover:shadow-lg"
      onClick={handleSwitchRole}
    >
      {isOrganizer() ? (
        <>
          <User className="h-4 w-4 mr-1" />
          <span className="sm:hidden hidden md:inline">Mudar para Usuário</span>
          <span className="sm:inline md:hidden">Usuário</span>
          <SwitchCamera className="h-3 w-3 ml-1 animate-pulse" />
        </>
      ) : previousRole === 'organizador' ? (
        <>
          <UserCog className="h-4 w-4 mr-1" />
          <span className="sm:hidden hidden md:inline">Mudar para Organizador</span>
          <span className="sm:inline md:hidden">Organizador</span>
          <SwitchCamera className="h-3 w-3 ml-1 animate-pulse" />
        </>
      ) : null}
    </Button>
  );
};

export default RoleSwitcher;
