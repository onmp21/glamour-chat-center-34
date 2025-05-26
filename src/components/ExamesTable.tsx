
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExamModal } from './ExamModal';
import { cn } from '@/lib/utils';
import { Search, Plus, Calendar, FileText, User, Phone } from 'lucide-react';
import { isThisWeek, parseISO } from 'date-fns';
import { ExamFormData } from '@/types/exam';
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

  // Dados mockados atualizados com as novas colunas
  const examData = [
    {
      id: 1,
      patientName: 'Maria Silva',
      celular: '(77) 99999-1234',
      instagram: '@maria_silva',
      date: '2024-01-15',
      city: 'Canarana'
    },
    {
      id: 2,
      patientName: 'José Oliveira',
      celular: '(77) 99999-5678',
      instagram: '@jose_oliveira',
      date: '2024-01-16',
      city: 'Souto Soares'
    },
    {
      id: 3,
      patientName: 'Ana Ferreira',
      celular: '(77) 99999-9012',
      instagram: '',
      date: '2024-01-17',
      city: 'João Dourado'
    },
    {
      id: 4,
      patientName: 'Pedro Santos',
      celular: '(77) 99999-3456',
      instagram: '@pedro_santos',
      date: '2024-01-18',
      city: 'América Dourada'
    }
  ];

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
      const matchesSearch = exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.celular.includes(searchTerm) ||
                           exam.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesWeekFilter = !showCurrentWeekOnly || isCurrentWeek(exam.date);
      const matchesCityFilter = selectedCity === 'all' || exam.city === selectedCity;
      const hasPermission = user?.role === 'admin' || allowedCities.includes(exam.city);
      
      return matchesSearch && matchesWeekFilter && matchesCityFilter && hasPermission;
    });
  }, [searchTerm, showCurrentWeekOnly, selectedCity, examData, user, allowedCities]);

  const handleExamSubmit = (data: ExamFormData) => {
    console.log('Novo exame criado:', data);
  };

  return (
    <div className={cn(
      "h-screen p-6"
    )} style={{
      backgroundColor: isDarkMode ? '#000000' : '#f9fafb'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-stone-100" : "text-gray-900"
          )}>
            Gestão de Exames
          </h1>
          <p className={cn(
            "mt-2",
            isDarkMode ? "text-stone-300" : "text-gray-600"
          )}>
            Gerencie todos os exames médicos organizados por cidade
          </p>
        </div>

        <Card className={cn(
          "border"
        )} style={{
          backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
          borderColor: isDarkMode ? '#686868' : '#e5e7eb'
        }}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className={cn(
                "flex items-center",
                isDarkMode ? "text-stone-100" : "text-gray-900"
              )}>
                <FileText className="mr-2" size={24} />
                Lista de Exames
              </CardTitle>
              
              <div className="flex space-x-2">
                <Button
                  variant={showCurrentWeekOnly ? "default" : "outline"}
                  onClick={() => setShowCurrentWeekOnly(!showCurrentWeekOnly)}
                  style={{
                    backgroundColor: showCurrentWeekOnly ? '#b5103c' : 'transparent',
                    borderColor: isDarkMode ? '#686868' : '#d1d5db',
                    color: showCurrentWeekOnly ? 'white' : (isDarkMode ? '#d6d3d1' : '#374151')
                  }}
                  className="hover:opacity-90"
                >
                  <Calendar size={16} className="mr-2" />
                  Semana Atual
                </Button>
                
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  style={{ backgroundColor: '#b5103c', color: 'white' }}
                  className="hover:opacity-90"
                >
                  <Plus size={16} className="mr-2" />
                  Novo Exame
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por paciente, celular, instagram ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-10"
                  )}
                  style={{
                    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                    borderColor: isDarkMode ? '#686868' : '#d1d5db',
                    color: isDarkMode ? '#d6d3d1' : '#111827'
                  }}
                />
              </div>
              
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger style={{
                  backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                  borderColor: isDarkMode ? '#686868' : '#d1d5db',
                  color: isDarkMode ? '#d6d3d1' : '#111827'
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
              <table className="w-full">
                <thead>
                  <tr className={cn(
                    "border-b"
                  )} style={{
                    borderColor: isDarkMode ? '#686868' : '#e5e7eb'
                  }}>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-stone-200" : "text-gray-700"
                    )}>
                      Paciente
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-stone-200" : "text-gray-700"
                    )}>
                      Celular
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-stone-200" : "text-gray-700"
                    )}>
                      Instagram
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-stone-200" : "text-gray-700"
                    )}>
                      Data do Exame
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      isDarkMode ? "text-stone-200" : "text-gray-700"
                    )}>
                      Cidade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(exam => (
                    <tr 
                      key={exam.id}
                      className={cn(
                        "border-b transition-colors"
                      )}
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
                        isDarkMode ? "text-stone-100" : "text-gray-900"
                      )}>
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-gray-400" />
                          {exam.patientName}
                        </div>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-stone-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-gray-400" />
                          {exam.celular}
                        </div>
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-stone-200" : "text-gray-700"
                      )}>
                        {exam.instagram || '-'}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-stone-200" : "text-gray-700"
                      )}>
                        {new Date(exam.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className={cn(
                        "py-3 px-4",
                        isDarkMode ? "text-stone-200" : "text-gray-700"
                      )}>
                        {exam.city}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📄</div>
                  <p className={cn(
                    isDarkMode ? "text-stone-400" : "text-gray-500"
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
