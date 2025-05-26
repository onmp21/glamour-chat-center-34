
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  User, 
  Lock, 
  Bell, 
  Users, 
  Folder, 
  FileText 
} from 'lucide-react';

interface SettingsSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  isDarkMode,
  activeSection,
  onSectionChange
}) => {
  const { user } = useAuth();
  const { canManageUsers, canAccessAuditHistory, canManageTabs } = usePermissions();

  const settingsItems = [
    {
      id: 'credentials',
      label: 'Alterar Credenciais',
      icon: Lock,
      visible: true
    },
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: User,
      visible: true
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      visible: true
    },
    {
      id: 'user-management',
      label: 'Gerenciamento de Usuários',
      icon: Users,
      visible: canManageUsers()
    },
    {
      id: 'channel-management',
      label: 'Gerenciamento de Canais',
      icon: Folder,
      visible: canManageTabs()
    },
    {
      id: 'audit-history',
      label: 'Histórico de Auditoria',
      icon: FileText,
      visible: canAccessAuditHistory()
    }
  ];

  const visibleItems = settingsItems.filter(item => item.visible);

  return (
    <div className={cn(
      "w-64 h-full border-r",
      isDarkMode ? "bg-stone-800 border-stone-600" : "bg-white border-gray-200"
    )}>
      <div className="p-4">
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-stone-100" : "text-gray-900"
        )}>
          Configurações
        </h2>
      </div>
      
      <nav className="px-3">
        {visibleItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left transition-colors text-sm mb-1",
                activeSection === item.id
                  ? "bg-primary text-white"
                  : isDarkMode 
                    ? "text-stone-200 hover:bg-stone-700" 
                    : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
