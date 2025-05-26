
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SettingsSidebar } from './SettingsSidebar';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

interface SettingsProps {
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { user } = useAuth();
  const { canAccessCredentials } = usePermissions();

  const renderContent = () => {
    switch (activeSection) {
      case 'credentials':
        return canAccessCredentials() ? <CredentialsSection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      case 'profile':
        return <ProfileSection isDarkMode={isDarkMode} />;
      case 'notifications':
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case 'user-management':
        return <UserManagementSection isDarkMode={isDarkMode} />;
      case 'channel-management':
        return <ChannelManagementSection isDarkMode={isDarkMode} />;
      case 'audit-history':
        return (
          <div className={cn(
            "p-4 md:p-6 rounded-lg border"
          )} style={{
            backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
            borderColor: isDarkMode ? '#686868' : '#e5e7eb',
            color: isDarkMode ? '#ffffff' : '#111827'
          }}>
            <h3 className="text-lg font-semibold mb-4">Histórico de Auditoria</h3>
            <p style={{
              color: isDarkMode ? '#a1a1aa' : '#6b7280'
            }}>
              Visualize o histórico de todas as ações realizadas no sistema para fins de auditoria e segurança.
            </p>
          </div>
        );
      default:
        return <ProfileSection isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={cn(
      "h-screen flex flex-col md:flex-row"
    )} style={{
      backgroundColor: isDarkMode ? '#000000' : '#f9fafb'
    }}>
      {/* Mobile Settings Navigation */}
      <div className="md:hidden">
        <div className={cn(
          "p-4 border-b",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <h1 className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Configurações
          </h1>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveSection('profile')}
              className={cn(
                "p-3 rounded-lg text-sm font-medium transition-colors mobile-touch",
                activeSection === 'profile'
                  ? "bg-red-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Perfil
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={cn(
                "p-3 rounded-lg text-sm font-medium transition-colors mobile-touch",
                activeSection === 'notifications'
                  ? "bg-red-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Notificações
            </button>
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveSection('user-management')}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-colors mobile-touch",
                    activeSection === 'user-management'
                      ? "bg-red-600 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Usuários
                </button>
                <button
                  onClick={() => setActiveSection('channel-management')}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-colors mobile-touch",
                    activeSection === 'channel-management'
                      ? "bg-red-600 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Canais
                </button>
              </>
            )}
            {canAccessCredentials() && (
              <button
                onClick={() => setActiveSection('credentials')}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium transition-colors mobile-touch",
                  activeSection === 'credentials'
                    ? "bg-red-600 text-white"
                    : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Credenciais
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SettingsSidebar 
          isDarkMode={isDarkMode}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-3 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
