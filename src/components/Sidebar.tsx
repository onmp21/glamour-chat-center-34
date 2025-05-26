
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  MessageCircle, 
  Settings, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  FileText,
  User
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode,
  toggleDarkMode
}) => {
  const { user, logout } = useAuth();
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Painel',
      icon: LayoutGrid
    },
    {
      id: 'exames',
      label: 'Exames',
      icon: FileText
    }
  ];

  const channelItems = [
    { id: 'chat', label: 'Geral' },
    { id: 'canarana', label: 'Canarana' },
    { id: 'souto-soares', label: 'Souto Soares' },
    { id: 'joao-dourado', label: 'João Dourado' },
    { id: 'america-dourada', label: 'América Dourada' }
  ];

  return (
    <div className={cn(
      "w-64 h-screen flex flex-col border-r transition-colors",
      isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Header */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/40ef37e8-a8c5-4675-9f5f-afc459cbc70c.png" 
              alt="Villa Glamour Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Villa Glamour
          </h1>
        </div>
      </div>

      {/* Navigation */}
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
                  ? "bg-villa-primary text-white"
                  : isDarkMode 
                    ? "text-gray-300 hover:bg-gray-900" 
                    : "text-gray-700 hover:bg-gray-100"
              )}
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
              isDarkMode ? "text-gray-300 hover:bg-gray-900" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <MessageCircle size={18} />
              <span>Canais</span>
            </div>
            {isChannelsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {isChannelsExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {channelItems.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => onSectionChange(channel.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-1.5 rounded-md text-left transition-colors text-sm",
                    activeSection === channel.id
                      ? "bg-villa-primary text-white"
                      : isDarkMode 
                        ? "text-gray-400 hover:bg-gray-900" 
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span>{channel.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => onSectionChange('settings')}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors text-sm",
            activeSection === 'settings'
              ? "bg-villa-primary text-white"
              : isDarkMode 
                ? "text-gray-300 hover:bg-gray-900" 
                : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Settings size={18} />
          <span>Configurações</span>
        </button>
      </nav>

      {/* Bottom section */}
      <div className={cn(
        "p-3 border-t space-y-3",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        {/* Dark mode toggle */}
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start",
            isDarkMode ? "text-gray-300 hover:bg-gray-900" : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span className="ml-2">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
        </Button>

        {/* User info */}
        <div className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-md",
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        )}>
          <div className="w-8 h-8 bg-villa-primary rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {user?.name}
            </p>
            <p className={cn(
              "text-xs truncate",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start",
            isDarkMode ? "text-gray-300 hover:bg-gray-900" : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <LogOut size={16} />
          <span className="ml-2">Sair</span>
        </Button>
      </div>
    </div>
  );
};
