
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: '📊' },
    { id: 'chat', label: 'Atendimento', icon: '💬' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ];

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-villa-primary mb-1">Villa Glamour</h1>
        <p className="text-sm text-gray-400">Atendimento</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="text-sm">
          <p className="font-medium text-white">{user?.name}</p>
          <p className="text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeSection === item.id
                    ? "bg-villa-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};
