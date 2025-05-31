import { MessageData } from '@/hooks/useMessageSender';

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
  // Store Evolution API credentials
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
      'chat': 'yelena', 
      'canarana': 'canarana',
      'souto-soares': 'souto-soares',
      'joao-dourado': 'joao-dourado',
      'america-dourada': 'america-dourada',
      'gerente-lojas': 'gerente-lojas',
      'gerente-externo': 'gerente-externo',
      'pedro': 'pedro'
    };
    // Map channelId to the correct Evolution instance name
    this.evolutionInstance = channelDisplayMap[channelId] || 'pedro'; 
    return this.evolutionInstance;
  }

  // Method to send message via Evolution API using fetch
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

    console.log(`🚀 Sending message to ${phoneNumber} via Evolution API (using fetch):`, payload);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.evolutionApiKey, // Add the API key header
        },
        body: JSON.stringify(payload),
      });

      // Check if the request was successful
      if (!response.ok) {
        // Try to parse error response from the API
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If parsing fails, use the status text
          errorData = { message: response.statusText };
        }
        console.error('❌ Evolution API Error Response:', errorData);
        throw new Error(`Failed to send message via Evolution API: ${response.status} ${errorData?.message || response.statusText}`);
      }

      // Parse the successful response
      const responseData = await response.json();
      console.log('✅ Evolution API response (fetch):', responseData);
      return responseData;

    } catch (error) {
      // Catch network errors or errors thrown from response handling
      console.error('❌ Error sending message via Evolution API (fetch):', error);
      // Rethrow a more specific error or handle it
      throw new Error(`Failed to send message via Evolution API: ${error.message}`);
    }
  }

  // Updated sendMessage method using fetch
  async sendMessage(messageData: MessageData): Promise<boolean> {
    try {
      // Determine the Evolution instance based on channelId
      this.getChannelDisplayName(messageData.channelId);

      // Send the message using the Evolution API (fetch version)
      await this.sendEvolutionApiMessage(
        messageData.conversationId, // Use conversationId as the phone number
        messageData.content
      );

      /*
      const channelService = new ChannelService(messageData.channelId);
      await channelService.insertMessage(
        messageData.conversationId,
        messageData.content,
        new Date(),
        messageData.sender === 'agent' ? 'ai' : 'human'
      );
      */
      
      // const channelService = new ChannelService(messageData.channelId);
      // await channelService.sendWebhook(messageData.conversationId, messageData.content);

      console.log(`✅ Message successfully sent to ${messageData.conversationId} via Evolution API (fetch).`);
      return true;
    } catch (error) {
      console.error('❌ Error in sendMessage process (fetch):', error);
      return false; 
    }
  }
}
