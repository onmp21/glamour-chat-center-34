
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  BarChart3, 
  Calendar, 
  Users, 
  MessageSquare,
  Download,
  Eye,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportsNewProps {
  isDarkMode: boolean;
}

const reportTemplates = [
  {
    id: 'conversations-daily',
    title: 'Conversas Diárias',
    description: 'Relatório detalhado das conversas por dia',
    icon: MessageSquare,
    category: 'Conversas',
    color: 'bg-blue-500'
  },
  {
    id: 'conversations-channel',
    title: 'Conversas por Canal',
    description: 'Análise de conversas distribuídas por canal',
    icon: BarChart3,
    category: 'Conversas',
    color: 'bg-green-500'
  },
  {
    id: 'exams-monthly',
    title: 'Exames Mensais',
    description: 'Relatório mensal de exames agendados',
    icon: Calendar,
    category: 'Exames',
    color: 'bg-purple-500'
  },
  {
    id: 'users-activity',
    title: 'Atividade dos Usuários',
    description: 'Relatório de atividade e produtividade',
    icon: Users,
    category: 'Usuários',
    color: 'bg-orange-500'
  },
  {
    id: 'performance',
    title: 'Performance Geral',
    description: 'Indicadores de performance do sistema',
    icon: BarChart3,
    category: 'Performance',
    color: 'bg-red-500'
  },
  {
    id: 'custom',
    title: 'Relatório Personalizado',
    description: 'Crie seu próprio relatório customizado',
    icon: Plus,
    category: 'Personalizado',
    color: 'bg-gray-500'
  }
];

export const ReportsNew: React.FC<ReportsNewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const categories = ['all', 'Conversas', 'Exames', 'Usuários', 'Performance', 'Personalizado'];

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

  const handleGenerateReports = () => {
    if (selectedReports.length === 0) {
      alert('Selecione pelo menos um relatório para gerar');
      return;
    }
    
    // Implementar lógica de geração de relatórios
    console.log('Gerando relatórios:', selectedReports);
  };

  const handlePreviewReport = (reportId: string) => {
    // Implementar lógica de preview
    console.log('Preview do relatório:', reportId);
  };

  return (
    <div className={cn(
      "p-6 space-y-6",
      isDarkMode ? "bg-zinc-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            Relatórios
          </h1>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          )}>
            Gere relatórios detalhados sobre conversas, exames e performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          {selectedReports.length > 0 && (
            <Button onClick={handleGenerateReports} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Gerar Relatórios ({selectedReports.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className={cn(
        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
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

      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card 
            key={report.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg",
              selectedReports.includes(report.id) 
                ? "ring-2 ring-blue-500 border-blue-500" 
                : "",
              isDarkMode 
                ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" 
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
            onClick={() => handleReportSelect(report.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-2 rounded-lg text-white",
                  report.color
                )}>
                  <report.icon className="w-5 h-5" />
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {report.category}
                </Badge>
              </div>
              
              <div>
                <CardTitle className={cn(
                  "text-lg",
                  isDarkMode ? "text-zinc-100" : "text-gray-900"
                )}>
                  {report.title}
                </CardTitle>
                <CardDescription className={cn(
                  "text-sm",
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                )}>
                  {report.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewReport(report.id);
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                
                <Button
                  variant={selectedReports.includes(report.id) ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReportSelect(report.id);
                  }}
                  className="flex-1"
                >
                  {selectedReports.includes(report.id) ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className={cn(
          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardContent className="p-8 text-center">
            <FileText className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDarkMode ? "text-zinc-400" : "text-gray-400"
            )} />
            <h3 className={cn(
              "text-lg font-medium mb-2",
              isDarkMode ? "text-zinc-100" : "text-gray-900"
            )}>
              Nenhum relatório encontrado
            </h3>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            )}>
              Tente ajustar seus filtros ou termo de busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
