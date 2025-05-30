
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Apenas aceitar POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('📨 Webhook payload received:', JSON.stringify(payload, null, 2))

    // Extrair dados da mensagem da Evolution API
    const { 
      data,
      type,
      instance,
      event
    } = payload

    // Verificar se é uma mensagem de entrada
    if (type !== 'message' || event !== 'messages.upsert') {
      console.log('⚠️ Event type not supported:', type, event)
      return new Response('Event not supported', { 
        status: 200, 
        headers: corsHeaders 
      })
    }

    // Processar cada mensagem no payload
    for (const message of data) {
      const {
        key,
        message: msgContent,
        pushName,
        messageTimestamp
      } = message

      // Extrair número do telefone do remoteJid
      const phoneNumber = key.remoteJid?.replace('@s.whatsapp.net', '') || 'unknown'
      
      // Verificar se é mensagem de entrada (não enviada por nós)
      if (!key.fromMe && msgContent?.conversation) {
        console.log(`📝 Processing message from ${phoneNumber}: ${msgContent.conversation}`)

        // Inserir mensagem na tabela pedro_conversas
        const { error } = await supabaseClient
          .from('pedro_conversas')
          .insert({
            session_id: phoneNumber,
            message: msgContent.conversation,
            nome_do_contato: pushName || `Cliente ${phoneNumber.slice(-4)}`,
            is_read: false,
            read_at: new Date(messageTimestamp * 1000).toISOString()
          })

        if (error) {
          console.error('❌ Error inserting message:', error)
          throw error
        }

        console.log('✅ Message inserted successfully')
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Messages processed successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
