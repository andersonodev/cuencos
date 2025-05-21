
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { UserCog, User } from 'lucide-react';

const RoleSwitcher = () => {
  const { isOrganizer, switchUserRole, previousRole } = useAuth();
  
  const handleSwitchRole = () => {
    switchUserRole();
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
      onClick={handleSwitchRole}
    >
      {isOrganizer() ? (
        <>
          <User className="h-4 w-4" />
          <span className="sm:hidden hidden md:inline">Mudar para Usuário</span>
          <span className="sm:inline md:hidden">Usuário</span>
        </>
      ) : previousRole === 'organizador' ? (
        <>
          <UserCog className="h-4 w-4" />
          <span className="sm:hidden hidden md:inline">Mudar para Organizador</span>
          <span className="sm:inline md:hidden">Organizador</span>
        </>
      ) : null}
    </Button>
  );
};

export default RoleSwitcher;
