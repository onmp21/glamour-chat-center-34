import { MessageData } from '@/hooks/useMessageSender';
import axios from 'axios'; // Import axios for making HTTP requests

// Define the structure for the Evolution API request body
interface EvolutionApiPayload {
  number: string;
  options: {
    delay: number;
    presence: string;
  };
  textMessage: {
    text: string;
  };
}

export class MessageSenderService {
  // Store Evolution API credentials (replace placeholders if necessary, but use provided ones)
  private evolutionApiUrl = 'https://evolution.estudioonmp.com'; // Provided Server URL
  private evolutionApiKey = 'kcWrhDBNk5IYDasRCRW1BI3hpmjbZ8Um'; // Provided ApiKey
  // Define a mapping for channelId to Evolution instance name if needed, or use a default/dynamic one
  // Assuming 'pedro' instance for now based on webhook file, adjust if needed
  private evolutionInstance = 'pedro'; 

  // Keep getChannelDisplayName if it's used elsewhere, otherwise it might be redundant for API call
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
      'chat': 'yelena', // Map internal IDs to display names if needed
      'canarana': 'canarana',
      'souto-soares': 'souto-soares',
      'joao-dourado': 'joao-dourado',
      'america-dourada': 'america-dourada',
      'gerente-lojas': 'gerente-lojas',
      'gerente-externo': 'gerente-externo',
      'pedro': 'pedro'
    };
    // You might need to map channelId to the correct Evolution instance name here
    // For now, using the hardcoded 'pedro' instance
    this.evolutionInstance = channelDisplayMap[channelId] || 'pedro'; 
    return this.evolutionInstance;
  }

  // Method to send message via Evolution API
  async sendEvolutionApiMessage(phoneNumber: string, message: string): Promise<any> {
    const apiUrl = `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstance}`;
    const payload: EvolutionApiPayload = {
      number: phoneNumber,
      options: {
        delay: 1200,
        presence: 'composing',
      },
      textMessage: {
        text: message,
      },
    };

    console.log(`🚀 Sending message to ${phoneNumber} via Evolution API:`, payload);

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.evolutionApiKey, // Add the API key header
        },
      });
      console.log('✅ Evolution API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending message via Evolution API:', error.response?.data || error.message);
      // Rethrow or handle the error appropriately
      throw new Error(`Failed to send message via Evolution API: ${error.response?.data?.message || error.message}`);
    }
  }

  // Updated sendMessage method
  async sendMessage(messageData: MessageData): Promise<boolean> {
    try {
      // Determine the Evolution instance based on channelId (optional, using 'pedro' for now)
      this.getChannelDisplayName(messageData.channelId);

      // Send the message using the Evolution API
      await this.sendEvolutionApiMessage(
        messageData.conversationId, // Use conversationId as the phone number
        messageData.content
      );

      // Optionally, still save the message locally if needed (depends on system logic)
      // Commenting out the local save via ChannelService for now, as Evolution handles the sending
      /*
      const channelService = new ChannelService(messageData.channelId);
      await channelService.insertMessage(
        messageData.conversationId, 
        messageData.content, 
        messageData.agentName || 'Atendente'
      );
      */
      
      // Remove the old webhook call
      // const webhookData: WebhookData = { ... };
      // await this.sendWebhook(webhookData);

      console.log(`✅ Message successfully sent to ${messageData.conversationId} via Evolution API.`);
      return true;
    } catch (error) {
      console.error('❌ Error in sendMessage process:', error);
      // Return false or throw error based on desired handling
      return false; 
    }
  }
}

