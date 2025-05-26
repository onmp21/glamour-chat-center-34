
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';

interface DesktopSidebarHeaderProps {
  isDarkMode: boolean;
}

export const DesktopSidebarHeader: React.FC<DesktopSidebarHeaderProps> = ({
  isDarkMode
}) => {
  const { user } = useAuth();
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

  return (
    <div className={cn("p-4 border-b")} style={{
      borderColor: isDarkMode ? '#686868' : '#e5e7eb'
    }}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/ea397861-5fcd-451b-872e-727208c03a67.png" 
            alt="Villa Glamour Logo" 
            className="w-16 h-16 object-contain app-logo" 
          />
        </div>
        <div className="flex-1">
          <h1 className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
            Villa Glamour
          </h1>
          {user && (
            <div className="flex items-center space-x-2 mt-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile?.profileImage || undefined} alt={user.name} />
                <AvatarFallback className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                )}>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className={cn(
                "text-sm font-medium truncate",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
