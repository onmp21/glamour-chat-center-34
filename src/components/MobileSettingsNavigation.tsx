
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OptionCard } from '@/components/ui/option-card';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText, Palette } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { MobileAppearanceSettings } from './MobileAppearanceSettings';

interface MobileSettingsNavigationProps {
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
}

export const MobileSettingsNavigation: React.FC<MobileSettingsNavigationProps> = ({
  isDarkMode,
  toggleDarkMode
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
          icon: <User size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
          visible: true
        },
        {
          id: "credentials",
          label: "Alterar Credenciais",
          icon: <Lock size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
          visible: canAccessCredentials()
        }
      ]
    },
    {
      key: "appearance",
      label: "Aparência",
      options: [
        {
          id: "appearance",
          label: "Tema e Aparência",
          icon: <Palette size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
          visible: true
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
          icon: <Bell size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
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
          icon: <Users size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
          visible: canManageUsers()
        },
        {
          id: "channel-management",
          label: "Gerenciamento de Canais",
          icon: <Folder size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
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
          icon: <FileText size={20} className={isDarkMode ? "text-white" : "text-gray-700"} />,
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
      case "appearance":
        return <MobileAppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode || (() => {})} />;
      case "notifications":
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case "user-management":
        return canManageUsers() ? <UserManagementSection isDarkMode={isDarkMode} /> : null;
      case "channel-management":
        return canManageTabs() ? <ChannelManagementSection isDarkMode={isDarkMode} /> : null;
      case "audit-history":
        return canAccessAuditHistory() ? (
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
        ) : null;
      default:
        return null;
    }
  };

  // Se há uma seção ativa, mostra o conteúdo da seção
  if (activeSection) {
    return (
      <div className="h-full flex flex-col" style={{
        backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
      }}>
        <div className="flex items-center px-4 py-4 border-b gap-3" style={{
          borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff"
        }}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setActiveSection(null)}
            className={cn("mr-2")}
            style={{
              color: isDarkMode ? "#ffffff" : "#374151"
            }}
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
    <div className="h-full flex flex-col" style={{
      backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
    }}>
      <div className="flex items-center px-4 py-4 border-b" style={{
        borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff"
      }}>
        <span className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
          Configurações
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {settingsItems.map(
          (group) =>
            group.options.some((opt) => opt.visible) && (
              <div key={group.key}>
                <h4 className={cn("text-sm font-medium mb-3 px-2", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                  {group.label}
                </h4>
                <div className="space-y-2">
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
