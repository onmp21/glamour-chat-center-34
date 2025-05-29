import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { LayoutGrid, Settings, FileText, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface DesktopSidebarNavigationProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isCollapsed: boolean;
}

export const DesktopSidebarNavigation: React.FC<DesktopSidebarNavigationProps> = ({
  isDarkMode,
  activeSection,
  onSectionChange,
  isCollapsed
}) => {
  const { channels, refetch } = useChannels();
  const { getAccessibleChannels } = usePermissions();
  const [channelsExpanded, setChannelsExpanded] = useState(false);

  // Refetch channels when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutGrid }
  ];

  // Mapear canais do banco para IDs legados
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

  // Verificar se algum canal está ativo
  const isChannelActive = availableChannels.some(channel => activeSection === channel.legacyId) || activeSection === 'channels';

  const handleChannelsClick = () => {
    if (isCollapsed) {
      onSectionChange('channels');
      return;
    }
    
    setChannelsExpanded(!channelsExpanded);
    // Navegar para a visualização de canais se não estiver em um canal específico
    if (!isChannelActive) {
      onSectionChange('channels');
    }
  };

  // Auto-expandir se um canal estiver ativo
  useEffect(() => {
    if (isChannelActive && !isCollapsed) {
      setChannelsExpanded(true);
    }
  }, [isChannelActive, isCollapsed]);

  const getItemClasses = (isActive: boolean) => cn(
    "w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left text-sm transition-colors",
    isActive
      ? "bg-[#b5103c] text-white"
      : isDarkMode ? "text-gray-200 hover:bg-[#27272a]" : "text-gray-700 hover:bg-gray-100"
  );

  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {/* Main menu items */}
      {menuItems.map(item => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={getItemClasses(activeSection === item.id)}
          >
            <IconComponent size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        );
      })}

      {/* Canais com expansão */}
      <div>
        <button
          onClick={handleChannelsClick}
          className={getItemClasses(isChannelActive)}
        >
          <MessageCircle size={20} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Canais</span>
              {availableChannels.length > 0 && (
                channelsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
            </>
          )}
        </button>

        {/* Lista de canais individuais */}
        {!isCollapsed && channelsExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {availableChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onSectionChange(channel.legacyId)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  activeSection === channel.legacyId
                    ? "bg-[#b5103c] text-white"
                    : isDarkMode ? "text-gray-300 hover:bg-[#27272a]" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {channel.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Other menu items */}
      <button
        onClick={() => onSectionChange('exames')}
        className={getItemClasses(activeSection === 'exames')}
      >
        <FileText size={20} />
        {!isCollapsed && <span>Exames</span>}
      </button>

      <button
        onClick={() => onSectionChange('settings')}
        className={getItemClasses(activeSection === 'settings')}
      >
        <Settings size={20} />
        {!isCollapsed && <span>Configurações</span>}
      </button>
    </nav>
  );
};
