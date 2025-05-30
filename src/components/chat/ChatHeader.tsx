import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical, CheckCircle, Tag, StickyNote } from 'lucide-react'; // Import new icons
import { ChannelConversation } from '@/hooks/useChannelConversations';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConversationStatus } from '@/hooks/useConversationStatus'; // Import status hook

interface ChatHeaderProps {
  isDarkMode: boolean;
  conversation: ChannelConversation;
  channelId: string; // channelId should be required here
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, conversation, channelId }) => {
  const { logChannelAction } = useAuditLogger();
  const { updateConversationStatus, updating: statusUpdating } = useConversationStatus();

  // Handler to mark conversation as resolved
  const handleResolveConversation = () => {
    logChannelAction('resolve_conversation_clicked', channelId, {
      conversation_id: conversation.id,
      contact_name: conversation.contact_name
    });
    updateConversationStatus(channelId, conversation.id, 'resolved');
  };

  // Placeholder handlers for Tags and Notes
  const handleManageTags = () => {
    logChannelAction('manage_tags_clicked', channelId, {
      conversation_id: conversation.id,
      contact_name: conversation.contact_name
    });
    // TODO: Implement Tag management modal/logic
    console.log("Manage Tags clicked for conversation:", conversation.id);
    alert("Funcionalidade de Tags ainda não implementada.");
  };

  const handleManageNotes = () => {
    logChannelAction('manage_notes_clicked', channelId, {
      conversation_id: conversation.id,
      contact_name: conversation.contact_name
    });
    // TODO: Implement Notes management modal/logic
    console.log("Manage Notes clicked for conversation:", conversation.id);
    alert("Funcionalidade de Notas ainda não implementada.");
  };

  const displayName = conversation.contact_name || conversation.contact_phone;

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <h3 className={cn("font-semibold text-lg truncate", isDarkMode ? "text-zinc-100" : "text-gray-900")}>
            {displayName}
          </h3>
          <p className={cn("text-sm truncate", isDarkMode ? "text-zinc-500" : "text-gray-500")}>
            {conversation.contact_phone}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full",
                isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={cn(isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white")}
          >
            <DropdownMenuItem 
              onClick={handleManageNotes}
              className={cn(isDarkMode ? "hover:bg-zinc-700 focus:bg-zinc-700" : "hover:bg-gray-100 focus:bg-gray-100", "cursor-pointer")}
            >
              <StickyNote className="mr-2 h-4 w-4" />
              <span>Notas</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleManageTags}
              className={cn(isDarkMode ? "hover:bg-zinc-700 focus:bg-zinc-700" : "hover:bg-gray-100 focus:bg-gray-100", "cursor-pointer")}
            >
              <Tag className="mr-2 h-4 w-4" />
              <span>Tags</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleResolveConversation}
              disabled={statusUpdating || conversation.status === 'resolved'}
              className={cn(
                isDarkMode ? "hover:bg-zinc-700 focus:bg-zinc-700" : "hover:bg-gray-100 focus:bg-gray-100", 
                "cursor-pointer",
                (statusUpdating || conversation.status === 'resolved') ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Resolver Conversa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
