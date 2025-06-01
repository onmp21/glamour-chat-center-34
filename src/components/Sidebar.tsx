import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  PanelLeftClose,
  Headphones,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isVisible: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode,
  toggleDarkMode,
  isVisible,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: BarChart3 },
    { id: 'channels', label: 'Canais', icon: MessageCircle },
    { id: 'exams', label: 'Exames', icon: FileText },
    { id: 'reports', label: 'Relatórios', icon: TrendingUp }, // Nova aba
    { id: 'tags', label: 'Tags', icon: Tag }, // Nova aba
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <div className={cn(
        "h-full transition-all duration-300 flex flex-col",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200",
        "border-r",
        isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-villa-primary rounded-lg flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <span className={cn(
                  "font-bold text-lg",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Glamour Chat
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className={cn(
                "h-8 w-8",
                isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <PanelLeftClose size={18} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeSection === item.id
                    ? "bg-villa-primary text-white"
                    : isDarkMode
                      ? "text-zinc-300 hover:bg-zinc-800"
                      : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-inherit">
          {!isCollapsed && user && (
            <div className="mb-4">
              <p className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-zinc-300" : "text-gray-700"
              )}>
                {user.name}
              </p>
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-zinc-500" : "text-gray-500"
              )}>
                {user.role}
              </p>
            </div>
          )}
          
          <div className={cn("space-y-2", isCollapsed && "flex flex-col items-center")}>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={toggleDarkMode}
              className={cn(
                "w-full",
                isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-600 hover:bg-gray-100",
                isCollapsed && "w-8 h-8"
              )}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              {!isCollapsed && <span className="ml-2">
                {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </span>}
            </Button>
            
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={() => setShowLogoutConfirm(true)}
              className={cn(
                "w-full text-red-600 hover:bg-red-50 hover:text-red-700",
                isDarkMode && "hover:bg-red-900/20",
                isCollapsed && "w-8 h-8"
              )}
            >
              <LogOut size={18} />
              {!isCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className={cn(
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white"
        )}>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Confirmar Logout
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )}>
              Tem certeza que deseja sair do sistema?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(
              isDarkMode ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""
            )}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
