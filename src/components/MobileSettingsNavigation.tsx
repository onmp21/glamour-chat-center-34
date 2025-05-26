
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OptionCard } from '@/components/ui/option-card';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';

interface MobileSettingsNavigationProps {
  isDarkMode: boolean;
}

export const MobileSettingsNavigation: React.FC<MobileSettingsNavigationProps> = ({
  isDarkMode
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();

  const settingsItems = [
    {
      key: "account",
      label: "Minha Conta",
      options: [
        {
          id: "profile",
          label: "Perfil do Usuário",
          icon: <User />,
          visible: true
        },
        {
          id: "credentials",
          label: "Alterar Credenciais",
          icon: <Lock />,
          visible: canAccessCredentials()
        }
      ]
    },
    {
      key: "notifications",
      label: "Notificações",
      options: [
        {
          id: "notifications",
          label: "Configurações de Notificação",
          icon: <Bell />,
          visible: true
        }
      ]
    },
    {
      key: "management",
      label: "Gerenciamento",
      options: [
        {
          id: "user-management",
          label: "Gerenciamento de Usuários",
          icon: <Users />,
          visible: canManageUsers()
        },
        {
          id: "channel-management",
          label: "Gerenciamento de Canais",
          icon: <Folder />,
          visible: canManageTabs()
        }
      ]
    },
    {
      key: "audit",
      label: "Histórico",
      options: [
        {
          id: "audit-history",
          label: "Histórico de Auditoria",
          icon: <FileText />,
          visible: canAccessAuditHistory()
        }
      ]
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "credentials":
        return canAccessCredentials() ? <CredentialsSection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      case "profile":
        return <ProfileSection isDarkMode={isDarkMode} />;
      case "notifications":
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case "user-management":
        return <UserManagementSection isDarkMode={isDarkMode} />;
      case "channel-management":
        return <ChannelManagementSection isDarkMode={isDarkMode} />;
      case "audit-history":
        return (
          <div
            className={cn("p-6 rounded-lg border")}
            style={{
              backgroundColor: isDarkMode ? "#232323" : "#ffffff",
              borderColor: isDarkMode ? "#343434" : "#e5e7eb",
              color: isDarkMode ? "#ffffff" : "#111827"
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Histórico de Auditoria</h3>
            <p
              style={{
                color: isDarkMode ? "#a1a1aa" : "#6b7280"
              }}
            >
              Visualize o histórico de todas as ações realizadas no sistema para fins de auditoria e segurança.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // Se há uma seção ativa, mostra o conteúdo da seção
  if (activeSection) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center px-4 py-3 border-b gap-2" style={{
          borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb"
        }}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setActiveSection(null)}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <span className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
            {settingsItems
              .flatMap(group => group.options)
              .find(opt => opt.id === activeSection)?.label || 'Configurações'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderSectionContent()}
        </div>
      </div>
    );
  }

  // Mostra a lista de seções
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-4 py-3 border-b" style={{
        borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb"
      }}>
        <span className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
          Configurações
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {settingsItems.map(
          (group) =>
            group.options.some((opt) => opt.visible) && (
              <div key={group.key}>
                <h4 className={cn("text-sm font-medium mb-2 px-2", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.options
                    .filter((opt) => opt.visible)
                    .map((opt) => (
                      <OptionCard
                        key={opt.id}
                        icon={opt.icon}
                        title={opt.label}
                        isDarkMode={isDarkMode}
                        onClick={() => setActiveSection(opt.id)}
                      />
                    ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};
