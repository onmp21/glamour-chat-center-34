
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

interface SettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const isMobile = useIsMobile();
  const [activeSettingsSection, setActiveSettingsSection] = useState('profile');

  const renderSettingsContent = () => {
    // Mobile: Navigation first, then content
    if (isMobile) {
      if (activeSettingsSection === 'navigation') {
        return (
          <MobileSettingsNavigation
            activeSection={activeSettingsSection}
            onSectionChange={setActiveSettingsSection}
            isDarkMode={isDarkMode}
            isAdmin={isAdmin}
          />
        );
      }

      // Mobile content sections
      switch (activeSettingsSection) {
        case 'profile':
          return <ProfileSection isDarkMode={isDarkMode} />;
        case 'appearance':
          return <MobileAppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
        case 'notifications':
          return <NotificationsSection isDarkMode={isDarkMode} />;
        case 'users':
          return isAdmin ? <UserManagementSection isDarkMode={isDarkMode} /> : null;
        case 'channels':
          return isAdmin ? <ChannelManagementSection isDarkMode={isDarkMode} /> : null;
        case 'credentials':
          return <CredentialsSection isDarkMode={isDarkMode} />;
        default:
          return <ProfileSection isDarkMode={isDarkMode} />;
      }
    }

    // Desktop content
    switch (activeSettingsSection) {
      case 'profile':
        return <ProfileSection isDarkMode={isDarkMode} />;
      case 'notifications':
        return <NotificationsSection isDarkMode={isDarkMode} />;
      case 'users':
        return isAdmin ? <UserManagementSection isDarkMode={isDarkMode} /> : null;
      case 'channels':
        return isAdmin ? <ChannelManagementSection isDarkMode={isDarkMode} /> : null;
      case 'credentials':
        return <CredentialsSection isDarkMode={isDarkMode} />;
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
          toggleDarkMode={toggleDarkMode}
          isAdmin={isAdmin}
        />
      )}

      {/* Mobile: Show navigation bar at bottom when in content sections */}
      {isMobile && activeSettingsSection !== 'navigation' && (
        <MobileSettingsNavigation
          activeSection={activeSettingsSection}
          onSectionChange={setActiveSettingsSection}
          isDarkMode={isDarkMode}
          isAdmin={isAdmin}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {renderSettingsContent()}
      </div>
    </div>
  );
};
