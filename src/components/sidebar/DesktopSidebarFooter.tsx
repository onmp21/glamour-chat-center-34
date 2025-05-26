
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Moon, Sun, User } from 'lucide-react';

interface DesktopSidebarFooterProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onUserClick: () => void;
}

export const DesktopSidebarFooter: React.FC<DesktopSidebarFooterProps> = ({
  isDarkMode,
  toggleDarkMode,
  onUserClick
}) => {
  const { user, logout } = useAuth();

  return (
    <div className={cn("p-3 border-t space-y-3")} style={{
    borderColor: isDarkMode ? '#686868' : '#e5e7eb'
  }}>
      {/* Dark mode toggle */}
      <Button onClick={toggleDarkMode} variant="ghost" size="sm" className={cn("w-full justify-start", isDarkMode ? "text-white" : "text-gray-700")} style={{
      backgroundColor: 'transparent'
    }} onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
    }} onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}>
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span className="ml-2">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
      </Button>

      {/* Clickable User info */}
      <button onClick={onUserClick} className={cn("w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer")} style={{
      backgroundColor: isDarkMode ? '#686868' : '#f9fafb'
    }} onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#b5103c' : '#e5e7eb';
    }} onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f9fafb';
    }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
        backgroundColor: '#b5103c'
      }}>
          <User size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>
            {user?.name}
          </p>
          <p className={cn("text-xs truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
      </button>

      {/* Logout */}
      <Button onClick={logout} variant="ghost" size="sm" className={cn("w-full justify-start", isDarkMode ? "text-white" : "text-gray-700")} style={{
      backgroundColor: 'transparent'
    }} onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
    }} onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}>
        <LogOut size={16} />
        <span className="ml-2">Sair</span>
      </Button>
    </div>
  );
};
