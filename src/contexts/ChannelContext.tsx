
import React, { createContext, useContext } from 'react';
import { useChannelsDB } from '@/hooks/useChannelsDB';

interface Channel {
  id: string;
  name: string;
  type: 'general' | 'store' | 'manager' | 'admin';
  isActive: boolean;
  isDefault: boolean;
}

interface ChannelContextType {
  channels: Channel[];
  updateChannelStatus: (channelId: string, isActive: boolean) => void;
  loading: boolean;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { channels: dbChannels, updateChannelStatus, loading } = useChannelsDB();
  
  // Converter formato do banco para o formato esperado pelo contexto
  const channels: Channel[] = dbChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type,
    isActive: channel.is_active,
    isDefault: channel.is_default
  }));

  return (
    <ChannelContext.Provider value={{
      channels,
      updateChannelStatus,
      loading
    }}>
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannels = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannels must be used within a ChannelProvider');
  }
  return context;
};
