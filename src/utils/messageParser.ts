
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
  
  // Extrair conteúdo da mensagem
  let content = '';
  if (message.content) {
    content = message.content;
  } else if (message.text) {
    content = message.text;
  } else if (message.message) {
    content = message.message;
  }
  
  // Extrair timestamp - usar created_at se disponível, senão usar timestamp atual
  let timestamp = new Date().toISOString();
  if (message.timestamp) {
    timestamp = message.timestamp;
  } else if (message.created_at) {
    timestamp = message.created_at;
  }
  
  // Determinar tipo da mensagem
  let type = 'unknown';
  if (message.type) {
    type = message.type;
  }
  
  return {
    content,
    timestamp,
    type
  };
};
