
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { OptionCard } from "@/components/ui/option-card";
import { User, Lock, Bell, Users, Folder, FileText } from "lucide-react";
import { CredentialsSection } from "./settings/CredentialsSection";
import { ProfileSection } from "./settings/ProfileSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { UserManagementSection } from "./settings/UserManagementSection";
import { ChannelManagementSection } from "./settings/ChannelManagementSection";

interface SettingsProps {
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useAuth();
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();

  // Estrutura de opções, agrupadas
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

  // Renderiza os cards de opção agrupados
  const renderSidebar = () => (
    <div className="w-full max-w-md mx-auto">
      {settingsItems.map(
        (group) =>
          group.options.some((opt) => opt.visible) && (
            <div key={group.key} className="mb-2">
              <h4 className={cn("text-xs uppercase ml-1 mb-1 tracking-wide font-bold", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                {group.label}
              </h4>
              <div className="rounded-2xl bg-transparent space-y-1">
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
  );

  // Conteúdo principal da página de configuração
  const renderContent = () => {
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
        return <ProfileSection isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div
      className={cn("h-screen flex flex-col md:flex-row transition-colors")}
      style={{ backgroundColor: isDarkMode ? "#111112" : "#f9fafb" }}
    >
      <aside className="w-full md:w-1/3 h-fit p-2 md:p-6 border-r-0 md:border-r" style={{
        borderColor: isDarkMode ? "#232323" : "#e5e7eb"
      }}>
        {renderSidebar()}
      </aside>
      <div className="flex-1 overflow-auto h-full">
        <div className="p-2 md:p-6">{renderContent()}</div>
      </div>
    </div>
  );
};
