
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: string;
    sender: string;
    isOwn?: boolean;
  };
  isDarkMode: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode }) => {
  return (
    <div className={cn(
      "flex items-start space-x-3 p-3 rounded-lg",
      message.isOwn ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
    )} style={{
      backgroundColor: message.isOwn 
        ? '#b5103c' 
        : (isDarkMode ? '#2a2a2a' : '#f3f4f6')
    }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "text-sm font-medium",
            message.isOwn 
              ? "text-white" 
              : (isDarkMode ? "text-white" : "text-gray-900")
          )}>
            {message.sender}
          </span>
          <span className={cn(
            "text-xs",
            message.isOwn 
              ? "text-gray-200" 
              : (isDarkMode ? "text-gray-400" : "text-gray-500")
          )}>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <p className={cn(
          "text-sm break-words",
          message.isOwn 
            ? "text-white" 
            : (isDarkMode ? "text-gray-200" : "text-gray-800")
        )}>
          {message.content}
        </p>
      </div>
    </div>
  );
};
