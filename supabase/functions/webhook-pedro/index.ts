
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log(`📨 [WEBHOOK] Received ${req.method} request from ${req.headers.get('user-agent') || 'unknown'}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('📋 [WEBHOOK] Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Apenas aceitar POST requests
    if (req.method !== 'POST') {
      console.log(`❌ [WEBHOOK] Method ${req.method} not allowed - only POST accepted`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed', message: 'Only POST method is supported' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔑 [WEBHOOK] Initializing Supabase client...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('📦 [WEBHOOK] Reading request payload...');
    const payload = await req.json()
    console.log('📨 [WEBHOOK] Payload received:', JSON.stringify(payload, null, 2))

    // Verificar se é uma mensagem da Evolution API
    const { 
      data,
      type,
      instance,
      event
    } = payload

    console.log(`🔍 [WEBHOOK] Processing event - Type: ${type}, Event: ${event}, Instance: ${instance}`);

    // Verificar se é uma mensagem de entrada
    if (type !== 'message' || event !== 'messages.upsert') {
      console.log(`⚠️ [WEBHOOK] Event type not supported - Type: ${type}, Event: ${event}`);
      return new Response(
        JSON.stringify({ 
          status: 'ignored', 
          message: `Event type ${type}.${event} not supported`,
          supported_events: ['message.messages.upsert']
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`💬 [WEBHOOK] Processing ${data?.length || 0} messages...`);

    // Processar cada mensagem no payload
    let processedCount = 0;
    let skippedCount = 0;

    for (const message of data || []) {
      const {
        key,
        message: msgContent,
        pushName,
        messageTimestamp
      } = message

      console.log(`📝 [WEBHOOK] Processing message from key:`, key);

      // Extrair número do telefone do remoteJid
      const phoneNumber = key?.remoteJid?.replace('@s.whatsapp.net', '') || 'unknown'
      
      // Verificar se é mensagem de entrada (não enviada por nós)
      if (!key?.fromMe && msgContent?.conversation) {
        console.log(`📞 [WEBHOOK] Incoming message from ${phoneNumber}: "${msgContent.conversation}"`);

        try {
          // Inserir mensagem na tabela pedro_conversas
          const { data: insertResult, error } = await supabaseClient
            .from('pedro_conversas')
            .insert({
              session_id: phoneNumber,
              message: msgContent.conversation,
              nome_do_contato: pushName || `Cliente ${phoneNumber.slice(-4)}`,
              is_read: false,
              read_at: new Date(messageTimestamp * 1000).toISOString()
            })
            .select()

          if (error) {
            console.error('❌ [WEBHOOK] Error inserting message:', error);
            throw error
          }

          console.log('✅ [WEBHOOK] Message inserted successfully:', insertResult);
          processedCount++;
        } catch (insertError) {
          console.error(`❌ [WEBHOOK] Failed to insert message from ${phoneNumber}:`, insertError);
          throw insertError;
        }
      } else {
        const skipReason = key?.fromMe ? 'sent by us (fromMe=true)' : 'no conversation content';
        console.log(`⏭️ [WEBHOOK] Skipping message - ${skipReason}`);
        skippedCount++;
      }
    }

    console.log(`📊 [WEBHOOK] Processing complete - Processed: ${processedCount}, Skipped: ${skippedCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Messages processed successfully',
        processed: processedCount,
        skipped: skippedCount,
        total: data?.length || 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ [WEBHOOK] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
