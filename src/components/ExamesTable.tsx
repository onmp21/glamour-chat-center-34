import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExamModal } from './ExamModal';
import { cn } from '@/lib/utils';
import { Search, Plus, Calendar, FileText, User, Phone, Trash2 } from 'lucide-react';
import { isThisWeek, parseISO, format } from 'date-fns';
import { ExamFormData, ExamRecord } from '@/types/exam';
import { useAuth } from '@/contexts/AuthContext';

interface ExamesTableProps {
  isDarkMode: boolean;
}

export const ExamesTable: React.FC<ExamesTableProps> = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCurrentWeekOnly, setShowCurrentWeekOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para armazenar os exames
  const [examData, setExamData] = useState<ExamRecord[]>([
    {
      id: '1',
      pacienteName: 'Maria Silva',
      celular: '(77) 99999-1234',
      instagram: '@maria_silva',
      dataExame: '2024-01-15',
      cidade: 'Canarana',
      status: 'agendado',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      pacienteName: 'José Oliveira',
      celular: '(77) 99999-5678',
      instagram: '@jose_oliveira',
      dataExame: '2024-01-16',
      cidade: 'Souto Soares',
      status: 'agendado',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      pacienteName: 'Ana Ferreira',
      celular: '(77) 99999-9012',
      instagram: '',
      dataExame: '2024-01-17',
      cidade: 'João Dourado',
      status: 'agendado',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      pacienteName: 'Pedro Santos',
      celular: '(77) 99999-3456',
      instagram: '@pedro_santos',
      dataExame: '2024-01-18',
      cidade: 'América Dourada',
      status: 'agendado',
      createdAt: new Date().toISOString()
    }
  ]);

  const isCurrentWeek = (date: string) => {
    try {
      return isThisWeek(parseISO(date), { weekStartsOn: 1 });
    } catch {
      return false;
    }
  };

  // Filtrar dados baseado nas permissões do usuário
  const allowedCities = user?.assignedCities || [];
  const availableCities = user?.role === 'admin' 
    ? ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada']
    : allowedCities;

  const filteredData = useMemo(() => {
    return examData.filter(exam => {
      const matchesSearch = exam.pacienteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.celular.includes(searchTerm) ||
                           (exam.instagram && exam.instagram.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           exam.cidade.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesWeekFilter = !showCurrentWeekOnly || isCurrentWeek(exam.dataExame);
      const matchesCityFilter = selectedCity === 'all' || exam.cidade === selectedCity;
      const hasPermission = user?.role === 'admin' || allowedCities.includes(exam.cidade);
      
      return matchesSearch && matchesWeekFilter && matchesCityFilter && hasPermission;
    });
  }, [searchTerm, showCurrentWeekOnly, selectedCity, examData, user, allowedCities]);

  const handleExamSubmit = (data: ExamFormData) => {
    const newExam: ExamRecord = {
      id: Date.now().toString(),
      pacienteName: data.pacienteName,
      celular: data.celular,
      instagram: data.instagram || '',
      cidade: data.cidade,
      dataExame: format(data.dataAgendamento, 'yyyy-MM-dd'),
      status: 'agendado',
      createdAt: new Date().toISOString()
    };
    
    setExamData(prev => [...prev, newExam]);
    console.log('Novo exame criado:', newExam);
  };

  const handleDeleteExam = (examId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      setExamData(prev => prev.filter(exam => exam.id !== examId));
      console.log('Exame excluído:', examId);
    }
  };

  return (
    <div
      className="min-h-screen p-3 sm:p-6 mobile-padding pb-24 animate-fade-in"
      style={{
        backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
      }}
    >
      <div className="max-w-2xl md:max-w-7xl mx-auto">
        <div className="mb-6">
          <h1
            className={cn(
              "text-2xl md:text-3xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Exames - Gestão Visual
          </h1>
          <p className={cn("mt-2", isDarkMode ? "text-gray-400" : "text-gray-600")}>
            Visualize, filtre e gerencie todos os exames médicos. Veja um resumo prático abaixo:
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="rounded-xl p-4 flex flex-col items-center"
            style={{
              backgroundColor: isDarkMode ? "#232323" : "#f3f3f3"
            }}>
            <span className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              {examData.length}
            </span>
            <span className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>Total de Exames</span>
          </div>
          <div className="rounded-xl p-4 flex flex-col items-center"
            style={{
              backgroundColor: isDarkMode ? "#232323" : "#f3f3f3"
            }}>
            <span className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              {examData.filter(e => isCurrentWeek(e.dataExame)).length}
            </span>
            <span className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>Esta Semana</span>
          </div>
          <div className="rounded-xl p-4 flex flex-col items-center"
            style={{
              backgroundColor: isDarkMode ? "#232323" : "#f3f3f3"
            }}>
            <span className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              {examData.filter(e => e.cidade === selectedCity).length}
            </span>
            <span className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>Cidade Selecionada</span>
          </div>
          <div className="rounded-xl p-4 flex flex-col items-center"
            style={{
              backgroundColor: isDarkMode ? "#232323" : "#f3f3f3"
            }}>
            <span className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              {examData.filter(e => e.cidade === selectedCity && isCurrentWeek(e.dataExame)).length}
            </span>
            <span className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>Esta Semana na Cidade Selecionada</span>
          </div>
        </div>

        {/* Área de busca/filtros e adição */}
        <Card className="border" style={{
          backgroundColor: isDarkMode ? "#232323" : "#ffffff",
          borderColor: isDarkMode ? "#343434" : "#e5e7eb"
        }}>
          <CardHeader>
            <div className="flex justify-between items-center flex-col md:flex-row gap-3">
              <CardTitle className={cn("flex items-center", isDarkMode ? "text-white" : "text-gray-900")}>
                <FileText className="mr-2" size={24} />
                Lista de Exames
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={showCurrentWeekOnly ? "default" : "outline"}
                  onClick={() => setShowCurrentWeekOnly(!showCurrentWeekOnly)}
                  style={{
                    backgroundColor: showCurrentWeekOnly ? "#b5103c" : "transparent",
                    borderColor: isDarkMode ? "#343434" : "#d1d5db",
                    color: showCurrentWeekOnly ? "white" : (isDarkMode ? "#ffffff" : "#374151")
                  }}
                  className="hover:opacity-90"
                >
                  <Calendar size={16} className="mr-2" />
                  Semana Atual
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  style={{ backgroundColor: "#b5103c", color: "white" }}
                  className="hover:opacity-90"
                >
                  <Plus size={16} className="mr-2" />
                  Novo Exame
                </Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#686868' }} />
                <Input
                  placeholder="Buscar por paciente, celular, instagram ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{
                    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                    borderColor: isDarkMode ? '#686868' : '#d1d5db',
                    color: isDarkMode ? '#ffffff' : '#111827'
                  }}
                />
              </div>
              
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger style={{
                  backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                  borderColor: isDarkMode ? '#686868' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}>
                  <SelectValue placeholder="Filtrar por cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {availableCities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b" style={{
                    borderColor: isDarkMode ? '#686868' : '#e5e7eb'
                  }}>
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
                      Celular
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Instagram
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Data do Exame
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Cidade
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(exam => (
                    <tr 
                      key={exam.id}
                      className="border-b transition-colors"
                      style={{
                        borderColor: isDarkMode ? '#686868' : '#f3f4f6'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#000000' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        <div className="flex items-center">
                          <User size={16} className="mr-2" style={{ color: '#686868' }} />
                          {exam.pacienteName}
                        </div>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2" style={{ color: '#686868' }} />
                          {exam.celular}
                        </div>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {exam.instagram || '-'}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {new Date(exam.dataExame).toLocaleDateString('pt-BR')}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      )}>
                        {exam.cidade}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteExam(exam.id)}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div style={{ color: '#b5103c' }} className="text-lg mb-2">📄</div>
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
        onSubmit={handleExamSubmit}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
