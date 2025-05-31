
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const payload = await req.json()
    console.log('📥 [WEBHOOK_PEDRO] Received payload:', JSON.stringify(payload, null, 2))

    // Validate required fields
    if (!payload.data || !payload.data.key) {
      console.error('❌ [WEBHOOK_PEDRO] Missing required fields in payload')
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const messageData = payload.data
    const phoneNumber = messageData.key?.remoteJid?.replace('@s.whatsapp.net', '') || ''
    const messageContent = messageData.message?.conversation || 
                          messageData.message?.extendedTextMessage?.text || 
                          messageData.message?.imageMessage?.caption ||
                          messageData.message?.documentMessage?.caption ||
                          'Mensagem de mídia'

    // Extract contact name if available
    const contactName = messageData.pushName || 
                       messageData.key?.participant?.split('@')[0] ||
                       phoneNumber

    if (!phoneNumber || !messageContent) {
      console.error('❌ [WEBHOOK_PEDRO] Invalid message data')
      return new Response(
        JSON.stringify({ error: 'Invalid message data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create session_id in format: PHONE-NAME
    const sessionId = `${phoneNumber}-${contactName}`

    console.log(`💾 [WEBHOOK_PEDRO] Processing message - Phone: ${phoneNumber}, Contact: ${contactName}`)

    // Insert message into pedro_conversas table
    const { data: insertData, error: insertError } = await supabase
      .from('pedro_conversas')
      .insert({
        session_id: sessionId,
        message: messageContent,
        Nome_do_contato: contactName,
        created_at: new Date().toISOString()
      })
      .select()

    if (insertError) {
      console.error('❌ [WEBHOOK_PEDRO] Database error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Database error', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ [WEBHOOK_PEDRO] Message saved successfully:', insertData)

    // Auto-update conversation status to 'unread' if not already set
    try {
      const { error: statusError } = await supabase
        .from('conversation_status')
        .upsert({
          channel_id: '1e233898-5235-40d7-bf9c-55d46e4c16a1', // Pedro channel ID
          conversation_id: phoneNumber,
          status: 'unread',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'channel_id,conversation_id',
          ignoreDuplicates: true
        })

      if (statusError) {
        console.error('❌ [WEBHOOK_PEDRO] Status update error:', statusError)
      } else {
        console.log('✅ [WEBHOOK_PEDRO] Status updated to unread')
      }
    } catch (statusError) {
      console.error('❌ [WEBHOOK_PEDRO] Status update failed:', statusError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message processed successfully',
        sessionId,
        contactName,
        phoneNumber
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ [WEBHOOK_PEDRO] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
