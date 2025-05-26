
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChannels } from '@/contexts/ChannelContext';
import { usePermissions } from '@/hooks/usePermissions';
import { LayoutGrid, Settings, FileText } from 'lucide-react';

interface MobileSidebarNavigationProps {
  isDarkMode: boolean;
  activeSection: string;
  onItemClick: (sectionId: string) => void;
}

export const MobileSidebarNavigation: React.FC<MobileSidebarNavigationProps> = ({
  isDarkMode,
  activeSection,
  onItemClick
}) => {
  const { channels, refetch } = useChannels();
  const { getAccessibleChannels } = usePermissions();

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

  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {/* Main menu items */}
      {menuItems.map(item => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left text-sm mobile-touch",
              activeSection === item.id
                ? "text-white"
                : isDarkMode ? "text-gray-200" : "text-gray-700"
            )}
            style={{
              backgroundColor: activeSection === item.id ? '#b5103c' : 'transparent'
            }}
          >
            <IconComponent size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Channels */}
      <div className="py-2">
        <div className={cn(
          "px-3 py-2 text-xs font-semibold uppercase tracking-wider",
          isDarkMode ? "text-gray-300" : "text-gray-500"
        )}>
          Canais
        </div>
        {availableChannels.map(channel => (
          <button
            key={channel.id}
            onClick={() => onItemClick(channel.legacyId)}
            className={cn(
              "w-full flex items-center px-6 py-2 rounded-md text-left text-sm mobile-touch",
              activeSection === channel.legacyId
                ? "text-white"
                : isDarkMode ? "text-gray-200" : "text-gray-600"
            )}
            style={{
              backgroundColor: activeSection === channel.legacyId ? '#b5103c' : 'transparent'
            }}
          >
            <span>{channel.name}</span>
          </button>
        ))}
      </div>

      {/* Other menu items */}
      <button
        onClick={() => onItemClick('exames')}
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left text-sm mobile-touch",
          activeSection === 'exames'
            ? "text-white"
            : isDarkMode ? "text-gray-200" : "text-gray-700"
        )}
        style={{
          backgroundColor: activeSection === 'exames' ? '#b5103c' : 'transparent'
        }}
      >
        <FileText size={20} />
        <span>Exames</span>
      </button>

      <button
        onClick={() => onItemClick('settings')}
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left text-sm mobile-touch",
          activeSection === 'settings'
            ? "text-white"
            : isDarkMode ? "text-gray-200" : "text-gray-700"
        )}
        style={{
          backgroundColor: activeSection === 'settings' ? '#b5103c' : 'transparent'
        }}
      >
        <Settings size={20} />
        <span>Configurações</span>
      </button>
    </nav>
  );
};
