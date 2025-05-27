
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LogOut, Moon, Sun, User } from 'lucide-react';

interface DesktopSidebarFooterProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onUserClick: () => void;
  isCollapsed?: boolean;
}

export const DesktopSidebarFooter: React.FC<DesktopSidebarFooterProps> = ({
  isDarkMode,
  toggleDarkMode,
  onUserClick,
  isCollapsed = false
}) => {
  const { user, logout } = useAuth();
  const { getProfile } = useUserProfile();
  
  const profile = getProfile();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <div className={cn("p-3 border-t space-y-3")} style={{
          borderColor: isDarkMode ? '#686868' : '#e5e7eb'
        }}>
          {/* Dark mode toggle - collapsed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={toggleDarkMode} 
                variant="ghost" 
                size="sm" 
                className={cn("w-full justify-center p-2", isDarkMode ? "text-white" : "text-gray-700")} 
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </TooltipContent>
          </Tooltip>

          {/* User info - collapsed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onUserClick} 
                className={cn(
                  "w-full flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer"
                )} 
                style={{
                  backgroundColor: isDarkMode ? '#686868' : '#f9fafb'
                }} 
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.profileImage || undefined} alt={user?.name} />
                  <AvatarFallback className={cn(
                    "text-xs font-medium",
                    "bg-[#b5103c] text-white"
                  )}>
                    {user?.name ? getInitials(user.name) : <User size={16} />}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role?.replace('_', ' ')}</p>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Logout - collapsed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm" 
                className={cn("w-full justify-center p-2", isDarkMode ? "text-white" : "text-gray-700")} 
              >
                <LogOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Sair
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("p-3 border-t space-y-3")} style={{
      borderColor: isDarkMode ? '#686868' : '#e5e7eb'
    }}>
      {/* Dark mode toggle */}
      <Button 
        onClick={toggleDarkMode} 
        variant="ghost" 
        size="sm" 
        className={cn("w-full justify-start", isDarkMode ? "text-white" : "text-gray-700")} 
        style={{ backgroundColor: 'transparent' }} 
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
        }} 
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span className="ml-2">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
      </Button>

      {/* User info */}
      <button 
        onClick={onUserClick} 
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors cursor-pointer"
        )} 
        style={{
          backgroundColor: isDarkMode ? '#686868' : '#f9fafb'
        }} 
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#b5103c' : '#e5e7eb';
        }} 
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f9fafb';
        }}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={profile?.profileImage || undefined} alt={user?.name} />
          <AvatarFallback className={cn(
            "text-sm font-medium",
            "bg-[#b5103c] text-white"
          )}>
            {user?.name ? getInitials(user.name) : <User size={20} />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 text-left">
          <p className={cn("text-sm font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>
            {user?.name}
          </p>
          <p className={cn("text-xs truncate", isDarkMode ? "text-gray-300" : "text-gray-600")}>
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
      </button>

      {/* Logout */}
      <Button 
        onClick={logout} 
        variant="ghost" 
        size="sm" 
        className={cn("w-full justify-start", isDarkMode ? "text-white" : "text-gray-700")} 
        style={{ backgroundColor: 'transparent' }} 
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
        }} 
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={16} />
        <span className="ml-2">Sair</span>
      </Button>
    </div>
  );
};
