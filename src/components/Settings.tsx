
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsSidebar } from './SettingsSidebar';
import { CredentialsSection } from './settings/CredentialsSection';
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
        return <div className="p-6">Perfil do Usuário - Em desenvolvimento</div>;
      case 'notifications':
        return <div className="p-6">Notificações - Em desenvolvimento</div>;
      case 'user-management':
        return <UserManagementSection isDarkMode={isDarkMode} />;
      case 'tab-management':
        return <div className="p-6">Gerenciamento de Abas - Em desenvolvimento</div>;
      case 'audit-history':
        return <div className="p-6">Histórico de Auditoria - Em desenvolvimento</div>;
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
