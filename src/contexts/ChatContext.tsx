
import React, { createContext, useContext, useState } from 'react';
import { ChatTab, Conversation, Message } from '@/types/chat';

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
  { id: 'general', name: 'Geral', type: 'general', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'canarana', name: 'Canarana', type: 'store', createdAt: new Date().toISOString() },
  { id: 'souto-soares', name: 'Souto Soares', type: 'store', createdAt: new Date().toISOString() },
  { id: 'joao-dourado', name: 'João Dourado', type: 'store', createdAt: new Date().toISOString() },
  { id: 'america-dourada', name: 'América Dourada', type: 'store', createdAt: new Date().toISOString() },
  { id: 'manager-external', name: 'Gerente Externo', type: 'external', createdAt: new Date().toISOString() }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactName: 'Maria Silva',
    contactNumber: '(77) 99999-1234',
    lastMessage: 'Gostaria de saber sobre os produtos em promoção',
    lastMessageTime: '10:30',
    status: 'unread',
    tabId: 'canarana',
    tags: ['promoção', 'produtos']
  },
  {
    id: '2',
    contactName: 'João Santos',
    contactNumber: '(77) 99999-5678',
    lastMessage: 'Obrigado pelo atendimento!',
    lastMessageTime: '09:15',
    status: 'resolved',
    tabId: 'general',
    tags: ['satisfeito']
  },
  {
    id: '3',
    contactName: 'Ana Costa',
    contactNumber: '(77) 99999-9012',
    lastMessage: 'Preciso falar com um gerente',
    lastMessageTime: '11:45',
    status: 'in_progress',
    tabId: 'manager-external',
    tags: ['gerencia', 'urgente']
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<ChatTab[]>(defaultTabs);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeTab, setActiveTab] = useState('general');
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
      setActiveTab('general');
    }
    
    return true;
  };

  const getTabConversations = (tabId: string): Conversation[] => {
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
