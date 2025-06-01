
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';

interface ChannelsSubmenuProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile?: boolean;
}

export const ChannelsSubmenu: React.FC<ChannelsSubmenuProps> = ({
  isDarkMode,
  activeSection,
  onSectionChange,
  isMobile = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();

  const accessibleChannels = getAccessibleChannels();
  
  const getChannelLegacyId = (channel: any) => {
    const nameToId: Record<string, string> = {
      'Yelena-AI': 'chat',
      'Canarana': 'canarana',
      'Souto Soares': 'souto-soares',
      'João Dourado': 'joao-dourado',
      'América Dourada': 'america-dourada',
      'Gerente das Lojas': 'gerente-lojas',
      'Gerente do Externo': 'gerente-externo',
      'Pedro': 'pedro'
    };
    return nameToId[channel.name] || channel.id;
  };

  const visibleChannels = channels
    .filter(channel => channel.isActive)
    .filter(channel => {
      const legacyId = getChannelLegacyId(channel);
      return accessibleChannels.includes(legacyId);
    });

  return (
    <div className="space-y-1">
      {/* Menu principal de Canais */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) {
            onSectionChange('channels');
          }
        }}
        className={cn(
          "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          activeSection === 'channels'
            ? (isDarkMode 
                ? "bg-zinc-700 text-white" 
                : "bg-blue-100 text-blue-700")
            : (isDarkMode 
                ? "text-zinc-300 hover:bg-zinc-800 hover:text-white" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
        )}
      >
        <MessageSquare className="mr-3 h-4 w-4" />
        <span className="flex-1 text-left">Canais</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Submenu dos canais */}
      {isExpanded && (
        <div className="ml-4 space-y-1">
          {visibleChannels.map((channel) => {
            const legacyId = getChannelLegacyId(channel);
            const isActive = activeSection === legacyId;
            
            return (
              <button
                key={channel.id}
                onClick={() => onSectionChange(legacyId)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? (isDarkMode 
                        ? "bg-zinc-700 text-white" 
                        : "bg-blue-100 text-blue-700")
                    : (isDarkMode 
                        ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700")
                )}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
