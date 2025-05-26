
export interface ChatTab {
  id: string;
  name: string;
  type: 'general' | 'store' | 'department' | 'external' | 'manager';
  isDefault?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactNumber: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'unread' | 'in_progress' | 'resolved';
  assignedTo?: string;
  tabId: string;
  tags: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'agent';
  agentName?: string;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  email?: string;
  notes: string;
  tags: string[];
  conversationHistory: string[];
}
