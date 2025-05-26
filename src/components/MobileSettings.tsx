
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText, Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { AuditHistorySection } from './settings/AuditHistorySection';

interface MobileSettingsProps {
  isDarkMode: boolean;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();

  const settingsOptions = [
    {
      id: "profile",
      label: "Perfil do Usuário",
      subtitle: "Informações pessoais e preferências",
      icon: <User size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: true
    },
    {
      id: "credentials",
      label: "Alterar Credenciais",
      subtitle: "Senha e dados de acesso",
      icon: <Lock size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: canAccessCredentials()
    },
    {
      id: "notifications",
      label: "Notificações",
      subtitle: "Alertas e lembretes",
      icon: <Bell size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: true
    },
    {
      id: "user-management",
      label: "Gerenciamento de Usuários",
      subtitle: "Adicionar e editar usuários",
      icon: <Users size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: canManageUsers()
    },
    {
      id: "channel-management",
      label: "Gerenciamento de Canais",
      subtitle: "Configurar canais de comunicação",
      icon: <Folder size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: canManageTabs()
    },
    {
      id: "audit-history",
      label: "Histórico de Auditoria",
      subtitle: "Logs de atividades do sistema",
      icon: <FileText size={20} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />,
      visible: canAccessAuditHistory()
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "credentials":
        return <CredentialsSection isDarkMode={isDarkMode} />;
      case "profile":
        return <ProfileSection isDarkMode={isDarkMode} />;
      case "notifications":
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case "user-management":
        return <UserManagementSection isDarkMode={isDarkMode} />;
      case "channel-management":
        return <ChannelManagementSection isDarkMode={isDarkMode} />;
      case "audit-history":
        return <AuditHistorySection isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    return settingsOptions.find(opt => opt.id === activeSection)?.label || 'Configurações';
  };

  // Se há uma seção ativa, mostra o conteúdo da seção
  if (activeSection) {
    return (
      <div className={cn(
        "h-full flex flex-col",
        isDarkMode ? "bg-zinc-950" : "bg-gray-50"
      )}>
        <div className={cn(
          "flex items-center px-4 py-4 border-b gap-3 sticky top-0 z-10",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setActiveSection(null)}
            className={cn(
              "mr-2 rounded-full",
              isDarkMode ? "text-zinc-100 hover:bg-zinc-800" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
          </Button>
          <span className={cn("text-lg font-semibold", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
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
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      <div className={cn(
        "flex items-center px-6 py-6 border-b",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "rounded-2xl p-3",
            isDarkMode ? "bg-zinc-800" : "bg-gray-100"
          )}>
            <Settings size={24} className={isDarkMode ? "text-zinc-400" : "text-gray-600"} />
          </div>
          <div>
            <span className={cn("text-xl font-bold", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
              Configurações
            </span>
            <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-600")}>
              Personalize sua experiência
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-3 pb-24">
        {settingsOptions
          .filter((opt) => opt.visible)
          .map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveSection(opt.id)}
              className={cn(
                "w-full p-4 rounded-xl border transition-all duration-200 text-left",
                isDarkMode 
                  ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700" 
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "rounded-lg p-2",
                  isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                )}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-semibold text-base", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                    {opt.label}
                  </h4>
                  <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-600")}>
                    {opt.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};
