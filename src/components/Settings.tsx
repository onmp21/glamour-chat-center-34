
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { MobileSettingsNavigation } from './MobileSettingsNavigation';
import { MobileAppearanceSettings } from './MobileAppearanceSettings';
import { SettingsSidebar } from './SettingsSidebar';
import { ProfileSection } from './settings/ProfileSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { CredentialsSection } from './settings/CredentialsSection';
import { AuditHistorySection } from './settings/AuditHistorySection';

interface SettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { user } = useAuth();
  const { canManageUsers, canAccessAuditHistory, canManageTabs, canAccessCredentials } = usePermissions();
  const isMobile = useIsMobile();
  const [activeSettingsSection, setActiveSettingsSection] = useState('profile');

  const renderSettingsContent = () => {
    // Mobile: Use MobileSettingsNavigation component
    if (isMobile) {
      return (
        <MobileSettingsNavigation
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      );
    }

    // Desktop content sections
    switch (activeSettingsSection) {
      case 'profile':
        return <ProfileSection isDarkMode={isDarkMode} />;
      case 'appearance':
        return <MobileAppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      case 'notifications':
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case 'users':
        return canManageUsers() ? <UserManagementSection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      case 'channels':
        return canManageTabs() ? <ChannelManagementSection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      case 'audit-history':
        return canAccessAuditHistory() ? <AuditHistorySection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      case 'credentials':
        return canAccessCredentials() ? <CredentialsSection isDarkMode={isDarkMode} /> : <ProfileSection isDarkMode={isDarkMode} />;
      default:
        return <ProfileSection isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className="flex h-screen" style={{
      backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
    }}>
      {/* Desktop: Show sidebar */}
      {!isMobile && (
        <SettingsSidebar
          activeSection={activeSettingsSection}
          onSectionChange={setActiveSettingsSection}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {!isMobile && (
          <div className="p-6">
            {renderSettingsContent()}
          </div>
        )}
        {isMobile && renderSettingsContent()}
      </div>
    </div>
  );
};
