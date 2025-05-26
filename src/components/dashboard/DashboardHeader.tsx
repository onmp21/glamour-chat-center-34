
import React from 'react';
import { cn } from '@/lib/utils';
import { LogoHeader } from '../LogoHeader';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  isDarkMode: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isDarkMode }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Logo Header - APENAS MOBILE */}
      <div className="md:hidden">
        <LogoHeader isDarkMode={isDarkMode} />
      </div>

      {/* Header */}
      <div className="mobile-fade-in">
        <h1 style={{ color: "#b5103c" }} className="text-xl md:text-2xl lg:text-4xl font-extrabold">
          Painel de Controle
        </h1>
        <p className={cn("text-sm md:text-base", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Bem-vindo, {user?.name}
        </p>
      </div>
    </>
  );
};
