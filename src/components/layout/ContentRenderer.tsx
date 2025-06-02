
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { Exams } from '@/components/Exams';
import { ReportsModern } from '@/components/reports/ReportsModern';
import { Tags } from '@/components/Tags';
import { UnifiedSettings } from '@/components/UnifiedSettings';

interface ContentRendererProps {
  activeSection: string;
  isDarkMode: boolean;
  onSectionChange: (section: string) => void;
  toggleDarkMode?: () => void;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  activeSection,
  isDarkMode,
  onSectionChange,
  toggleDarkMode
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />;
      
      case 'channels':
        return (
          <ChannelsSidebar 
            isDarkMode={isDarkMode} 
            activeSection={activeSection}
            onChannelSelect={onSectionChange}
          />
        );
      
      case 'chat':
      case 'canarana':
      case 'souto-soares':
      case 'joao-dourado':
      case 'america-dourada':
      case 'gerente-lojas':
      case 'gerente-externo':
      case 'pedro':
        return <ChatInterface isDarkMode={isDarkMode} activeChannel={activeSection} />;
      
      case 'exams':
      case 'exames':
        return <Exams isDarkMode={isDarkMode} />;
      
      case 'reports':
        return <ReportsModern isDarkMode={isDarkMode} />;
      
      case 'tags':
        return <Tags isDarkMode={isDarkMode} />;
      
      case 'settings':
        return <UnifiedSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode || (() => {})} />;
      
      default:
        return <Dashboard isDarkMode={isDarkMode} onSectionSelect={onSectionChange} />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
};
