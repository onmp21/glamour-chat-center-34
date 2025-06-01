
import React from 'react';
import { ArrowLeft, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MoreOptionsDropdown } from './input/MoreOptionsDropdown';

interface ChatHeaderProps {
  contactName: string;
  contactPhone?: string;
  isOnline?: boolean;
  lastSeen?: string;
  isDarkMode: boolean;
  onBack?: () => void;
  conversationId?: string;
  channelId?: string;
  currentStatus?: 'unread' | 'in_progress' | 'resolved';
  onStatusChange?: (status: 'unread' | 'in_progress' | 'resolved') => void;
  onRefresh?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  contactName,
  contactPhone,
  isOnline = false,
  lastSeen,
  isDarkMode,
  onBack,
  conversationId,
  channelId,
  currentStatus,
  onStatusChange,
  onRefresh
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 border-b",
      isDarkMode 
        ? "bg-zinc-900 border-zinc-800" 
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={cn(
              "h-8 w-8 btn-animate",
              isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-villa-primary text-white text-sm">
            {getInitials(contactName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium truncate",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            {contactName}
          </h3>
          {contactPhone && (
            <p className={cn(
              "text-xs truncate",
              isDarkMode ? "text-zinc-400" : "text-gray-500"
            )}>
              {contactPhone}
            </p>
          )}
          <p className={cn(
            "text-xs",
            isOnline 
              ? "text-green-500" 
              : isDarkMode ? "text-zinc-500" : "text-gray-500"
          )}>
            {isOnline ? 'Online' : lastSeen ? `Visto por último: ${lastSeen}` : 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 btn-animate",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Phone size={18} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 btn-animate",
            isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Video size={18} />
        </Button>
        
        <MoreOptionsDropdown
          isDarkMode={isDarkMode}
          conversationId={conversationId}
          channelId={channelId}
          currentStatus={currentStatus}
          contactName={contactName}
          contactPhone={contactPhone}
          lastActivity={lastSeen}
          onStatusChange={onStatusChange}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
};
