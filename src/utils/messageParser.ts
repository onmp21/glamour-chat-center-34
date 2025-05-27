
export interface MessageData {
  content: string;
  timestamp: string;
  type: 'human' | 'assistant' | 'ai';
}

export const parseMessageData = (messageJson: any): MessageData | null => {
  if (!messageJson) {
    console.log('⚠️ messageJson is null or undefined');
    return null;
  }

  try {
    // Se já é um objeto, usar diretamente
    const data = typeof messageJson === 'string' ? JSON.parse(messageJson) : messageJson;
    
    // Debug para entender a estrutura
    console.log('🔍 Raw message data:', data);
    
    // Formato padrão da maioria dos canais
    if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      const firstOutput = data.output[0];
      
      // Verificar se tem content
      if (firstOutput.content) {
        return {
          content: firstOutput.content,
          timestamp: data.chatId || data.timestamp || new Date().toISOString(),
          type: firstOutput.type || 'human'
        };
      }
    }
    
    // Formato específico do gerente_externo (Pedro Vila Nova)
    if (data.chatId && data.output && data.output.length > 0) {
      const message = data.output[0];
      console.log('🔍 Gerente externo message:', message);
      
      if (message.content || message.text) {
        return {
          content: message.content || message.text,
          timestamp: data.chatId || new Date().toISOString(),
          type: message.type || 'human'
        };
      }
    }
    
    // Formato direto com content
    if (data.content) {
      return {
        content: data.content,
        timestamp: data.timestamp || data.chatId || new Date().toISOString(),
        type: data.type || 'human'
      };
    }
    
    // Formato direto com text
    if (data.text) {
      return {
        content: data.text,
        timestamp: data.timestamp || data.chatId || new Date().toISOString(),
        type: data.type || 'human'
      };
    }
    
    // Formato legacy do n8n
    if (data.message) {
      return {
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        type: 'human'
      };
    }
    
    console.log('⚠️ Unable to parse message data:', data);
    return null;
    
  } catch (error) {
    console.error('❌ Error parsing message JSON:', error, messageJson);
    return null;
  }
};
