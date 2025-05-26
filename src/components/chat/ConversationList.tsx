
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, Phone } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

interface ConversationListProps {
  isDarkMode: boolean;
  activeChannel: string;
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  isDarkMode,
  activeChannel,
  activeConversation,
  setActiveConversation
}) => {
  const { getTabConversations } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Não lida';
      case 'in_progress':
        return 'Em andamento';
      case 'resolved':
        return 'Resolvida';
      default:
        return status;
    }
  };

  return (
    <Card className={cn(
      "col-span-3 border-0 border-r rounded-none h-full",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className={cn(
          "text-lg flex items-center",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Search size={20} className="mr-2 text-gray-500" />
          Conversas
        </CardTitle>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10",
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                : "bg-white border-gray-200"
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
          {getTabConversations(activeChannel)
            .filter(conv => 
              conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={cn(
                "p-3 border-b cursor-pointer transition-colors",
                activeConversation === conversation.id
                  ? "bg-villa-primary/10 border-villa-primary"
                  : isDarkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-100 hover:bg-gray-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={cn(
                      "font-medium truncate",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {conversation.contactName}
                    </h4>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      getStatusColor(conversation.status)
                    )}></span>
                  </div>
                  <div className={cn(
                    "flex items-center text-sm mt-1",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    <Phone size={12} className="mr-1" />
                    {conversation.contactNumber}
                  </div>
                  <p className={cn(
                    "text-sm mt-1 truncate",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    )}>
                      {conversation.lastMessageTime}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getStatusLabel(conversation.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
