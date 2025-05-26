
import React, { createContext, useContext, useState } from 'react';

interface Channel {
  id: string;
  name: string;
  type: 'general' | 'store' | 'manager';
  isActive: boolean;
  isDefault: boolean;
}

interface ChannelContextType {
  channels: Channel[];
  updateChannelStatus: (channelId: string, isActive: boolean) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

const defaultChannels: Channel[] = [
  { id: 'general', name: 'Canal Geral', type: 'general', isActive: true, isDefault: true },
  { id: 'canarana', name: 'Canarana', type: 'store', isActive: true, isDefault: false },
  { id: 'souto-soares', name: 'Souto Soares', type: 'store', isActive: true, isDefault: false },
  { id: 'joao-dourado', name: 'João Dourado', type: 'store', isActive: true, isDefault: false },
  { id: 'america-dourada', name: 'América Dourada', type: 'store', isActive: false, isDefault: false },
  { id: 'manager-store', name: 'Gerente das Lojas', type: 'manager', isActive: true, isDefault: false },
  { id: 'manager-external', name: 'Gerente do Externo', type: 'manager', isActive: true, isDefault: false }
];

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);

  const updateChannelStatus = (channelId: string, isActive: boolean) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId && !channel.isDefault
        ? { ...channel, isActive }
        : channel
    ));
    
    // Salvar no localStorage para persistir
    localStorage.setItem('villa_glamour_channels', JSON.stringify(channels));
  };

  return (
    <ChannelContext.Provider value={{
      channels,
      updateChannelStatus
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
