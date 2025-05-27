
import { MessageFormatDetector, MessageFormat } from './messageFormats';
import { FormatParsers } from './formatParsers';

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
    // Detectar formato automaticamente
    const detection = MessageFormatDetector.detect(messageJson);
    console.log(`🔍 Formato detectado: ${detection.format} (confiança: ${detection.confidence})`);

    let result: MessageData | null = null;

    // Aplicar parser específico baseado no formato detectado
    switch (detection.format) {
      case MessageFormat.LANGCHAIN_OBJECT:
        result = FormatParsers.parseLangChainObject(detection.rawData);
        break;
        
      case MessageFormat.LANGCHAIN_STRING:
        result = FormatParsers.parseLangChainString(detection.rawData);
        break;
        
      case MessageFormat.LEGACY_N8N:
        result = FormatParsers.parseLegacyN8N(detection.rawData);
        break;
        
      case MessageFormat.SIMPLE_JSON:
        result = FormatParsers.parseSimpleJson(detection.rawData);
        break;
        
      case MessageFormat.UNKNOWN:
        console.log('❓ Formato desconhecido, tentando fallbacks...');
        result = this.tryFallbackParsing(detection.rawData);
        break;
    }

    if (result) {
      console.log(`✅ Mensagem processada com sucesso: "${result.content.substring(0, 50)}..." (${result.type})`);
      return result;
    }

    console.log('⚠️ Nenhum parser conseguiu processar a mensagem');
    return null;
    
  } catch (error) {
    console.error('❌ Erro crítico no parsing:', error, messageJson);
    return null;
  }
};

function tryFallbackParsing(data: any): MessageData | null {
  console.log('🔄 Tentando fallbacks para dados:', data);

  // Fallback 1: Tentar extrair qualquer campo que pareça conteúdo
  const possibleContentFields = ['content', 'text', 'message', 'msg'];
  
  for (const field of possibleContentFields) {
    if (data && data[field] !== undefined) {
      const content = data[field].toString().trim();
      if (content.length > 0) {
        console.log(`✅ Fallback: encontrado conteúdo em '${field}'`);
        return {
          content,
          timestamp: data.timestamp || new Date().toISOString(),
          type: data.type || 'human'
        };
      }
    }
  }

  // Fallback 2: Se data é string, usar como conteúdo direto
  if (typeof data === 'string' && data.trim().length > 0) {
    console.log('✅ Fallback: usando string diretamente como conteúdo');
    return {
      content: data.trim(),
      timestamp: new Date().toISOString(),
      type: 'human'
    };
  }

  console.log('❌ Todos os fallbacks falharam');
  return null;
}
