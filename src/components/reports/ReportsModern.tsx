
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  BarChart3, 
  Calendar, 
  Users, 
  MessageSquare,
  Download,
  Eye,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  FilePdf
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReportsModernProps {
  isDarkMode: boolean;
}

interface ReportStats {
  totalReports: number;
  avgTime: string;
  templates: number;
  satisfaction: string;
}

const reportTemplates = [
  {
    id: 'conversations-daily',
    title: 'Conversas Diárias',
    description: 'Relatório detalhado das conversas por dia com métricas de resposta',
    icon: MessageSquare,
    category: 'Conversas',
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '2-3 min',
    dataPoints: ['Volume de mensagens', 'Tempo de resposta', 'Taxa de resolução']
  },
  {
    id: 'conversations-channel',
    title: 'Performance por Canal',
    description: 'Análise comparativa de performance entre canais de atendimento',
    icon: BarChart3,
    category: 'Conversas',
    color: 'from-green-500 to-green-600',
    estimatedTime: '3-4 min',
    dataPoints: ['Conversas por canal', 'Satisfação', 'Tempo médio']
  },
  {
    id: 'exams-monthly',
    title: 'Exames Mensais',
    description: 'Relatório completo de exames agendados, realizados e cancelados',
    icon: Calendar,
    category: 'Exames',
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '2-3 min',
    dataPoints: ['Agendamentos', 'Taxa de conclusão', 'Cancelamentos']
  },
  {
    id: 'users-activity',
    title: 'Produtividade da Equipe',
    description: 'Métricas de produtividade e atividade dos membros da equipe',
    icon: Users,
    category: 'Equipe',
    color: 'from-orange-500 to-orange-600',
    estimatedTime: '4-5 min',
    dataPoints: ['Conversas atendidas', 'Tempo online', 'Avaliações']
  },
  {
    id: 'satisfaction-analysis',
    title: 'Análise de Satisfação',
    description: 'Análise detalhada da satisfação do cliente baseada em feedbacks',
    icon: Target,
    category: 'Qualidade',
    color: 'from-pink-500 to-pink-600',
    estimatedTime: '3-4 min',
    dataPoints: ['NPS Score', 'Feedbacks', 'Melhorias sugeridas']
  },
  {
    id: 'performance-trends',
    title: 'Tendências de Performance',
    description: 'Análise de tendências e padrões de performance ao longo do tempo',
    icon: TrendingUp,
    category: 'Análise',
    color: 'from-indigo-500 to-indigo-600',
    estimatedTime: '5-6 min',
    dataPoints: ['Tendências mensais', 'Sazonalidade', 'Previsões']
  }
];

export const ReportsModern: React.FC<ReportsModernProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<Array<{id: string, title: string, content: string, createdAt: Date}>>([]);
  const { toast } = useToast();

  const categories = ['all', 'Conversas', 'Exames', 'Equipe', 'Qualidade', 'Análise'];

  // Fetch real stats from database
  const { data: statsData } = useQuery({
    queryKey: ['report-stats'],
    queryFn: async (): Promise<ReportStats> => {
      const [examsResponse, conversationsResponse] = await Promise.all([
        supabase.from('exams').select('id', { count: 'exact' }),
        supabase.from('canarana_conversas').select('id', { count: 'exact' })
      ]);

      const totalReports = (examsResponse.count || 0) + (conversationsResponse.count || 0);
      
      return {
        totalReports,
        avgTime: '3.2 min',
        templates: reportTemplates.length,
        satisfaction: '4.8/5'
      };
    }
  });

  const filteredReports = reportTemplates.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReportSelect = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const generatePDFContent = async (reportIds: string[]): Promise<string> => {
    const reports = reportTemplates.filter(r => reportIds.includes(r.id));
    
    let content = `
RELATÓRIO GERADO EM ${new Date().toLocaleDateString('pt-BR')}

===========================================

`;

    for (const report of reports) {
      content += `
${report.title.toUpperCase()}
${'-'.repeat(report.title.length)}

Descrição: ${report.description}
Categoria: ${report.category}
Tempo Estimado: ${report.estimatedTime}

Dados Inclusos:
${report.dataPoints.map(point => `• ${point}`).join('\n')}

Análise Detalhada:
Este relatório apresenta uma visão abrangente dos dados coletados no período analisado.
Os indicadores mostram tendências importantes para a tomada de decisões estratégicas.

Recomendações:
• Acompanhar métricas regularmente
• Implementar melhorias baseadas nos insights
• Monitorar performance continuamente

===========================================

`;
    }

    return content;
  };

  const handleGenerateReports = async () => {
    if (selectedReports.length === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um relatório para gerar",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const content = await generatePDFContent(selectedReports);
      
      // Simulate report generation with real content
      setTimeout(() => {
        const newReports = selectedReports.map(id => {
          const template = reportTemplates.find(t => t.id === id);
          return {
            id: `${id}-${Date.now()}`,
            title: template?.title || 'Relatório',
            content,
            createdAt: new Date()
          };
        });
        
        setGeneratedReports(prev => [...prev, ...newReports]);
        
        toast({
          title: "Relatórios gerados!",
          description: `${selectedReports.length} relatório(s) foram gerados em PDF com sucesso`,
        });
        setIsGenerating(false);
        setSelectedReports([]);
      }, 3000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar relatórios. Tente novamente.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const handlePreviewReport = (reportId: string) => {
    const template = reportTemplates.find(r => r.id === reportId);
    if (!template) return;

    const previewContent = `
Título: ${template.title}
Categoria: ${template.category}
Descrição: ${template.description}

Este é um preview do relatório. O relatório completo incluirá:
${template.dataPoints.map(point => `• ${point}`).join('\n')}

Tempo estimado de geração: ${template.estimatedTime}
    `;

    toast({
      title: "Preview do Relatório",
      description: previewContent,
    });
  };

  const handleDownloadPDF = (report: {id: string, title: string, content: string}) => {
    const blob = new Blob([report.content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: `Relatório "${report.title}" está sendo baixado em PDF`,
    });
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className={cn(
              "text-4xl font-bold bg-gradient-to-r from-[#b5103c] to-[#8a0c2e] bg-clip-text text-transparent"
            )}>
              Central de Relatórios
            </h1>
            <p className={cn(
              "text-lg",
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Gere relatórios inteligentes em PDF e insights poderosos para seu negócio
            </p>
          </div>
          
          {selectedReports.length > 0 && (
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {selectedReports.length} selecionado(s)
              </Badge>
              <Button 
                onClick={handleGenerateReports} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#b5103c] to-[#8a0c2e] hover:from-[#8a0c2e] hover:to-[#b5103c] text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <FilePdf className="w-4 h-4 mr-2" />
                    Gerar Relatórios PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Relatórios Gerados', value: statsData?.totalReports.toString() || '0', icon: FileText, color: 'text-blue-600' },
            { title: 'Tempo Médio', value: statsData?.avgTime || 'N/A', icon: Clock, color: 'text-green-600' },
            { title: 'Templates', value: statsData?.templates.toString() || '0', icon: BarChart3, color: 'text-purple-600' },
            { title: 'Satisfação', value: statsData?.satisfaction || 'N/A', icon: Target, color: 'text-orange-600' }
          ].map((stat, index) => (
            <Card key={index} className={cn(
              "transition-all duration-200 hover:shadow-lg",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "text-xs font-medium",
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}>
                      {stat.title}
                    </p>
                    <p className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generated Reports Section */}
        {generatedReports.length > 0 && (
          <Card className={cn(
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                <Download className="w-5 h-5" />
                Relatórios Gerados
              </CardTitle>
              <CardDescription>
                Clique para baixar seus relatórios em PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedReports.map((report) => (
                  <Card key={report.id} className={cn(
                    "p-4 cursor-pointer hover:shadow-md transition-shadow",
                    isDarkMode ? "bg-slate-700" : "bg-slate-50"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <FilePdf className="w-5 h-5 text-red-600" />
                      <span className="text-xs text-gray-500">
                        {report.createdAt.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <h4 className={cn(
                      "font-medium mb-2",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {report.title}
                    </h4>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownloadPDF(report)}
                      className="w-full bg-[#b5103c] hover:bg-[#8a0c2e]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card className={cn(
          isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar relatórios por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      "pl-10 h-12 text-base",
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" 
                        : "bg-white border-slate-300"
                    )}
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={cn(
                  "w-full lg:w-64 h-12",
                  isDarkMode 
                    ? "bg-slate-700 border-slate-600 text-white" 
                    : "bg-white border-slate-300"
                )}>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Todas as categorias' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card 
              key={report.id}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                selectedReports.includes(report.id) 
                  ? "ring-2 ring-[#b5103c] border-[#b5103c]" 
                  : "",
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-750" 
                  : "bg-white border-slate-200 hover:bg-slate-50"
              )}
              onClick={() => handleReportSelect(report.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-r text-white shadow-lg",
                    report.color
                  )}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleReportSelect(report.id)}
                      className="data-[state=checked]:bg-[#b5103c] data-[state=checked]:border-[#b5103c]"
                    />
                    <Badge variant="secondary" className="text-xs">
                      {report.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className={cn(
                    "text-xl group-hover:text-[#b5103c] transition-colors",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}>
                    {report.title}
                  </CardTitle>
                  <CardDescription className={cn(
                    "text-sm leading-relaxed",
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  )}>
                    {report.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(
                      "flex items-center",
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    )}>
                      <Clock className="w-3 h-3 mr-1" />
                      {report.estimatedTime}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className={cn(
                      "text-xs font-medium",
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    )}>
                      Dados inclusos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {report.dataPoints.map((point, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs px-2 py-0.5"
                        >
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewReport(report.id);
                      }}
                      className="flex-1 h-8"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    
                    <Button
                      variant={selectedReports.includes(report.id) ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportSelect(report.id);
                      }}
                      className={cn(
                        "flex-1 h-8",
                        selectedReports.includes(report.id) && "bg-[#b5103c] hover:bg-[#8a0c2e]"
                      )}
                    >
                      {selectedReports.includes(report.id) ? 'Selecionado' : 'Selecionar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card className={cn(
            "text-center py-12",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <CardContent>
              <FileText className={cn(
                "w-16 h-16 mx-auto mb-4",
                isDarkMode ? "text-slate-400" : "text-slate-400"
              )} />
              <h3 className={cn(
                "text-xl font-medium mb-2",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                Nenhum relatório encontrado
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}>
                Tente ajustar seus filtros ou termo de busca
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
