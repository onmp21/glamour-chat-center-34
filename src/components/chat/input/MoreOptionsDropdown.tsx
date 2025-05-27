
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { ChatSettingsDropdown } from './ChatSettingsDropdown';

interface MoreOptionsDropdownProps {
  isDarkMode: boolean;
  conversationId?: string;
  currentStatus?: 'unread' | 'in_progress' | 'resolved';
  onStatusChange?: (status: 'unread' | 'in_progress' | 'resolved') => void;
}

export const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
  isDarkMode,
  conversationId,
  currentStatus,
  onStatusChange
}) => {
  if (!conversationId) {
    return null;
  }

  return (
    <ChatSettingsDropdown
      isDarkMode={isDarkMode}
      conversationId={conversationId}
      currentStatus={currentStatus}
      onStatusChange={onStatusChange}
    />
  );
};
