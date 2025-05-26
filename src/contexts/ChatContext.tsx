
import React, { createContext, useContext, useState } from 'react';
import { ChatTab, Conversation, Message } from '@/types/chat';
import { useChannelConversations } from '@/hooks/useChannelConversations';

interface ChatContextType {
  tabs: ChatTab[];
  conversations: Conversation[];
  activeTab: string;
  activeConversation: string | null;
  createTab: (name: string, type: ChatTab['type']) => boolean;
  deleteTab: (tabId: string) => boolean;
  setActiveTab: (tabId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  getTabConversations: (tabId: string) => Conversation[];
  updateConversationStatus: (conversationId: string, status: Conversation['status']) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const defaultTabs: ChatTab[] = [
  { id: 'chat', name: 'Yelena-AI', type: 'general', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'canarana', name: 'Canarana', type: 'store', createdAt: new Date().toISOString() },
  { id: 'souto-soares', name: 'Souto Soares', type: 'store', createdAt: new Date().toISOString() },
  { id: 'joao-dourado', name: 'João Dourado', type: 'store', createdAt: new Date().toISOString() },
  { id: 'america-dourada', name: 'América Dourada', type: 'store', createdAt: new Date().toISOString() },
  { id: 'gerente-lojas', name: 'Gerente das Lojas', type: 'manager', createdAt: new Date().toISOString() },
  { id: 'gerente-externo', name: 'Gerente do Externo', type: 'external', createdAt: new Date().toISOString() },
  { id: 'pedro', name: 'Pedro', type: 'external', createdAt: new Date().toISOString() }
];

// Função para converter dados do Supabase para o formato do contexto
const convertSupabaseToConversation = (supabaseData: any, tabId: string): Conversation => ({
  id: supabaseData.id,
  contactName: supabaseData.contact_name,
  contactNumber: supabaseData.contact_phone,
  lastMessage: supabaseData.last_message || '',
  lastMessageTime: supabaseData.last_message_time ? new Date(supabaseData.last_message_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
  status: supabaseData.status,
  tabId: tabId,
  tags: []
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<ChatTab[]>(defaultTabs);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  const createTab = (name: string, type: ChatTab['type']): boolean => {
    const newTab: ChatTab = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      type,
      createdAt: new Date().toISOString()
    };
    
    setTabs(prev => [...prev, newTab]);
    return true;
  };

  const deleteTab = (tabId: string): boolean => {
    if (tabs.find(tab => tab.id === tabId)?.isDefault) {
      return false; // Não pode deletar aba padrão
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    setConversations(prev => prev.filter(conv => conv.tabId !== tabId));
    
    if (activeTab === tabId) {
      setActiveTab('chat');
    }
    
    return true;
  };

  const getTabConversations = (tabId: string): Conversation[] => {
    // Esta função agora é principalmente um placeholder
    // As conversas reais virão diretamente das tabelas específicas do Supabase
    return conversations.filter(conv => conv.tabId === tabId);
  };

  const updateConversationStatus = (conversationId: string, status: Conversation['status']) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, status } : conv
    ));
  };

  return (
    <ChatContext.Provider value={{
      tabs,
      conversations,
      activeTab,
      activeConversation,
      createTab,
      deleteTab,
      setActiveTab,
      setActiveConversation,
      getTabConversations,
      updateConversationStatus
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
