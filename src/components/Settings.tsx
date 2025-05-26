
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsSidebar } from './SettingsSidebar';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsProps {
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState('credentials');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'credentials':
        return <CredentialsSection isDarkMode={isDarkMode} />;
      case 'profile':
        return <ProfileSection isDarkMode={isDarkMode} />;
      case 'notifications':
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case 'user-management':
        return <UserManagementSection isDarkMode={isDarkMode} />;
      case 'tab-management':
        return (
          <div className={cn(
            "p-6 rounded-lg border",
            isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200"
          )}>
            <h3 className="text-lg font-semibold mb-4">Gerenciamento de Abas</h3>
            <p className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Esta funcionalidade permite configurar e gerenciar as abas de atendimento disponíveis no sistema.
            </p>
          </div>
        );
      case 'audit-history':
        return (
          <div className={cn(
            "p-6 rounded-lg border",
            isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200"
          )}>
            <h3 className="text-lg font-semibold mb-4">Histórico de Auditoria</h3>
            <p className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Visualize o histórico de todas as ações realizadas no sistema para fins de auditoria e segurança.
            </p>
          </div>
        );
      default:
        return <CredentialsSection isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={cn(
      "h-screen flex",
      isDarkMode ? "bg-black" : "bg-gray-50"
    )}>
      <SettingsSidebar 
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
