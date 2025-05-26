
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText, Settings, Palette, ChevronRight } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { AuditHistorySection } from './settings/AuditHistorySection';
import { MobileAppearanceSettings } from './MobileAppearanceSettings';

interface MobileSettingsProps {
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();
  const { user } = useAuth();

  const settingsGroups = [
    {
      title: "Pessoal",
      description: "Configurações da sua conta",
      icon: <User size={24} className="text-blue-500" />,
      color: isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
      items: [
        {
          id: "profile",
          label: "Meu Perfil",
          subtitle: "Nome, informações pessoais",
          icon: <User size={20} className="text-blue-500" />,
          visible: true,
          badge: null
        },
        {
          id: "credentials",
          label: "Senha e Segurança",
          subtitle: "Alterar credenciais de acesso",
          icon: <Lock size={20} className="text-amber-500" />,
          visible: canAccessCredentials(),
          badge: null
        },
        {
          id: "appearance",
          label: "Aparência",
          subtitle: "Tema claro/escuro",
          icon: <Palette size={20} className="text-purple-500" />,
          visible: true,
          badge: isDarkMode ? "Escuro" : "Claro"
        }
      ]
    },
    {
      title: "Sistema",
      description: "Notificações e preferências",
      icon: <Bell size={24} className="text-green-500" />,
      color: isDarkMode ? "bg-green-500/10" : "bg-green-50",
      items: [
        {
          id: "notifications",
          label: "Notificações",
          subtitle: "Alertas e lembretes",
          icon: <Bell size={20} className="text-green-500" />,
          visible: true,
          badge: "Ativo"
        }
      ]
    },
    {
      title: "Administração",
      description: "Gerenciamento do sistema",
      icon: <Settings size={24} className="text-red-500" />,
      color: isDarkMode ? "bg-red-500/10" : "bg-red-50",
      items: [
        {
          id: "user-management",
          label: "Usuários",
          subtitle: "Gerenciar contas de usuário",
          icon: <Users size={20} className="text-red-500" />,
          visible: canManageUsers(),
          badge: "Admin"
        },
        {
          id: "channel-management",
          label: "Canais",
          subtitle: "Configurar canais de comunicação",
          icon: <Folder size={20} className="text-indigo-500" />,
          visible: canManageTabs(),
          badge: "Admin"
        },
        {
          id: "audit-history",
          label: "Auditoria",
          subtitle: "Logs de atividades do sistema",
          icon: <FileText size={20} className="text-gray-500" />,
          visible: canAccessAuditHistory(),
          badge: "Admin"
        }
      ]
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "credentials":
        return <CredentialsSection isDarkMode={isDarkMode} />;
      case "profile":
        return <ProfileSection isDarkMode={isDarkMode} />;
      case "appearance":
        return <MobileAppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode || (() => {})} />;
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
    return settingsGroups
      .flatMap(group => group.items)
      .find(item => item.id === activeSection)?.label || 'Configurações';
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

  // Mostra a lista de configurações modernizada
  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      {/* Header moderno */}
      <div className={cn(
        "px-6 py-8 border-b",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-2xl p-3 shadow-sm",
            isDarkMode ? "bg-zinc-800" : "bg-blue-50"
          )}>
            <Settings size={28} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h1 className={cn("text-2xl font-bold", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
              Configurações
            </h1>
            <p className={cn("text-sm mt-1", isDarkMode ? "text-zinc-400" : "text-gray-600")}>
              Olá, {user?.name || 'Usuário'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Lista de grupos de configurações */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {settingsGroups.map((group) => {
          const visibleItems = group.items.filter(item => item.visible);
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={group.title}>
              {/* Header do grupo */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "rounded-xl p-2",
                  group.color
                )}>
                  {group.icon}
                </div>
                <div>
                  <h3 className={cn("font-semibold text-base", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                    {group.title}
                  </h3>
                  <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-600")}>
                    {group.description}
                  </p>
                </div>
              </div>
              
              {/* Cards do grupo */}
              <Card className={cn(
                "border-0 shadow-sm overflow-hidden",
                isDarkMode ? "bg-zinc-900" : "bg-white"
              )}>
                <CardContent className="p-0">
                  {visibleItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full p-4 text-left transition-all duration-200 flex items-center justify-between hover:bg-opacity-50",
                        index !== visibleItems.length - 1 && (isDarkMode ? "border-b border-zinc-800" : "border-b border-gray-100"),
                        isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "rounded-lg p-2",
                          isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={cn("font-medium text-base", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                              {item.label}
                            </h4>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className={cn("text-sm", isDarkMode ? "text-zinc-500" : "text-gray-600")}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className={cn(
                        "flex-shrink-0",
                        isDarkMode ? "text-zinc-500" : "text-gray-400"
                      )} />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          );
        })}
        
        {/* Card de informações do usuário */}
        <Card className={cn(
          "border-0 shadow-sm",
          isDarkMode ? "bg-gradient-to-r from-zinc-900 to-zinc-800" : "bg-gradient-to-r from-blue-50 to-indigo-50"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "rounded-full p-3",
                isDarkMode ? "bg-zinc-700" : "bg-white shadow-sm"
              )}>
                <User size={24} className="text-blue-500" />
              </div>
              <div>
                <h4 className={cn("font-semibold", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
                  {user?.name || 'Usuário'}
                </h4>
                <p className={cn("text-sm", isDarkMode ? "text-zinc-400" : "text-gray-600")}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
