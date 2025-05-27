
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
    
    // Novo formato JSON direto: {"type": "ai", "content": "mensagem", ...}
    if (data.type && data.content !== undefined) {
      return {
        content: data.content.toString().trim(),
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type === 'ai' ? 'assistant' : data.type
      };
    }
    
    // Formato padrão da maioria dos canais
    if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      const firstOutput = data.output[0];
      
      // Verificar se tem content
      if (firstOutput.content !== undefined) {
        return {
          content: firstOutput.content.toString().trim(),
          timestamp: data.chatId || data.timestamp || new Date().toISOString(),
          type: firstOutput.type || 'human'
        };
      }
    }
    
    // Formato específico do gerente_externo (Pedro Vila Nova)
    if (data.chatId && data.output && data.output.length > 0) {
      const message = data.output[0];
      console.log('🔍 Gerente externo message:', message);
      
      if (message.content !== undefined || message.text !== undefined) {
        return {
          content: (message.content || message.text).toString().trim(),
          timestamp: data.chatId || new Date().toISOString(),
          type: message.type || 'human'
        };
      }
    }
    
    // Formato direto com content
    if (data.content !== undefined) {
      return {
        content: data.content.toString().trim(),
        timestamp: data.timestamp || data.chatId || new Date().toISOString(),
        type: data.type || 'human'
      };
    }
    
    // Formato direto com text
    if (data.text !== undefined) {
      return {
        content: data.text.toString().trim(),
        timestamp: data.timestamp || data.chatId || new Date().toISOString(),
        type: data.type || 'human'
      };
    }
    
    // Formato legacy do n8n
    if (data.message) {
      return {
        content: data.message.toString().trim(),
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
