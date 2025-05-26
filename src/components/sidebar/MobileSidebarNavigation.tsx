import React from 'react';
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
  const { channels } = useChannels();
  const { getAccessibleChannels } = usePermissions();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutGrid }
  ];

  const accessibleChannels = getAccessibleChannels();
  const availableChannels = channels.filter(channel => 
    channel.isActive && accessibleChannels.includes(channel.id)
  );

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
            onClick={() => onItemClick(channel.id)}
            className={cn(
              "w-full flex items-center px-6 py-2 rounded-md text-left text-sm mobile-touch",
              activeSection === channel.id
                ? "text-white"
                : isDarkMode ? "text-gray-200" : "text-gray-600"
            )}
            style={{
              backgroundColor: activeSection === channel.id ? '#b5103c' : 'transparent'
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
