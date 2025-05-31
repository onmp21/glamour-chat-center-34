
export type MessageType = 'text' | 'file' | 'audio' | 'image' | 'video';

export interface FileData {
  base64: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface ExtendedMessageData {
  conversationId: string;
  channelId: string;
  content: string;
  sender: 'customer' | 'agent';
  agentName?: string;
  messageType?: MessageType;
  fileData?: FileData;
}
