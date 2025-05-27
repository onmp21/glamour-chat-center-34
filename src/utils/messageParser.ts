
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
      // Processar conteúdo de forma mais permissiva - aceitar até mesmo conteúdo muito curto
      const rawContent = data.content.toString().trim();
      
      // Limpeza mais suave - preservar conteúdo essencial
      let cleanContent = rawContent;
      if (rawContent.includes('\n')) {
        // Se tem quebras de linha, limpar mas preservar estrutura básica
        cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
      }
      
      // Aceitar mensagens com pelo menos 1 caractere (muito mais permissivo)
      if (cleanContent.length === 0) {
        console.log('⚠️ Empty content after cleaning');
        return null;
      }
      
      console.log(`✅ MAIN FORMAT - Content: "${cleanContent.substring(0, 50)}...", Type: ${data.type}`);
      
      return {
        content: cleanContent,
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type === 'ia' ? 'assistant' : data.type === 'human' ? 'human' : data.type
      };
    }
    
    // Formato específico do gerente_externo (Pedro Vila Nova) com tool_calls
    if (data.chatId && data.output && Array.isArray(data.output) && data.output.length > 0) {
      const message = data.output[0];
      console.log('🔍 GERENTE_EXTERNO format detected:', message);
      
      // Verificar se tem tool_calls com function call
      if (message.tool_calls && Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        console.log('🛠️ Processing tool_call:', toolCall);
        
        if (toolCall.function && toolCall.function.arguments) {
          try {
            const args = typeof toolCall.function.arguments === 'string' 
              ? JSON.parse(toolCall.function.arguments) 
              : toolCall.function.arguments;
            
            console.log('🛠️ Tool call arguments:', args);
            
            if (args.message) {
              // Limpeza mais permissiva para tool_calls
              const rawContent = args.message.toString().trim();
              let cleanContent = rawContent;
              
              // Limpeza suave, preservando quebras de linha importantes
              if (rawContent.includes('\n')) {
                cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
              }
              
              // Aceitar qualquer conteúdo não vazio
              if (cleanContent.length === 0) {
                console.log('⚠️ Empty tool_calls message content');
                return null;
              }
              
              console.log(`✅ TOOL_CALLS - Content: "${cleanContent.substring(0, 50)}..."`);
              
              return {
                content: cleanContent,
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
        const rawContent = (message.content || message.text).toString().trim();
        
        // Limpeza mais permissiva
        let cleanContent = rawContent;
        if (rawContent.includes('\n')) {
          cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
        }
        
        // Aceitar qualquer conteúdo não vazio
        if (cleanContent.length > 0) {
          console.log(`✅ GERENTE_EXTERNO fallback - Content: "${cleanContent.substring(0, 50)}..."`);
          
          return {
            content: cleanContent,
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
        const rawContent = firstOutput.content.toString().trim();
        
        // Limpeza mais permissiva
        let cleanContent = rawContent;
        if (rawContent.includes('\n')) {
          cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
        }
        
        if (cleanContent.length > 0) {
          return {
            content: cleanContent,
            timestamp: data.chatId || data.timestamp || new Date().toISOString(),
            type: firstOutput.type || 'human'
          };
        }
      }
    }
    
    // Formato direto com content
    if (data.content !== undefined) {
      const rawContent = data.content.toString().trim();
      
      // Limpeza mais permissiva
      let cleanContent = rawContent;
      if (rawContent.includes('\n')) {
        cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
      }
      
      if (cleanContent.length > 0) {
        return {
          content: cleanContent,
          timestamp: data.timestamp || data.chatId || new Date().toISOString(),
          type: data.type || 'human'
        };
      }
    }
    
    // Formato direto com text
    if (data.text !== undefined) {
      const rawContent = data.text.toString().trim();
      
      // Limpeza mais permissiva
      let cleanContent = rawContent;
      if (rawContent.includes('\n')) {
        cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
      }
      
      if (cleanContent.length > 0) {
        return {
          content: cleanContent,
          timestamp: data.timestamp || data.chatId || new Date().toISOString(),
          type: data.type || 'human'
        };
      }
    }
    
    // Formato legacy do n8n
    if (data.message) {
      const rawContent = data.message.toString().trim();
      
      // Limpeza mais permissiva
      let cleanContent = rawContent;
      if (rawContent.includes('\n')) {
        cleanContent = rawContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
      }
      
      if (cleanContent.length > 0) {
        return {
          content: cleanContent,
          timestamp: data.timestamp || new Date().toISOString(),
          type: 'human'
        };
      }
    }
    
    console.log('⚠️ Unable to parse message data or empty content after cleaning:', data);
    return null;
    
  } catch (error) {
    console.error('❌ Error parsing message JSON:', error, messageJson);
    return null;
  }
};
