
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
import { MobileSettingsNavigation } from "./MobileSettingsNavigation";
import { MobileAppearanceSettings } from "./MobileAppearanceSettings";

interface SettingsProps {
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
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

  // Mobile: usar MobileSettingsNavigation com aparência
  const renderMobileSettings = () => (
    <div className="h-screen pb-20">
      {toggleDarkMode ? (
        <MobileAppearanceSettings 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <MobileSettingsNavigation isDarkMode={isDarkMode} />
      )}
    </div>
  );

  // Desktop: manter layout atual
  const renderDesktopSettings = () => (
    <div
      className={cn("h-screen flex flex-row transition-colors")}
      style={{ backgroundColor: isDarkMode ? "#0f0f0f" : "#f9fafb" }}
    >
      <aside className="w-1/3 h-fit p-6 border-r" style={{
        borderColor: isDarkMode ? "#333333" : "#e5e7eb"
      }}>
        <div className="w-full max-w-md mx-auto">
          {settingsItems.map(
            (group) =>
              group.options.some((opt) => opt.visible) && (
                <div key={group.key} className="mb-2">
                  <h4 className={cn("text-xs uppercase ml-1 mb-1 tracking-wide font-bold", isDarkMode ? "text-gray-300" : "text-gray-600")}>
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
      </aside>
      <div className="flex-1 overflow-auto h-full">
        <div className="p-6">{renderContent()}</div>
      </div>
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
              backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
              borderColor: isDarkMode ? "#404040" : "#e5e7eb",
              color: isDarkMode ? "#ffffff" : "#111827"
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Histórico de Auditoria</h3>
            <p
              style={{
                color: isDarkMode ? "#b0b0b0" : "#6b7280"
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
    <>
      {/* Mobile */}
      <div className="md:hidden">
        {renderMobileSettings()}
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block">
        {renderDesktopSettings()}
      </div>
    </>
  );
};
