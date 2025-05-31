
import { MessageData } from '@/hooks/useMessageSender';

// Define the structure for the Evolution API request body for text
interface EvolutionTextPayload {
  number: string;
  options: {
    delay: number;
    presence: string;
  };
  textMessage: {
    text: string;
  };
}

// Define the structure for the Evolution API request body for media (file/audio)
interface EvolutionMediaPayload {
  number: string;
  options: {
    delay: number;
    presence: string;
  };
  mediaMessage: {
    mediaType: 'document' | 'audio' | 'image' | 'video';
    caption?: string;
    media: string; // Base64 encoded media
    fileName: string;
  };
}

// Extended interface for the service that includes media capabilities
interface ExtendedMessageData extends MessageData {
  messageType?: 'text' | 'file' | 'audio' | 'image' | 'video';
  fileBase64?: string;
  fileName?: string;
}

export class MessageSenderService {
  private evolutionApiUrl = 'https://evolution.estudioonmp.com';
  private evolutionApiKey = 'kcWrhDBNk5IYDasRCRW1BI3hpmjbZ8Um';
  private evolutionInstance = 'pedro';

  private setEvolutionInstance(channelId: string): void {
    const channelDisplayMap: Record<string, string> = {
      'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena',
      '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana',
      'b7996f75-41a7-4725-8229-564f31868027': 'souto-soares',
      '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao-dourado',
      '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america-dourada',
      'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente-lojas',
      'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente-externo',
      '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro',
      'chat': 'yelena',
      'canarana': 'canarana',
      'souto-soares': 'souto-soares',
      'joao-dourado': 'joao-dourado',
      'america-dourada': 'america-dourada',
      'gerente-lojas': 'gerente-lojas',
      'gerente-externo': 'gerente-externo',
      'pedro': 'pedro'
    };
    this.evolutionInstance = channelDisplayMap[channelId] || 'pedro';
  }

  private getEvolutionMediaType(mimeType: string): 'document' | 'audio' | 'image' | 'video' {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }

  private async sendEvolutionApiText(phoneNumber: string, message: string): Promise<any> {
    const apiUrl = `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstance}`;
    const payload: EvolutionTextPayload = {
      number: phoneNumber,
      options: { delay: 1200, presence: 'composing' },
      textMessage: { text: message },
    };
    console.log(`🚀 Sending TEXT to ${phoneNumber} via Evolution API (${this.evolutionInstance}):`, payload.textMessage.text.substring(0, 50) + '...');
    return this.sendEvolutionRequest(apiUrl, payload);
  }

  private async sendEvolutionApiMedia(phoneNumber: string, fileBase64: string, fileName: string, mimeType: string, caption?: string): Promise<any> {
    const apiUrl = `${this.evolutionApiUrl}/message/sendMedia/${this.evolutionInstance}`;
    const mediaType = this.getEvolutionMediaType(mimeType);
    
    // Remove data:mime/type;base64, prefix if present
    const base64Data = fileBase64.startsWith('data:') ? fileBase64.split(',')[1] : fileBase64;

    const payload: EvolutionMediaPayload = {
      number: phoneNumber,
      options: { delay: 1200, presence: 'composing' },
      mediaMessage: {
        mediaType: mediaType,
        media: base64Data,
        fileName: fileName,
        caption: caption,
      },
    };
    console.log(`🚀 Sending MEDIA (${mediaType}) to ${phoneNumber} via Evolution API (${this.evolutionInstance}):`, fileName);
    return this.sendEvolutionRequest(apiUrl, payload);
  }

  private async sendEvolutionRequest(apiUrl: string, payload: any): Promise<any> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.evolutionApiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: response.statusText };
        }
        console.error('❌ Evolution API Error Response:', errorData);
        throw new Error(`Evolution API Error: ${response.status} ${errorData?.message || response.statusText}`);
      }

      const responseData = await response.json();
      console.log('✅ Evolution API response:', responseData);
      return responseData;

    } catch (error) {
      console.error('❌ Error sending request to Evolution API:', error);
      throw new Error(`Failed to send message via Evolution API: ${error.message}`);
    }
  }

  async sendMessage(messageData: ExtendedMessageData): Promise<boolean> {
    try {
      this.setEvolutionInstance(messageData.channelId);

      if (messageData.messageType === 'file' || messageData.messageType === 'audio' || messageData.messageType === 'image' || messageData.messageType === 'video') {
        if (!messageData.fileBase64 || !messageData.fileName) {
          throw new Error('Missing file data for media message');
        }
        
        // Determine MIME type from file extension if not provided
        const mimeType = this.getMimeTypeFromFileName(messageData.fileName);
        
        await this.sendEvolutionApiMedia(
          messageData.conversationId,
          messageData.fileBase64,
          messageData.fileName,
          mimeType,
          messageData.content
        );
      } else {
        await this.sendEvolutionApiText(
          messageData.conversationId,
          messageData.content
        );
      }

      console.log(`✅ Message (${messageData.messageType || 'text'}) successfully sent to ${messageData.conversationId} via Evolution API.`);
      return true;
    } catch (error) {
      console.error('❌ Error in sendMessage process:', error);
      return false;
    }
  }

  private getMimeTypeFromFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'mp3': return 'audio/mpeg';
      case 'ogg': return 'audio/ogg';
      case 'webm': return 'audio/webm';
      case 'wav': return 'audio/wav';
      case 'mp4': return 'video/mp4';
      default: return 'application/octet-stream';
    }
  }
}
