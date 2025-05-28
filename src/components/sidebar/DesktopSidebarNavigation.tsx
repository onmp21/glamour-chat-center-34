
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, MessageCircle, Settings, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface DesktopSidebarNavigationProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
}

export const DesktopSidebarNavigation: React.FC<DesktopSidebarNavigationProps> = ({
  isDarkMode,
  activeSection,
  onSectionChange,
  isCollapsed = false
}) => {
  const { channels, refetch } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);

  // Refetch channels when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutGrid }
  ];

  // Mapear canais do banco para IDs legados para compatibilidade
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

  const accessibleChannels = getAccessibleChannels();
  const availableChannels = channels
    .filter(channel => channel.isActive)
    .map(channel => ({
      ...channel,
      legacyId: getChannelLegacyId(channel)
    }))
    .filter(channel => accessibleChannels.includes(channel.legacyId));

  // Verificar se está em algum canal
  const isInChannel = availableChannels.some(channel => activeSection === channel.legacyId);

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <nav className="flex-1 p-3 space-y-1">
          {/* Dashboard */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSectionChange('dashboard')}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-md transition-colors",
                  activeSection === 'dashboard'
                    ? "text-white"
                    : isDarkMode ? "text-white" : "text-gray-600"
                )}
                style={{
                  backgroundColor: activeSection === 'dashboard' ? '#b5103c' : 'transparent'
                }}
                onMouseEnter={e => {
                  if (activeSection !== 'dashboard') {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== 'dashboard') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <LayoutGrid size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Painel
            </TooltipContent>
          </Tooltip>

          {/* Canais - ícone único */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  // Se já está em um canal, não fazer nada. Se não, ir para o primeiro canal disponível
                  if (!isInChannel && availableChannels.length > 0) {
                    onSectionChange(availableChannels[0].legacyId);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-md transition-colors",
                  isInChannel
                    ? "text-white"
                    : isDarkMode ? "text-white" : "text-gray-600"
                )}
                style={{
                  backgroundColor: isInChannel ? '#b5103c' : 'transparent'
                }}
                onMouseEnter={e => {
                  if (!isInChannel) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (!isInChannel) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <MessageCircle size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Canais
            </TooltipContent>
          </Tooltip>

          {/* Exames */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSectionChange('exames')}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-md transition-colors",
                  activeSection === 'exames'
                    ? "text-white"
                    : isDarkMode ? "text-white" : "text-gray-600"
                )}
                style={{
                  backgroundColor: activeSection === 'exames' ? '#b5103c' : 'transparent'
                }}
                onMouseEnter={e => {
                  if (activeSection !== 'exames') {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== 'exames') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <FileText size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Exames
            </TooltipContent>
          </Tooltip>

          {/* Configurações */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSectionChange('settings')}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-md transition-colors",
                  activeSection === 'settings'
                    ? "text-white"
                    : isDarkMode ? "text-white" : "text-gray-600"
                )}
                style={{
                  backgroundColor: activeSection === 'settings' ? '#b5103c' : 'transparent'
                }}
                onMouseEnter={e => {
                  if (activeSection !== 'settings') {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== 'settings') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Settings size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Configurações
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <nav className="flex-1 p-3 space-y-1">
      {/* Main menu items */}
      {menuItems.map(item => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors text-sm",
              activeSection === item.id
                ? "text-white"
                : isDarkMode ? "text-white" : "text-gray-700"
            )}
            style={{
              backgroundColor: activeSection === item.id ? '#b5103c' : 'transparent'
            }}
            onMouseEnter={e => {
              if (activeSection !== item.id) {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              if (activeSection !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <IconComponent size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Canais section */}
      <div>
        <button
          onClick={() => setIsChannelsExpanded(!isChannelsExpanded)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors text-sm",
            isDarkMode ? "text-white" : "text-gray-700"
          )}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div className="flex items-center space-x-3">
            <MessageCircle size={18} />
            <span>Canais</span>
          </div>
          {isChannelsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {isChannelsExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {availableChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onSectionChange(channel.legacyId)}
                className={cn(
                  "w-full flex items-center px-3 py-1.5 rounded-md text-left transition-colors text-sm",
                  activeSection === channel.legacyId
                    ? "text-white"
                    : isDarkMode ? "text-white" : "text-gray-600"
                )}
                style={{
                  backgroundColor: activeSection === channel.legacyId ? '#b5103c' : 'transparent'
                }}
                onMouseEnter={e => {
                  if (activeSection !== channel.legacyId) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (activeSection !== channel.legacyId) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{channel.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exames */}
      <button 
        onClick={() => onSectionChange('exames')} 
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors text-sm", 
          activeSection === 'exames' 
            ? "text-white" 
            : isDarkMode ? "text-white" : "text-gray-700"
        )} 
        style={{
          backgroundColor: activeSection === 'exames' ? '#b5103c' : 'transparent'
        }} 
        onMouseEnter={e => {
          if (activeSection !== 'exames') {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
          }
        }} 
        onMouseLeave={e => {
          if (activeSection !== 'exames') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <FileText size={18} />
        <span>Exames</span>
      </button>

      {/* Settings */}
      <button 
        onClick={() => onSectionChange('settings')} 
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors text-sm", 
          activeSection === 'settings' 
            ? "text-white" 
            : isDarkMode ? "text-white" : "text-gray-700"
        )} 
        style={{
          backgroundColor: activeSection === 'settings' ? '#b5103c' : 'transparent'
        }} 
        onMouseEnter={e => {
          if (activeSection !== 'settings') {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#686868' : '#f3f4f6';
          }
        }} 
        onMouseLeave={e => {
          if (activeSection !== 'settings') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Settings size={18} />
        <span>Configurações</span>
      </button>
    </nav>
  );
};
