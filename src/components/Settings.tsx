
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsSidebar } from './SettingsSidebar';
import { CredentialsSection } from './settings/CredentialsSection';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
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
      case 'channel-management':
        return <ChannelManagementSection isDarkMode={isDarkMode} />;
      case 'audit-history':
        return (
          <div className={cn(
            "p-6 rounded-lg border"
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
        return <CredentialsSection isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={cn(
      "h-screen flex"
    )} style={{
      backgroundColor: isDarkMode ? '#000000' : '#f9fafb'
    }}>
      <SettingsSidebar 
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
