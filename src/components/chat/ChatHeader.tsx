
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  isDarkMode: boolean;
  activeChannel: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isDarkMode,
  activeChannel
}) => {
  const getChannelName = (channel: string) => {
    const names: Record<string, string> = {
      'chat': 'Geral',
      'canarana': 'Canarana',
      'souto-soares': 'Souto Soares',
      'joao-dourado': 'João Dourado',
      'america-dourada': 'América Dourada',
      'gerente-lojas': 'Gerente das Lojas',
      'gerente-externo': 'Gerente do Externo'
    };
    return names[channel] || channel;
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <h1 className={cn(
        "text-3xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        {getChannelName(activeChannel)}
      </h1>
      <p className={cn(
        isDarkMode ? "text-gray-400" : "text-gray-600"
      )}>
        Gerencie suas conversas do WhatsApp
      </p>
    </div>
  );
};
