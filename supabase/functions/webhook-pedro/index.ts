import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const requestTimestamp = new Date().toISOString();
  console.log(`[${requestTimestamp}] 📨 [WEBHOOK_PEDRO] Received ${req.method} request from ${req.headers.get('user-agent') || 'unknown'}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestTimestamp}] 📋 [WEBHOOK_PEDRO] Handling CORS preflight request`);
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Apenas aceitar POST requests
    if (req.method !== 'POST') {
      console.log(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] Method ${req.method} not allowed - only POST accepted`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed', message: 'Only POST method is supported' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`[${requestTimestamp}] 🔑 [WEBHOOK_PEDRO] Initializing Supabase client...`);
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] Supabase client initialized.`);

    console.log(`[${requestTimestamp}] 📦 [WEBHOOK_PEDRO] Reading request payload...`);
    const payload = await req.json()
    console.log(`[${requestTimestamp}] 📨 [WEBHOOK_PEDRO] Payload received:`, JSON.stringify(payload, null, 2))

    // Extrair dados do payload
    const { 
      data,
      type,
      instance,
      event
    } = payload

    console.log(`[${requestTimestamp}] 🔍 [WEBHOOK_PEDRO] Processing event - Type: ${type}, Event: ${event}, Instance: ${instance}`);

    // Verificar se é uma mensagem de entrada válida (message.messages.upsert)
    if (type !== 'message' || event !== 'messages.upsert') {
      console.log(`[${requestTimestamp}] ⚠️ [WEBHOOK_PEDRO] Event type not supported or ignored - Type: ${type}, Event: ${event}. Expected 'message' and 'messages.upsert'.`);
      return new Response(
        JSON.stringify({ 
          status: 'ignored',
          reason: 'event_type_not_supported',
          message: `Event type ${type}.${event} not supported`,
          supported_events: ['message.messages.upsert']
        }), 
        { 
          status: 200, // Respond with 200 OK even if ignored, as requested by some webhook providers
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] Event type 'message.messages.upsert' confirmed.`);

    // Verificar se 'data' existe e é um array
    if (!Array.isArray(data)) {
        console.log(`[${requestTimestamp}] ⚠️ [WEBHOOK_PEDRO] Payload 'data' field is missing or not an array. Payload:`, JSON.stringify(payload));
        return new Response(
            JSON.stringify({ status: 'ignored', reason: 'invalid_data_format', message: "'data' field is missing or not an array" }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[${requestTimestamp}] 💬 [WEBHOOK_PEDRO] Processing ${data.length} message(s) in the 'data' array...`);

    // Processar cada mensagem no payload
    let processedCount = 0;
    let skippedCount = 0;
    const processingResults = [];

    for (const message of data) {
      const messageId = message?.key?.id || 'unknown_id';
      console.log(`[${requestTimestamp}] 📝 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Processing individual message:`, JSON.stringify(message));

      const {
        key,
        message: msgContent,
        pushName,
        messageTimestamp
      } = message

      // Validar estrutura básica da mensagem
      if (!key || !key.remoteJid || typeof key.fromMe === 'undefined' || !msgContent) {
          console.log(`[${requestTimestamp}] ⏭️ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Skipping message due to missing essential fields (key, remoteJid, fromMe, message).`);
          skippedCount++;
          processingResults.push({ id: messageId, status: 'skipped', reason: 'missing_essential_fields' });
          continue; // Pular para a próxima mensagem
      }

      // Extrair número do telefone do remoteJid
      const phoneNumber = key.remoteJid.replace('@s.whatsapp.net', '');
      console.log(`[${requestTimestamp}] 📞 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Extracted phone number: ${phoneNumber}`);
      
      // Verificar se é mensagem de entrada (não enviada por nós) e se tem conteúdo de conversa
      const isIncoming = !key.fromMe;
      const hasConversationContent = typeof msgContent.conversation === 'string' && msgContent.conversation.trim().length > 0;

      console.log(`[${requestTimestamp}] 🤔 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Checking conditions - isIncoming: ${isIncoming}, hasConversationContent: ${hasConversationContent}`);

      if (isIncoming && hasConversationContent) {
        console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Conditions met. Preparing to insert message from ${phoneNumber}: "${msgContent.conversation}"`);

        const insertData = {
          session_id: phoneNumber,
          message: msgContent.conversation,
          nome_do_contato: pushName || `Cliente ${phoneNumber.slice(-4)}`,
          is_read: false,
          // Convert Unix timestamp (seconds) to ISO string (UTC)
          read_at: messageTimestamp ? new Date(messageTimestamp * 1000).toISOString() : new Date().toISOString()
        };
        console.log(`[${requestTimestamp}] 💾 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Data to be inserted into 'pedro_conversas':`, JSON.stringify(insertData));

        try {
          // Inserir mensagem na tabela pedro_conversas
          const { data: insertResult, error } = await supabaseClient
            .from('pedro_conversas')
            .insert(insertData)
            .select()

          if (error) {
            console.error(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Error inserting message into Supabase:`, JSON.stringify(error));
            processingResults.push({ id: messageId, status: 'error', reason: 'supabase_insert_error', details: error });
            // Não incrementar skippedCount aqui, pois foi uma tentativa de processamento que falhou
          } else {
            console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Message inserted successfully into Supabase:`, JSON.stringify(insertResult));
            processedCount++;
            processingResults.push({ id: messageId, status: 'processed', result: insertResult });
          }
        } catch (insertError) {
          console.error(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Exception during Supabase insert operation:`, insertError);
          processingResults.push({ id: messageId, status: 'error', reason: 'supabase_insert_exception', details: insertError.message });
        }
      } else {
        const skipReason = !isIncoming ? 'sent_by_us (fromMe=true)' : 'no_conversation_content';
        console.log(`[${requestTimestamp}] ⏭️ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Skipping message - Reason: ${skipReason}`);
        skippedCount++;
        processingResults.push({ id: messageId, status: 'skipped', reason: skipReason });
      }
    }

    console.log(`[${requestTimestamp}] 📊 [WEBHOOK_PEDRO] Processing complete - Processed: ${processedCount}, Skipped: ${skippedCount}, Total in batch: ${data.length}`);
    console.log(`[${requestTimestamp}] 📋 [WEBHOOK_PEDRO] Detailed results:`, JSON.stringify(processingResults));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed batch.',
        processed: processedCount,
        skipped: skippedCount,
        total: data.length,
        results: processingResults // Include detailed results in response
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error(`[${requestTimestamp}] 💥 [WEBHOOK_PEDRO] Fatal error processing request:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: requestTimestamp
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
