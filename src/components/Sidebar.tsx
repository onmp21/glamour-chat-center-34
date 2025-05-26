import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from './MobileSidebar';
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
  User,
  Menu
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
  const { getAccessibleChannels } = usePermissions();
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Painel',
      icon: LayoutGrid
    }
  ];

  const allChannelItems = [
    { id: 'chat', label: 'Geral' },
    { id: 'canarana', label: 'Canarana' },
    { id: 'souto-soares', label: 'Souto Soares' },
    { id: 'joao-dourado', label: 'João Dourado' },
    { id: 'america-dourada', label: 'América Dourada' },
    { id: 'gerente-lojas', label: 'Gerente das Lojas' },
    { id: 'gerente-externo', label: 'Gerente do Externo' }
  ];

  const accessibleChannels = getAccessibleChannels();
  const channelItems = allChannelItems.filter(channel => 
    accessibleChannels.includes(channel.id)
  );

  return (
    <>
      {/* Mobile Header */}
      <div className={cn(
        "md:hidden flex items-center justify-between p-4 border-b"
      )} style={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/ea397861-5fcd-451b-872e-727208c03a67.png" 
            alt="Villa Glamour Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Villa Glamour
          </h1>
        </div>
        <Button
          onClick={() => setIsMobileSidebarOpen(true)}
          variant="ghost"
          size="sm"
          className={cn(
            "p-2",
            isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex w-64 h-screen flex-col border-r transition-colors"
      )} style={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        {/* Header */}
        <div className={cn(
          "p-4 border-b"
        )} style={{
          borderColor: isDarkMode ? '#686868' : '#e5e7eb'
        }}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/ea397861-5fcd-451b-872e-727208c03a67.png" 
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
                    ? "text-white"
                    : isDarkMode 
                      ? "text-white" 
                      : "text-gray-700"
                )}
                style={{
                  backgroundColor: activeSection === item.id 
                    ? '#b5103c' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
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
                {channelItems.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => onSectionChange(channel.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-1.5 rounded-md text-left transition-colors text-sm",
                      activeSection === channel.id
                        ? "text-white"
                        : isDarkMode 
                          ? "text-white" 
                          : "text-gray-600"
                    )}
                    style={{
                      backgroundColor: activeSection === channel.id 
                        ? '#b5103c' 
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== channel.id) {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== channel.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{channel.label}</span>
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
                : isDarkMode 
                  ? "text-white" 
                  : "text-gray-700"
            )}
            style={{
              backgroundColor: activeSection === 'exames' 
                ? '#b5103c' 
                : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeSection !== 'exames') {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
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
                : isDarkMode 
                  ? "text-white" 
                  : "text-gray-700"
            )}
            style={{
              backgroundColor: activeSection === 'settings' 
                ? '#b5103c' 
                : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeSection !== 'settings') {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== 'settings') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Settings size={18} />
            <span>Configurações</span>
          </button>
        </nav>

        {/* Bottom section */}
        <div className={cn(
          "p-3 border-t space-y-3"
        )} style={{
          borderColor: isDarkMode ? '#686868' : '#e5e7eb'
        }}>
          {/* Dark mode toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              isDarkMode ? "text-white" : "text-gray-700"
            )}
            style={{
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="ml-2">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </Button>

          {/* User info */}
          <div className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md"
          )} style={{
            backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb'
          }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b5103c' }}>
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
                "text-xs truncate"
              )} style={{
                color: isDarkMode ? '#686868' : '#6b7280'
              }}>
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
              isDarkMode ? "text-white" : "text-gray-700"
            )}
            style={{
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            <span className="ml-2">Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
};
