import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to process a single message object
async function processMessage(message: any, supabaseClient: any, requestTimestamp: string) {
  const messageId = message?.key?.id || 'unknown_id';
  console.log(`[${requestTimestamp}] 📝 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Processing individual message:`, JSON.stringify(message));

  const {
    key,
    message: msgContent,
    pushName,
    messageTimestamp
  } = message

  // Validate basic structure for insertion
  if (!key || !key.remoteJid || typeof key.fromMe === 'undefined' || !msgContent) {
      console.log(`[${requestTimestamp}] ⏭️ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Skipping message due to missing essential fields (key, remoteJid, fromMe, message).`);
      return { id: messageId, status: 'skipped', reason: 'missing_essential_fields' };
  }

  const phoneNumber = key.remoteJid.replace('@s.whatsapp.net', '');
  console.log(`[${requestTimestamp}] 📞 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Extracted phone number: ${phoneNumber}`);
  
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
      read_at: messageTimestamp ? new Date(messageTimestamp * 1000).toISOString() : new Date().toISOString()
    };
    console.log(`[${requestTimestamp}] 💾 [WEBHOOK_PEDRO] [MsgID: ${messageId}] Data to be inserted into 'pedro_conversas':`, JSON.stringify(insertData));

    try {
      const { data: insertResult, error } = await supabaseClient
        .from('pedro_conversas')
        .insert(insertData)
        .select()

      if (error) {
        console.error(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Error inserting message into Supabase:`, JSON.stringify(error));
        return { id: messageId, status: 'error', reason: 'supabase_insert_error', details: error };
      } else {
        console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Message inserted successfully into Supabase:`, JSON.stringify(insertResult));
        return { id: messageId, status: 'processed', result: insertResult };
      }
    } catch (insertError) {
      console.error(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Exception during Supabase insert operation:`, insertError);
      return { id: messageId, status: 'error', reason: 'supabase_insert_exception', details: insertError.message };
    }
  } else {
    const skipReason = !isIncoming ? 'sent_by_us (fromMe=true)' : 'no_conversation_content (or not a text message)';
    console.log(`[${requestTimestamp}] ⏭️ [WEBHOOK_PEDRO] [MsgID: ${messageId}] Skipping message - Reason: ${skipReason}`);
    return { id: messageId, status: 'skipped', reason: skipReason };
  }
}

serve(async (req) => {
  const requestTimestamp = new Date().toISOString();
  console.log(`[${requestTimestamp}] 📨 [WEBHOOK_PEDRO] Received ${req.method} request from ${req.headers.get('user-agent') || 'unknown'}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestTimestamp}] 📋 [WEBHOOK_PEDRO] Handling CORS preflight request`);
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      console.log(`[${requestTimestamp}] ❌ [WEBHOOK_PEDRO] Method ${req.method} not allowed - only POST accepted`);
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    console.log(`[${requestTimestamp}] 🔑 [WEBHOOK_PEDRO] Initializing Supabase client...`);
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] Supabase client initialized.`);

    console.log(`[${requestTimestamp}] 📦 [WEBHOOK_PEDRO] Reading request payload...`);
    const payload = await req.json()
    console.log(`[${requestTimestamp}] 📨 [WEBHOOK_PEDRO] Payload received:`, JSON.stringify(payload, null, 2))

    const { data, type, instance, event } = payload
    console.log(`[${requestTimestamp}] 🔍 [WEBHOOK_PEDRO] Processing event - Type: ${type}, Event: ${event}, Instance: ${instance}`);

    if (event !== 'messages.upsert') {
      console.log(`[${requestTimestamp}] ⚠️ [WEBHOOK_PEDRO] Event type ignored - Event: ${event}. Expected 'messages.upsert'.`);
      return new Response(JSON.stringify({ status: 'ignored', reason: 'event_type_not_supported' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    console.log(`[${requestTimestamp}] ✅ [WEBHOOK_PEDRO] Event type 'messages.upsert' confirmed for processing.`);

    // --- MODIFIED DATA HANDLING --- 
    let messagesToProcess = [];
    if (data && typeof data === 'object') {
      if (Array.isArray(data)) {
        console.log(`[${requestTimestamp}] ℹ️ [WEBHOOK_PEDRO] 'data' field is an array. Processing ${data.length} message(s).`);
        messagesToProcess = data;
      } else {
        console.log(`[${requestTimestamp}] ℹ️ [WEBHOOK_PEDRO] 'data' field is a single object. Processing 1 message.`);
        messagesToProcess = [data]; // Treat the single object as an array with one element
      }
    } else {
      console.log(`[${requestTimestamp}] ⚠️ [WEBHOOK_PEDRO] Payload 'data' field is missing or not a valid object/array for event 'messages.upsert'. Payload:`, JSON.stringify(payload));
      return new Response(JSON.stringify({ status: 'ignored', reason: 'invalid_data_format', message: "'data' field is missing or invalid for messages.upsert" }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    console.log(`[${requestTimestamp}] 💬 [WEBHOOK_PEDRO] Total messages to process: ${messagesToProcess.length}`);

    let processedCount = 0;
    let skippedCount = 0;
    const processingResults = [];

    for (const message of messagesToProcess) {
      const result = await processMessage(message, supabaseClient, requestTimestamp);
      processingResults.push(result);
      if (result.status === 'processed') {
        processedCount++;
      } else if (result.status === 'skipped') {
        skippedCount++;
      }
      // Errors are counted implicitly by not being processed or skipped
    }

    console.log(`[${requestTimestamp}] 📊 [WEBHOOK_PEDRO] Processing complete - Processed: ${processedCount}, Skipped: ${skippedCount}, Errors: ${processingResults.length - processedCount - skippedCount}, Total Attempted: ${messagesToProcess.length}`);
    console.log(`[${requestTimestamp}] 📋 [WEBHOOK_PEDRO] Detailed results:`, JSON.stringify(processingResults));

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed batch.', processed: processedCount, skipped: skippedCount, total: messagesToProcess.length, results: processingResults }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error(`[${requestTimestamp}] 💥 [WEBHOOK_PEDRO] Fatal error processing request:`, error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message, timestamp: requestTimestamp }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
