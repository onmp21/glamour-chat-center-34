
import { ChannelService } from './ChannelService';
import { MessageData } from '@/hooks/useMessageSender';

export interface WebhookData {
  numerodocliente: string;
  canal: string;
  nomedocliente: string;
  conteudo: string;
}

export class MessageSenderService {
  private webhookUrl = 'https://n8n.estudioonmp.com/webhook/3a0b2487-21d0-43c7-bc7f-07404879df5434232';

  private getChannelDisplayName(channelId: string): string {
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
    
    return channelDisplayMap[channelId] || 'yelena';
  }

  async sendWebhook(webhookData: WebhookData): Promise<void> {
    try {
      console.log('🔥 Sending webhook:', webhookData);

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(webhookData),
      });

      console.log('✅ Webhook sent successfully');
    } catch (error) {
      console.error('❌ Error sending webhook:', error);
      throw error;
    }
  }

  async sendMessage(messageData: MessageData): Promise<boolean> {
    try {
      const channelService = new ChannelService(messageData.channelId);
      
      // Usar o novo formato de inserção com string simples
      await channelService.insertMessage(
        `agent_${messageData.conversationId}_${Date.now()}`,
        messageData.content, // Agora é string simples
        messageData.agentName || 'Atendente'
      );

      // Send webhook after successful message save
      const webhookData: WebhookData = {
        numerodocliente: messageData.conversationId,
        canal: this.getChannelDisplayName(messageData.channelId),
        nomedocliente: 'Cliente', // Could be enhanced to fetch actual name
        conteudo: messageData.content
      };

      await this.sendWebhook(webhookData);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
