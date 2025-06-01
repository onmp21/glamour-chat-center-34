
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = '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';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em gerar relatórios detalhados e profissionais para sistemas de atendimento ao cliente. 
            
            Suas características:
            - Gera relatórios bem estruturados com seções claras
            - Inclui insights baseados em dados quando possível
            - Usa linguagem profissional mas acessível
            - Fornece recomendações práticas
            - Formata o texto de forma organizada com títulos e subtítulos
            
            Sempre structure seus relatórios da seguinte forma:
            1. Título do Relatório
            2. Período Analisado
            3. Resumo Executivo
            4. Análise Detalhada (com seções relevantes)
            5. Insights e Tendências
            6. Recomendações
            7. Conclusão`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const report = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ report }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao gerar relatório' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
