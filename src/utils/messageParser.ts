// Função para extrair dados da mensagem JSON
export const parseMessageData = (message: any) => {
  if (!message) return null;
  
  if (typeof message === 'string') {
    try {
      message = JSON.parse(message);
    } catch {
      return null;
    }
  }
  
  return {
    content: message.content || message.text || message.message || '',
    timestamp: message.timestamp || message.created_at || new Date().toISOString(),
    type: message.type || 'unknown'
  };
};

