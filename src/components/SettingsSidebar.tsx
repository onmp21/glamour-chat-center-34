
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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

  const settingsItems = [
    {
      id: 'credentials',
      label: 'Alterar Credenciais',
      icon: Lock,
      allowedRoles: ['admin', 'gerente_externo', 'gerente_lojas', 'operador_loja']
    },
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: User,
      allowedRoles: ['admin', 'gerente_externo', 'gerente_lojas', 'operador_loja']
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      allowedRoles: ['admin', 'gerente_externo', 'gerente_lojas', 'operador_loja']
    },
    {
      id: 'user-management',
      label: 'Gerenciamento de Usuários',
      icon: Users,
      allowedRoles: ['admin']
    },
    {
      id: 'tab-management',
      label: 'Gerenciamento de Abas',
      icon: Folder,
      allowedRoles: ['admin']
    },
    {
      id: 'audit-history',
      label: 'Histórico de Auditoria',
      icon: FileText,
      allowedRoles: ['admin', 'gerente_externo']
    }
  ];

  const visibleItems = settingsItems.filter(item => 
    item.allowedRoles.includes(user?.role || '')
  );

  return (
    <div className={cn(
      "w-64 h-full border-r",
      isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="p-4">
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
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
      </nav>
    </div>
  );
};
