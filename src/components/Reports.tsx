
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportsProps {
  isDarkMode: boolean;
}

export const Reports: React.FC<ReportsProps> = ({ isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, descreva o tipo de relatório que deseja gerar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const data = await response.json();
      setGeneratedReport(data.report);
      
      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearReport = () => {
    setGeneratedReport('');
    setPrompt('');
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-[#09090b]" : "bg-gray-50"
    )}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Relatórios
          </h1>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Gere relatórios personalizados utilizando inteligência artificial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gerador de Relatórios */}
          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                <FileText size={20} />
                Gerador de Relatórios
              </CardTitle>
              <CardDescription className={cn(
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Descreva o tipo de relatório que deseja gerar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Descrição do Relatório
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Gere um relatório de conversas dos últimos 30 dias, incluindo estatísticas de atendimento e principais canais utilizados..."
                  className={cn(
                    "min-h-[120px]",
                    isDarkMode 
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" 
                      : "bg-white border-gray-300"
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={generateReport}
                  disabled={loading || !prompt.trim()}
                  className="flex-1 bg-[#b5103c] hover:bg-[#a00f36] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Relatório'
                  )}
                </Button>
                
                {generatedReport && (
                  <Button
                    variant="outline"
                    onClick={clearReport}
                    className={cn(
                      isDarkMode ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : ""
                    )}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Relatório Gerado */}
          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center justify-between",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                <span>Relatório Gerado</span>
                {generatedReport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadReport}
                    className={cn(
                      "h-8",
                      isDarkMode ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : ""
                    )}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedReport ? (
                <div className={cn(
                  "p-4 rounded-lg border min-h-[300px] whitespace-pre-wrap text-sm",
                  isDarkMode 
                    ? "bg-zinc-800 border-zinc-700 text-gray-200" 
                    : "bg-gray-50 border-gray-200 text-gray-800"
                )}>
                  {generatedReport}
                </div>
              ) : (
                <div className={cn(
                  "flex items-center justify-center h-[300px] border-2 border-dashed rounded-lg",
                  isDarkMode ? "border-zinc-700" : "border-gray-300"
                )}>
                  <div className="text-center">
                    <FileText size={48} className={cn(
                      "mx-auto mb-4",
                      isDarkMode ? "text-zinc-600" : "text-gray-400"
                    )} />
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    )}>
                      O relatório gerado aparecerá aqui
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exemplos de Relatórios */}
        <Card className={cn(
          "mt-6",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Exemplos de Relatórios
            </CardTitle>
            <CardDescription className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Clique em um dos exemplos para usar como ponto de partida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Relatório de atendimentos por canal nos últimos 30 dias",
                "Análise de satisfação do cliente baseada em conversas",
                "Relatório de produtividade da equipe de atendimento",
                "Estatísticas de exames agendados por período",
                "Relatório de tags mais utilizadas em conversas",
                "Análise de tempo de resposta por canal"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-auto p-3 text-left whitespace-normal",
                    isDarkMode 
                      ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" 
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
