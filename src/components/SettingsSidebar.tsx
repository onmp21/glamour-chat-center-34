
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  User, 
  Bell, 
  Users, 
  Folder, 
  FileText, 
  Lock,
  Palette
} from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode
}) => {
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();

  const settingsItems = [
    {
      key: "account",
      label: "Conta",
      items: [
        {
          id: "profile",
          label: "Perfil do Usuário",
          icon: User,
          visible: true
        },
        {
          id: "credentials",
          label: "Alterar Credenciais",
          icon: Lock,
          visible: canAccessCredentials()
        }
      ]
    },
    {
      key: "preferences",
      label: "Preferências",
      items: [
        {
          id: "appearance",
          label: "Aparência",
          icon: Palette,
          visible: true
        },
        {
          id: "notifications",
          label: "Notificações",
          icon: Bell,
          visible: true
        }
      ]
    },
    {
      key: "management",
      label: "Gerenciamento",
      items: [
        {
          id: "users",
          label: "Usuários",
          icon: Users,
          visible: canManageUsers()
        },
        {
          id: "channels",
          label: "Canais",
          icon: Folder,
          visible: canManageTabs()
        }
      ]
    },
    {
      key: "security",
      label: "Segurança",
      items: [
        {
          id: "audit-history",
          label: "Histórico de Auditoria",
          icon: FileText,
          visible: canAccessAuditHistory()
        }
      ]
    }
  ];

  return (
    <div className="w-64 border-r h-full overflow-y-auto" style={{
      backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
      borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb"
    }}>
      <div className="p-6">
        <h2 className={cn(
          "text-lg font-semibold mb-6",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Configurações
        </h2>
        
        <div className="space-y-6">
          {settingsItems.map(group => 
            group.items.some(item => item.visible) && (
              <div key={group.key}>
                <h3 className={cn(
                  "text-xs font-medium uppercase tracking-wider mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items
                    .filter(item => item.visible)
                    .map(item => {
                      const IconComponent = item.icon;
                      const isActive = activeSection === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-10 px-3",
                            isActive 
                              ? "bg-[#b5103c] text-white hover:bg-[#9d0e34]" 
                              : isDarkMode
                                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          )}
                          onClick={() => onSectionChange(item.id)}
                        >
                          <IconComponent size={16} className="mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
