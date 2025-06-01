
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  Calendar, 
  BarChart3, 
  Tags
} from 'lucide-react';
import { ChannelsSubmenu } from './ChannelsSubmenu';

interface DesktopSidebarNavigationProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DesktopSidebarNavigation: React.FC<DesktopSidebarNavigationProps> = ({
  isDarkMode,
  activeSection,
  onSectionChange
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Painel',
      icon: Home
    },
    {
      id: 'exames',
      label: 'Exames',
      icon: Calendar
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3
    },
    {
      id: 'tags',
      label: 'Tags de Contatos',
      icon: Tags
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings
    }
  ];

  return (
    <nav className="flex-1 px-4 pb-4 space-y-2">
      {/* Menu items principais */}
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={cn(
            "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            activeSection === item.id
              ? (isDarkMode 
                  ? "bg-zinc-700 text-white" 
                  : "bg-blue-100 text-blue-700")
              : (isDarkMode 
                  ? "text-zinc-300 hover:bg-zinc-800 hover:text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
          )}
        >
          <item.icon className="mr-3 h-4 w-4" />
          {item.label}
        </button>
      ))}

      {/* Submenu de Canais */}
      <ChannelsSubmenu
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    </nav>
  );
};
