
import { MessageFormatDetector, MessageFormat } from './messageFormats';
import { FormatParsers } from './formatParsers';

export interface MessageData {
  content: string;
  timestamp: string;
  type: 'human' | 'ai';
}

export const parseMessageData = (messageJson: any): MessageData | null => {
  if (!messageJson) {
    console.log('⚠️ [PARSER] messageJson is null or undefined');
    return null;
  }

  console.log('🔍 [PARSER] Input messageJson:', JSON.stringify(messageJson));

  try {
    // Detectar formato automaticamente
    const detection = MessageFormatDetector.detect(messageJson);
    console.log(`🔍 [PARSER] Formato detectado: ${detection.format} (confiança: ${detection.confidence})`);

    let result: MessageData | null = null;

    // Aplicar parser específico baseado no formato detectado
    switch (detection.format) {
      case MessageFormat.LANGCHAIN_OBJECT:
        console.log('🔍 [PARSER] Using LANGCHAIN_OBJECT parser');
        result = FormatParsers.parseLangChainObject(detection.rawData);
        break;
        
      case MessageFormat.LANGCHAIN_STRING:
        console.log('🔍 [PARSER] Using LANGCHAIN_STRING parser');
        result = FormatParsers.parseLangChainString(detection.rawData);
        break;
        
      case MessageFormat.LEGACY_N8N:
        console.log('🔍 [PARSER] Using LEGACY_N8N parser');
        result = FormatParsers.parseLegacyN8N(detection.rawData);
        break;
        
      case MessageFormat.SIMPLE_JSON:
        console.log('🔍 [PARSER] Using SIMPLE_JSON parser');
        result = FormatParsers.parseSimpleJson(detection.rawData);
        break;
        
      case MessageFormat.UNKNOWN:
        console.log('❓ [PARSER] Formato desconhecido, tentando fallbacks...');
        result = tryFallbackParsing(detection.rawData);
        break;
    }

    if (result) {
      console.log(`✅ [PARSER] Mensagem processada com sucesso: "${result.content}" (${result.type})`);
      return result;
    }

    console.log('⚠️ [PARSER] Nenhum parser conseguiu processar a mensagem');
    console.log('⚠️ [PARSER] Final raw data was:', detection.rawData);
    return null;
    
  } catch (error) {
    console.error('❌ [PARSER] Erro crítico no parsing:', error, messageJson);
    return null;
  }
};

function tryFallbackParsing(data: any): MessageData | null {
  console.log('🔄 [PARSER] Tentando fallbacks para dados:', data);

  // Fallback 1: Tentar extrair qualquer campo que pareça conteúdo
  const possibleContentFields = ['content', 'text', 'message', 'msg'];
  
  for (const field of possibleContentFields) {
    if (data && data[field] !== undefined) {
      const content = data[field].toString().trim();
      if (content.length > 0) {
        console.log(`✅ [PARSER] Fallback: encontrado conteúdo em '${field}': "${content}"`);
        let type: 'human' | 'ai' = 'human';
        if (data.type === 'assistant' || data.type === 'ai') {
          type = 'ai';
        } else if (data.type === 'human') {
          type = 'human';
        }
        return {
          content,
          timestamp: data.timestamp || new Date().toISOString(),
          type
        };
      }
    }
  }

  // Fallback 2: Se data é string, usar como conteúdo direto
  if (typeof data === 'string' && data.trim().length > 0) {
    console.log('✅ [PARSER] Fallback: usando string diretamente como conteúdo:', data.trim());
    return {
      content: data.trim(),
      timestamp: new Date().toISOString(),
      type: 'human'
    };
  }

  console.log('❌ [PARSER] Todos os fallbacks falharam para:', data);
  return null;
}
