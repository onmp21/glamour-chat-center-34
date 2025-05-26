
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  MessageCircle, 
  FileText, 
  Settings, 
  User
} from 'lucide-react';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange,
  isDarkMode
}) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'exames', icon: FileText, label: 'Exames' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 md:hidden border-t mobile-slide-up safe-area-pb-4",
      isDarkMode ? "bg-[#1a1a1a] border-[#333333]" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id || 
            (item.id === 'chat' && ['canarana', 'souto-soares', 'joao-dourado', 'america-dourada', 'gerente-lojas', 'gerente-externo'].includes(activeSection));
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 mobile-touch",
                isActive 
                  ? "bg-[#b5103c] text-white" 
                  : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
