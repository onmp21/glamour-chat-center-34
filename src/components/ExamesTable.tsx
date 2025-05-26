
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExamModal } from './ExamModal';
import { cn } from '@/lib/utils';
import { Search, Plus, Calendar, FileText, User } from 'lucide-react';
import { isThisWeek, parseISO } from 'date-fns';

interface ExamesTableProps {
  isDarkMode: boolean;
}

export const ExamesTable: React.FC<ExamesTableProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCurrentWeekOnly, setShowCurrentWeekOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dados mockados para demonstração
  const examData = [
    {
      id: 1,
      patientName: 'Maria Silva',
      examType: 'Hemograma Completo',
      date: '2024-01-15',
      status: 'completed',
      result: 'Normal',
      doctorName: 'Dr. João Santos'
    },
    {
      id: 2,
      patientName: 'José Oliveira',
      examType: 'Raio-X Tórax',
      date: '2024-01-16',
      status: 'pending',
      result: '-',
      doctorName: 'Dra. Ana Costa'
    },
    {
      id: 3,
      patientName: 'Ana Ferreira',
      examType: 'Ultrassom Abdominal',
      date: '2024-01-17',
      status: 'in_progress',
      result: '-',
      doctorName: 'Dr. Carlos Lima'
    },
    {
      id: 4,
      patientName: 'Pedro Santos',
      examType: 'Eletrocardiograma',
      date: '2024-01-18',
      status: 'completed',
      result: 'Alteração Leve',
      doctorName: 'Dr. João Santos'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      default:
        return status;
    }
  };

  const isCurrentWeek = (date: string) => {
    try {
      return isThisWeek(parseISO(date), { weekStartsOn: 1 }); // Segunda-feira como início da semana
    } catch {
      return false;
    }
  };

  const filteredData = useMemo(() => {
    return examData.filter(exam => {
      const matchesSearch = exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesWeekFilter = !showCurrentWeekOnly || isCurrentWeek(exam.date);
      
      return matchesSearch && matchesWeekFilter;
    });
  }, [searchTerm, showCurrentWeekOnly, examData]);

  return (
    <div className={cn(
      "h-screen p-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Gestão de Exames
          </h1>
          <p className={cn(
            "mt-2",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Gerencie todos os exames médicos e resultados
          </p>
        </div>

        <Card className={cn(
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className={cn(
                "flex items-center",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                <FileText className="mr-2" size={24} />
                Lista de Exames
              </CardTitle>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus size={16} className="mr-2" />
                Novo Exame
              </Button>
            </div>
            
            <div className="flex space-x-4 mt-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, exame ou médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-10",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-200"
                  )}
                />
              </div>
              <Button
                variant={showCurrentWeekOnly ? "default" : "outline"}
                onClick={() => setShowCurrentWeekOnly(!showCurrentWeekOnly)}
                className={cn(
                  showCurrentWeekOnly 
                    ? "bg-primary text-white" 
                    : isDarkMode 
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300"
                )}
              >
                <Calendar size={16} className="mr-2" />
                Semana Atual
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn(
                    "border-b",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  )}>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Paciente
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Tipo de Exame
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Data
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Status
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Resultado
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Médico
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(exam => (
                    <tr 
                      key={exam.id}
                      className={cn(
                        "border-b transition-colors hover:bg-gray-50",
                        isDarkMode 
                          ? "border-gray-700 hover:bg-gray-700" 
                          : "border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-gray-400" />
                          {exam.patientName}
                        </div>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {exam.examType}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {new Date(exam.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(exam.status)}>
                          {getStatusLabel(exam.status)}
                        </Badge>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {exam.result}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {exam.doctorName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📄</div>
                  <p className={cn(
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {showCurrentWeekOnly 
                      ? "Nenhum exame encontrado para a semana atual"
                      : "Nenhum exame encontrado"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ExamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
