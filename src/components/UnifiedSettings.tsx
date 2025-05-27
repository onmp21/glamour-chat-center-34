
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Lock, Bell, Users, Folder, FileText, Settings, Palette, ChevronRight, LogOut } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { AuditHistorySection } from './settings/AuditHistorySection';
import { MobileAppearanceSettings } from './MobileAppearanceSettings';

interface UnifiedSettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobile?: boolean;
}

export const UnifiedSettings: React.FC<UnifiedSettingsProps> = ({ 
  isDarkMode, 
  toggleDarkMode, 
  isMobile = false 
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();
  const { user, logout } = useAuth();

  const settingsGroups = [
    {
      title: "Conta",
      items: [
        {
          id: "profile",
          label: "Meu Perfil",
          subtitle: "Nome e informações pessoais",
          icon: <User size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: true
        },
        {
          id: "credentials",
          label: "Credenciais",
          subtitle: "Alterar senha de acesso",
          icon: <Lock size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: canAccessCredentials()
        },
        {
          id: "appearance",
          label: "Aparência",
          subtitle: "Tema da interface",
          icon: <Palette size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: true,
          badge: isDarkMode ? "Escuro" : "Claro"
        }
      ]
    },
    {
      title: "Sistema",
      items: [
        {
          id: "notifications",
          label: "Notificações",
          subtitle: "Alertas e configurações",
          icon: <Bell size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: true
        }
      ]
    },
    {
      title: "Administração",
      items: [
        {
          id: "user-management",
          label: "Usuários",
          subtitle: "Gerenciar contas",
          icon: <Users size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: canManageUsers(),
          badge: "Admin"
        },
        {
          id: "channel-management",
          label: "Canais",
          subtitle: "Configurar canais",
          icon: <Folder size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
          visible: canManageTabs(),
          badge: "Admin"
        },
        {
          id: "audit-history",
          label: "Auditoria",
          subtitle: "Histórico de atividades",
          icon: <FileText size={18} className={cn("", isDarkMode ? "text-zinc-400" : "text-gray-600")} />,
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
        return <MobileAppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
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

  // Visualização da seção específica
  if (activeSection) {
    return (
      <div className={cn(
        "h-full flex flex-col",
        isDarkMode ? "bg-background" : "bg-gray-50"
      )}>
        <div className={cn(
          "flex items-center px-4 py-4 border-b sticky top-0 z-10",
          isDarkMode ? "bg-card border-border" : "bg-white border-gray-200"
        )}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setActiveSection(null)}
            className={cn(
              "mr-3 rounded-full",
              isDarkMode ? "text-foreground hover:bg-accent" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={20} />
          </Button>
          <span className={cn("text-lg font-semibold", isDarkMode ? "text-foreground" : "text-gray-900")}>
            {getSectionTitle()}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderSectionContent()}
        </div>
      </div>
    );
  }

  // Lista principal das configurações
  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-background" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "px-6 py-6 border-b",
        isDarkMode ? "bg-card border-border" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-full p-3",
            isDarkMode ? "bg-accent" : "bg-gray-100"
          )}>
            <Settings size={24} className={isDarkMode ? "text-muted-foreground" : "text-gray-600"} />
          </div>
          <div className="flex-1">
            <h1 className={cn("text-xl font-bold", isDarkMode ? "text-foreground" : "text-gray-900")}>
              Configurações
            </h1>
            <p className={cn("text-sm", isDarkMode ? "text-muted-foreground" : "text-gray-600")}>
              {user?.name || 'Usuário'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Lista de configurações */}
      <div className={cn(
        "flex-1 overflow-y-auto p-4 space-y-6",
        isMobile ? "pb-24" : "pb-6"
      )}>
        {settingsGroups.map((group) => {
          const visibleItems = group.items.filter(item => item.visible);
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={group.title}>
              <h3 className={cn(
                "text-sm font-medium mb-3 px-2",
                isDarkMode ? "text-muted-foreground" : "text-gray-600"
              )}>
                {group.title}
              </h3>
              
              <Card className={cn(
                "border-0 shadow-sm",
                isDarkMode ? "bg-card" : "bg-white"
              )}>
                <CardContent className="p-0">
                  {visibleItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full p-4 text-left transition-all duration-200 flex items-center justify-between",
                        index !== visibleItems.length - 1 && (isDarkMode ? "border-b border-border" : "border-b border-gray-100"),
                        isDarkMode ? "hover:bg-accent active:bg-accent/80" : "hover:bg-gray-50 active:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "rounded-lg p-2",
                          isDarkMode ? "bg-accent" : "bg-gray-100"
                        )}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn("font-medium text-sm", isDarkMode ? "text-foreground" : "text-gray-900")}>
                              {item.label}
                            </h4>
                            {item.badge && (
                              <Badge variant="secondary" className={cn(
                                "text-xs",
                                isDarkMode ? "bg-accent text-muted-foreground" : "bg-gray-100 text-gray-700"
                              )}>
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className={cn("text-xs", isDarkMode ? "text-muted-foreground" : "text-gray-600")}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={cn(
                        "flex-shrink-0",
                        isDarkMode ? "text-muted-foreground" : "text-gray-400"
                      )} />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          );
        })}
        
        {/* Botão de Logout */}
        <Card className={cn(
          "border-0 shadow-sm",
          isDarkMode ? "bg-card" : "bg-white"
        )}>
          <CardContent className="p-0">
            <button
              onClick={logout}
              className={cn(
                "w-full p-4 text-left transition-all duration-200 flex items-center gap-3",
                isDarkMode ? "hover:bg-red-950/50 active:bg-red-950/70" : "hover:bg-red-50 active:bg-red-100"
              )}
            >
              <div className={cn(
                "rounded-lg p-2",
                isDarkMode ? "bg-red-950/30" : "bg-red-50"
              )}>
                <LogOut size={18} className="text-red-500" />
              </div>
              <div>
                <h4 className={cn("font-medium text-sm text-red-500")}>
                  Sair da Conta
                </h4>
                <p className={cn("text-xs", isDarkMode ? "text-muted-foreground" : "text-gray-600")}>
                  Fazer logout do sistema
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
        
        {/* Card de informações do usuário */}
        <Card className={cn(
          "border-0 shadow-sm",
          isDarkMode ? "bg-card" : "bg-white"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "rounded-full p-2",
                isDarkMode ? "bg-accent" : "bg-gray-100"
              )}>
                <User size={20} className={isDarkMode ? "text-muted-foreground" : "text-gray-600"} />
              </div>
              <div>
                <h4 className={cn("font-medium text-sm", isDarkMode ? "text-foreground" : "text-gray-900")}>
                  {user?.name || 'Usuário'}
                </h4>
                <p className={cn("text-xs", isDarkMode ? "text-muted-foreground" : "text-gray-600")}>
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
