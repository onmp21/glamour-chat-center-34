
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

const defaultChannels: Channel[] = [
  { id: 'chat', name: 'Yelena-AI', type: 'general', isActive: true, isDefault: true },
  { id: 'canarana', name: 'Canarana', type: 'store', isActive: true, isDefault: false },
  { id: 'souto-soares', name: 'Souto Soares', type: 'store', isActive: true, isDefault: false },
  { id: 'joao-dourado', name: 'João Dourado', type: 'store', isActive: true, isDefault: false },
  { id: 'america-dourada', name: 'América Dourada', type: 'store', isActive: false, isDefault: false },
  { id: 'gerente-lojas', name: 'Gerente das Lojas', type: 'manager', isActive: true, isDefault: false },
  { id: 'gerente-externo', name: 'Gerente do Externo', type: 'manager', isActive: true, isDefault: false },
  { id: 'pedro', name: 'Pedro', type: 'admin', isActive: true, isDefault: false }
];

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const savedChannels = localStorage.getItem('villa_glamour_channels');
    if (savedChannels) {
      try {
        const parsedChannels = JSON.parse(savedChannels);
        setChannels(parsedChannels);
      } catch (error) {
        console.error('Erro ao carregar canais do localStorage:', error);
      }
    }
  }, []);

  const updateChannelStatus = (channelId: string, isActive: boolean) => {
    setChannels(prev => {
      const updatedChannels = prev.map(channel => 
        channel.id === channelId && !channel.isDefault
          ? { ...channel, isActive }
          : channel
      );
      
      // Salvar no localStorage
      localStorage.setItem('villa_glamour_channels', JSON.stringify(updatedChannels));
      
      return updatedChannels;
    });
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
