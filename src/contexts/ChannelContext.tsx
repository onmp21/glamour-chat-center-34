
import React, { createContext, useContext, useEffect } from 'react';
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
  updateChannelStatus: (channelId: string, isActive: boolean) => Promise<void>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { channels: dbChannels, updateChannelStatus: dbUpdateChannelStatus, loading, refetch } = useChannelsDB();
  
  // Converter formato do banco para o formato esperado pelo contexto
  const channels: Channel[] = dbChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: channel.type,
    isActive: channel.is_active,
    isDefault: channel.is_default
  }));

  const updateChannelStatus = async (channelId: string, isActive: boolean) => {
    await dbUpdateChannelStatus(channelId, isActive);
    // O refetch já é chamado dentro do useChannelsDB após a atualização
  };

  return (
    <ChannelContext.Provider value={{
      channels,
      updateChannelStatus,
      loading,
      refetch
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
