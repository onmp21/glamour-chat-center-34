import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChannelConversationsRefactored } from '@/hooks/useChannelConversationsRefactored';
import { useConversationStatus } from '@/hooks/useConversationStatus';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { useToast } from '@/hooks/use-toast';
import { ConversationsList } from './ConversationsList';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput'; // Assuming ChatInput is part of ChatArea or handled there
import { EmptyState } from './EmptyState';
import { ChannelsSection } from './ChannelsSection';

interface WhatsAppChatProps {
  isDarkMode: boolean;
  channelId: string;
  onToggleSidebar?: () => void;
  initialConversationId?: string | null; // Prop for initial ID
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  isDarkMode, 
  channelId, 
  onToggleSidebar, 
  initialConversationId = null // Default to null
}) => {
  const { 
    conversations, 
    loading: conversationsLoading, 
    refreshConversations 
  } = useChannelConversationsRefactored(channelId);
  
  const { updateConversationStatus, getConversationStatus } = useConversationStatus();
  const { logChannelAction, logConversationAction } = useAuditLogger();
  
  // State for the currently selected conversation ID
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  // State to track the channel currently displayed (might differ from channelId prop briefly during transitions)
  const [selectedChannelFromSection, setSelectedChannelFromSection] = useState<string>(channelId);
  const { toast } = useToast();

  // Ref to track if the initial selection has been attempted/logged to avoid redundant logs/warnings
  const initialSelectionAttempted = useRef(false);

  // Log access when component mounts or channelId/initialConversationId changes
  useEffect(() => {
    logChannelAction('chat_interface_accessed', channelId, {
      conversations_count: conversations.length, // Note: conversations might be stale here initially
      loading: conversationsLoading,
      initial_conversation: initialConversationId
    });
    // Reset the attempt flag when props change
    initialSelectionAttempted.current = false; 
  }, [channelId, initialConversationId]);

  // Effect to handle channel changes and initial conversation ID prop changes
  useEffect(() => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel/Initial ID Prop Change - Channel: ${channelId}, Initial ID: ${initialConversationId}`);
    
    // Update the channel tracking state
    setSelectedChannelFromSection(channelId);
    
    // Set the selected conversation based *directly* on the initialConversationId prop for this channel
    // This ensures that if the user navigates directly to a conversation, it's selected immediately
    setSelectedConversationId(initialConversationId);
    
    // Reset the attempt flag as the target might have changed
    initialSelectionAttempted.current = false; 

    logChannelAction('channel_or_initial_id_changed', channelId, {
      initial_conversation_id: initialConversationId,
      action: 'setting_selected_conversation_based_on_prop'
    });

  }, [channelId, initialConversationId]); // Depend only on props

  // Effect to ensure the initial conversation is selected *after* conversations have loaded
  useEffect(() => {
    // Conditions to run:
    // 1. An initialConversationId is specified in the props.
    // 2. Conversations for the *current* channelId have finished loading.
    // 3. The selectedConversationId state *does not yet match* the initialConversationId prop.
    // 4. We haven't already logged an attempt/failure for this initial ID.
    if (initialConversationId && !conversationsLoading && selectedConversationId !== initialConversationId && !initialSelectionAttempted.current) {
      const exists = conversations.some(c => c.id === initialConversationId);
      
      if (exists) {
        console.log(`[WHATSAPP_CHAT] Selecting initial conversation ID ${initialConversationId} after conversations loaded for channel ${channelId}.`);
        // Use the selection handler for consistent logic (e.g., marking as read)
        handleConversationSelect(initialConversationId);
      } else {
        // Only log warning once per initial ID attempt
        console.warn(`[WHATSAPP_CHAT] Initial conversation ID ${initialConversationId} provided but not found in loaded conversations for channel ${channelId}.`);
        // Optionally clear the selection if the initial ID is invalid?
        // setSelectedConversationId(null); // Keep it as is, allowing EmptyState to show
      }
      // Mark that we've processed this initial ID attempt
      initialSelectionAttempted.current = true;
    }
  }, [
    initialConversationId, 
    conversations, // Runs when conversations array updates
    conversationsLoading, // Runs when loading state changes
    selectedConversationId, // Runs if selection changes externally
    channelId, // Ensures check is for the current channel
    handleConversationSelect // Dependency for the selection function
  ]);

  // Handler for selecting a conversation from the list
  const handleConversationSelect = useCallback(async (conversationId: string) => {
    // Use selectedChannelFromSection which reflects the currently viewed channel list
    const currentChannel = selectedChannelFromSection;
    console.log(`📱 [WHATSAPP_CHAT] Selecting conversation: ${conversationId} in channel: ${currentChannel}`);
    
    const conversation = conversations.find(c => c.id === conversationId);
    const currentStatus = getConversationStatus(currentChannel, conversationId);
    
    logConversationAction('conversation_selected', conversationId, {
      channel_id: currentChannel,
      contact_name: conversation?.contact_name,
      contact_phone: conversation?.contact_phone,
      previous_status: currentStatus,
      action_source: 'conversation_list_click'
      // conversation_data: conversation // Avoid logging potentially large objects unless necessary
    });
    
    setSelectedConversationId(conversationId);
    
    // Auto-mark as 'in_progress' (viewed) if it was 'unread'
    if (conversation && currentStatus === 'unread') {
      console.log(`📖 [WHATSAPP_CHAT] Auto-marking conversation ${conversationId} as in_progress`);
      logConversationAction('conversation_auto_marked_viewed', conversationId, { /* ... */ });
      const success = await updateConversationStatus(currentChannel, conversationId, 'in_progress');
      if (success) {
        // Refresh list visually after a short delay
        setTimeout(() => refreshConversations(), 500);
      }
    }
  }, [
    conversations, 
    updateConversationStatus, 
    getConversationStatus, 
    refreshConversations, 
    selectedChannelFromSection, // Use state tracking the viewed channel
    logConversationAction
  ]);

  // Handler for selecting a different channel from the ChannelsSection
  const handleChannelSelect = (newChannelId: string) => {
    console.log(`🔄 [WHATSAPP_CHAT] Channel selected via ChannelsSection: ${newChannelId}`);
    logChannelAction('channel_selected_from_sidebar', newChannelId, { /* ... */ });
    
    // Update the channel tracking state
    setSelectedChannelFromSection(newChannelId);
    // Clear the selected conversation when changing channels manually
    setSelectedConversationId(null);
    // Clear the initial selection attempt flag
    initialSelectionAttempted.current = false;
  };

  // Find the conversation object based on the selected ID
  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-screen w-full relative">
      <div className={cn(
        "flex h-screen w-full border-0 overflow-hidden",
        isDarkMode ? "bg-zinc-950" : "bg-white"
      )}>
        {/* Channels Section */}
        <div className={cn(
          "w-80 flex-shrink-0 border-r h-full flex flex-col",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <div className="h-full overflow-hidden">
            <ChannelsSection
              isDarkMode={isDarkMode}
              activeChannel={selectedChannelFromSection} // Use state for active highlight
              onChannelSelect={handleChannelSelect}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className={cn(
          "w-96 flex-shrink-0 border-r h-full flex flex-col",
          isDarkMode ? "border-zinc-800" : "border-gray-200"
        )}>
          <div className="h-full overflow-hidden">
            <ConversationsList
              channelId={selectedChannelFromSection} // Use state for the list source
              activeConversation={selectedConversationId}
              onConversationSelect={handleConversationSelect}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {selectedConv ? (
            <ChatArea 
              key={`${selectedChannelFromSection}-${selectedConversationId}`} // Key includes channel for remount on channel change
              isDarkMode={isDarkMode} 
              conversation={selectedConv} 
              channelId={selectedChannelFromSection} // Pass the correct channel context
            />
          ) : (
            // Show loading indicator specifically if waiting for an initial conversation
            conversationsLoading && initialConversationId && selectedChannelFromSection === channelId ? (
              <div className="flex items-center justify-center h-full">
                <div className={cn("animate-spin rounded-full h-6 w-6 border-b-2", isDarkMode ? "border-[#fafafa]" : "border-gray-900")}></div>
                <span className={cn("ml-2", isDarkMode ? "text-[#a1a1aa]" : "text-gray-600")}>Carregando conversa...</span>
              </div>
            ) : (
              // Otherwise, show the standard empty state
              <EmptyState isDarkMode={isDarkMode} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

