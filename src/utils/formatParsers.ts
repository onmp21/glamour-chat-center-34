
import { MessageData } from './messageParser';
import { MessageFormat } from './messageFormats';

export class FormatParsers {
  static parseLangChainObject(data: any): MessageData | null {
    console.log('📋 Parsing LANGCHAIN_OBJECT:', data);

    // Verificar tool_calls primeiro (Pedro Vila Nova)
    if (data.tool_calls && Array.isArray(data.tool_calls) && data.tool_calls.length > 0) {
      const toolCall = data.tool_calls[0];
      if (toolCall.function && toolCall.function.arguments) {
        try {
          const args = typeof toolCall.function.arguments === 'string' 
            ? JSON.parse(toolCall.function.arguments) 
            : toolCall.function.arguments;
          
          if (args.message) {
            const content = this.cleanContent(args.message.toString());
            if (content) {
              console.log('✅ LANGCHAIN_OBJECT tool_calls extraído');
              return {
                content,
                timestamp: new Date().toISOString(),
                type: 'assistant'
              };
            }
          }
        } catch (error) {
          console.log('⚠️ Erro parsing tool_calls arguments:', error);
        }
      }
    }

    // Fallback para content direto
    if (data.content !== undefined) {
      const content = this.cleanContent(data.content.toString());
      if (content) {
        console.log('✅ LANGCHAIN_OBJECT content extraído');
        return {
          content,
          timestamp: new Date().toISOString(),
          type: data.type === 'ai' ? 'assistant' : 'human'
        };
      }
    }

    return null;
  }

  static parseLangChainString(data: any): MessageData | null {
    console.log('📄 Parsing LANGCHAIN_STRING:', data);
    
    // Mesmo parsing que LANGCHAIN_OBJECT, pois a estrutura é igual
    return this.parseLangChainObject(data);
  }

  static parseLegacyN8N(data: any): MessageData | null {
    console.log('🔧 Parsing LEGACY_N8N:', data);

    if (data.message !== undefined) {
      const content = this.cleanContent(data.message.toString());
      if (content) {
        console.log('✅ LEGACY_N8N message extraído');
        return {
          content,
          timestamp: new Date().toISOString(),
          type: 'human'
        };
      }
    }

    return null;
  }

  static parseSimpleJson(data: any): MessageData | null {
    console.log('📝 Parsing SIMPLE_JSON:', data);

    if (data.content !== undefined) {
      const rawContent = data.content.toString();
      console.log('🔍 Conteúdo bruto antes da limpeza:', JSON.stringify(rawContent));
      
      const content = this.cleanContent(rawContent);
      console.log('🧹 Conteúdo após limpeza:', JSON.stringify(content));
      
      if (content) {
        console.log('✅ SIMPLE_JSON content extraído');
        return {
          content,
          timestamp: data.timestamp || new Date().toISOString(),
          type: data.type === 'ia' ? 'assistant' : data.type === 'human' ? 'human' : data.type
        };
      } else {
        console.log('❌ SIMPLE_JSON rejeitado após limpeza');
      }
    }

    return null;
  }

  private static cleanContent(rawContent: string): string {
    if (!rawContent) return '';

    let cleaned = rawContent.trim();
    console.log('🔍 [cleanContent] Input:', JSON.stringify(rawContent));
    console.log('🔍 [cleanContent] Após trim:', JSON.stringify(cleaned));
    
    // Normalizar quebras de linha - converter sequências de \n em quebras simples
    cleaned = cleaned.replace(/\n+/g, '\n');
    console.log('🔍 [cleanContent] Após normalizar quebras:', JSON.stringify(cleaned));
    
    // Remover quebras de linha do início e fim
    cleaned = cleaned.replace(/^\n+|\n+$/g, '');
    console.log('🔍 [cleanContent] Após remover quebras nas pontas:', JSON.stringify(cleaned));
    
    // Remover espaços extras mas preservar quebras de linha
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    console.log('🔍 [cleanContent] Após limpar espaços:', JSON.stringify(cleaned));
    
    // Aceitar qualquer conteúdo que tenha pelo menos 1 caractere não-espaço
    const hasContent = cleaned.length > 0 && /\S/.test(cleaned);
    console.log('🔍 [cleanContent] Tem conteúdo válido?', hasContent);
    console.log('🔍 [cleanContent] Output final:', JSON.stringify(cleaned));
    
    return hasContent ? cleaned : '';
  }
}
