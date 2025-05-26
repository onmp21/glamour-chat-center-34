
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OptionCard } from '@/components/ui/option-card';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText, Palette, Shield, Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { AuditHistorySection } from './settings/AuditHistorySection';
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
      key: "personal",
      label: "Configurações Pessoais",
      icon: <User size={24} className="text-blue-500" />,
      color: "bg-blue-50",
      options: [
        {
          id: "profile",
          label: "Perfil do Usuário",
          subtitle: "Informações pessoais e preferências",
          icon: <User size={20} className="text-blue-500" />,
          visible: true
        },
        {
          id: "credentials",
          label: "Alterar Credenciais",
          subtitle: "Senha e dados de acesso",
          icon: <Lock size={20} className="text-amber-500" />,
          visible: canAccessCredentials()
        },
        {
          id: "appearance",
          label: "Tema e Aparência",
          subtitle: "Personalizar interface",
          icon: <Palette size={20} className="text-purple-500" />,
          visible: true
        }
      ]
    },
    {
      key: "notifications",
      label: "Notificações",
      icon: <Bell size={24} className="text-green-500" />,
      color: "bg-green-50",
      options: [
        {
          id: "notifications",
          label: "Configurações de Notificação",
          subtitle: "Alertas e lembretes",
          icon: <Bell size={20} className="text-green-500" />,
          visible: true
        }
      ]
    },
    {
      key: "management",
      label: "Gerenciamento",
      icon: <Shield size={24} className="text-red-500" />,
      color: "bg-red-50",
      options: [
        {
          id: "user-management",
          label: "Gerenciamento de Usuários",
          subtitle: "Adicionar e editar usuários",
          icon: <Users size={20} className="text-red-500" />,
          visible: canManageUsers()
        },
        {
          id: "channel-management",
          label: "Gerenciamento de Canais",
          subtitle: "Configurar canais de comunicação",
          icon: <Folder size={20} className="text-indigo-500" />,
          visible: canManageTabs()
        }
      ]
    },
    {
      key: "audit",
      label: "Histórico e Logs",
      icon: <FileText size={24} className="text-gray-500" />,
      color: "bg-gray-50",
      options: [
        {
          id: "audit-history",
          label: "Histórico de Auditoria",
          subtitle: "Logs de atividades do sistema",
          icon: <FileText size={20} className="text-gray-500" />,
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
        return canAccessAuditHistory() ? <AuditHistorySection isDarkMode={isDarkMode} /> : null;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    return settingsItems
      .flatMap(group => group.options)
      .find(opt => opt.id === activeSection)?.label || 'Configurações';
  };

  // Se há uma seção ativa, mostra o conteúdo da seção
  if (activeSection) {
    return (
      <div className="h-full flex flex-col" style={{
        backgroundColor: isDarkMode ? "#0f0f0f" : "#f8fafc"
      }}>
        <div className={cn(
          "flex items-center px-4 py-4 border-b gap-3 sticky top-0 z-10",
          isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setActiveSection(null)}
            className={cn(
              "mr-2 rounded-full",
              isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
          </Button>
          <span className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
            {getSectionTitle()}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderSectionContent()}
        </div>
      </div>
    );
  }

  // Mostra a lista de seções
  return (
    <div className="h-full flex flex-col" style={{
      backgroundColor: isDarkMode ? "#0f0f0f" : "#f8fafc"
    }}>
      <div className={cn(
        "flex items-center px-6 py-6 border-b",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "rounded-2xl p-3",
            isDarkMode ? "bg-gray-800" : "bg-blue-50"
          )}>
            <Settings size={24} className="text-blue-500" />
          </div>
          <div>
            <span className={cn("text-xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
              Configurações
            </span>
            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
              Personalize sua experiência
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
        {settingsItems.map(
          (group) =>
            group.options.some((opt) => opt.visible) && (
              <div key={group.key}>
                <div className={cn(
                  "flex items-center gap-3 mb-4 px-2",
                )}>
                  <div className={cn(
                    "rounded-xl p-2",
                    isDarkMode ? "bg-gray-800" : group.color
                  )}>
                    {group.icon}
                  </div>
                  <div>
                    <h4 className={cn("font-semibold text-base", isDarkMode ? "text-white" : "text-gray-900")}>
                      {group.label}
                    </h4>
                  </div>
                </div>
                <div className="space-y-3">
                  {group.options
                    .filter((opt) => opt.visible)
                    .map((opt) => (
                      <OptionCard
                        key={opt.id}
                        icon={opt.icon}
                        title={opt.label}
                        subtitle={opt.subtitle}
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
