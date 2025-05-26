
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProfileSection } from './settings/ProfileSection';
import { CredentialsSection } from './settings/CredentialsSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { UserManagementSection } from './settings/UserManagementSection';
import { ChannelManagementSection } from './settings/ChannelManagementSection';
import { AuditHistorySection } from './settings/AuditHistorySection';
import { TagManager } from './tags/TagManager';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsProps {
  isDarkMode: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Perfil', component: ProfileSection },
    { id: 'credentials', label: 'Credenciais', component: CredentialsSection },
    { id: 'notifications', label: 'Notificações', component: NotificationsSection },
    { id: 'tags', label: 'Tags', component: TagManager },
    ...(user?.role === 'admin' ? [
      { id: 'users', label: 'Usuários', component: UserManagementSection },
      { id: 'channels', label: 'Canais', component: ChannelManagementSection },
      { id: 'audit', label: 'Auditoria', component: AuditHistorySection }
    ] : [])
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || ProfileSection;

  return (
    <div className={cn(
      "min-h-screen p-6",
      isDarkMode ? "bg-zinc-950" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            Configurações
          </h1>
          <p className={cn(
            "text-lg mt-2",
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          )}>
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de navegação */}
          <Card className={cn(
            "lg:w-72 h-fit",
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-0">
              <nav className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                      activeSection === section.id
                        ? "bg-[#b5103c] text-white"
                        : isDarkMode 
                          ? "text-zinc-300 hover:bg-zinc-800" 
                          : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Conteúdo principal */}
          <div className="flex-1">
            <Card className={cn(
              "min-h-[500px]",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
            )}>
              <CardContent className="p-6">
                <ActiveComponent isDarkMode={isDarkMode} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
