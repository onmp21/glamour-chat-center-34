
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Moon,
  Sun,
  FileText,
  User,
  X
} from 'lucide-react';

interface MobileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode,
  toggleDarkMode,
  isOpen,
  onClose
}) => {
  const { user, logout } = useAuth();
  const { getAccessibleChannels } = usePermissions();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutGrid }
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

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  const handleUserClick = () => {
    handleItemClick('settings');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out md:hidden mobile-slide-up",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )} style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
      }}>
        {/* Header with close button and larger logo */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b"
        )} style={{
          borderColor: isDarkMode ? '#333333' : '#e5e7eb'
        }}>
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/2e823263-bd82-49e9-84f6-6327c136da53.png" 
              alt="Villa Glamour Logo" 
              className="w-12 h-12 object-contain app-logo"
            />
            <h1 className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Villa Glamour
            </h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className={cn(
              "p-2 mobile-touch",
              isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Main menu items */}
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
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
            {channelItems.map(channel => (
              <button
                key={channel.id}
                onClick={() => handleItemClick(channel.id)}
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
                <span>{channel.label}</span>
              </button>
            ))}
          </div>

          {/* Other menu items */}
          <button
            onClick={() => handleItemClick('exames')}
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
            onClick={() => handleItemClick('settings')}
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

        {/* Bottom section */}
        <div className={cn(
          "p-3 border-t space-y-3"
        )} style={{
          borderColor: isDarkMode ? '#333333' : '#e5e7eb'
        }}>
          {/* Dark mode toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mobile-touch",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="ml-2">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </Button>

          {/* Clickable User info */}
          <button 
            onClick={handleUserClick}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer mobile-touch"
            )} 
            style={{
              backgroundColor: isDarkMode ? '#333333' : '#f9fafb'
            }}
          >
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
                "text-xs truncate",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </button>

          {/* Logout */}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mobile-touch",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}
          >
            <LogOut size={16} />
            <span className="ml-2">Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
};
