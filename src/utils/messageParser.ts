
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
    
    // NOVO FORMATO PRINCIPAL: {"type": "ia", "content": "mensagem"} ou {"type": "human", "content": "mensagem"}
    if (data.type && data.content !== undefined) {
      return {
        content: data.content.toString().trim(),
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type === 'ia' ? 'assistant' : data.type === 'human' ? 'human' : data.type
      };
    }
    
    // Formato específico do gerente_externo (Pedro Vila Nova) com tool_calls
    if (data.chatId && data.output && Array.isArray(data.output) && data.output.length > 0) {
      const message = data.output[0];
      console.log('🔍 Gerente externo message with tool_calls:', message);
      
      // Verificar se tem tool_calls com function call
      if (message.tool_calls && Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        if (toolCall.function && toolCall.function.arguments) {
          try {
            const args = typeof toolCall.function.arguments === 'string' 
              ? JSON.parse(toolCall.function.arguments) 
              : toolCall.function.arguments;
            
            if (args.message) {
              return {
                content: args.message.toString().trim(),
                timestamp: data.chatId || new Date().toISOString(),
                type: 'assistant' // Pedro Vila Nova é sempre assistant
              };
            }
          } catch (parseError) {
            console.log('⚠️ Error parsing tool_calls arguments:', parseError);
          }
        }
      }
      
      // Fallback para content ou text normal no gerente_externo
      if (message.content !== undefined || message.text !== undefined) {
        const content = (message.content || message.text).toString().trim();
        if (content.length > 0) {
          return {
            content,
            timestamp: data.chatId || new Date().toISOString(),
            type: message.type || 'assistant'
          };
        }
      }
    }
    
    // Formato padrão da maioria dos canais (legado)
    if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      const firstOutput = data.output[0];
      
      // Verificar se tem content
      if (firstOutput.content !== undefined) {
        const content = firstOutput.content.toString().trim();
        if (content.length > 0) {
          return {
            content,
            timestamp: data.chatId || data.timestamp || new Date().toISOString(),
            type: firstOutput.type || 'human'
          };
        }
      }
    }
    
    // Formato direto com content
    if (data.content !== undefined) {
      const content = data.content.toString().trim();
      if (content.length > 0) {
        return {
          content,
          timestamp: data.timestamp || data.chatId || new Date().toISOString(),
          type: data.type || 'human'
        };
      }
    }
    
    // Formato direto com text
    if (data.text !== undefined) {
      const content = data.text.toString().trim();
      if (content.length > 0) {
        return {
          content,
          timestamp: data.timestamp || data.chatId || new Date().toISOString(),
          type: data.type || 'human'
        };
      }
    }
    
    // Formato legacy do n8n
    if (data.message) {
      const content = data.message.toString().trim();
      if (content.length > 0) {
        return {
          content,
          timestamp: data.timestamp || new Date().toISOString(),
          type: 'human'
        };
      }
    }
    
    console.log('⚠️ Unable to parse message data or empty content:', data);
    return null;
    
  } catch (error) {
    console.error('❌ Error parsing message JSON:', error, messageJson);
    return null;
  }
};
