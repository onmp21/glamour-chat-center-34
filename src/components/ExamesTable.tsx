
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { ExamModal } from './ExamModal';
import { ExamRecord, ExamFormData } from '@/types/exam';
import { format } from 'date-fns';

interface ExamesTableProps {
  isDarkMode: boolean;
}

export const ExamesTable: React.FC<ExamesTableProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([]);

  const cities = ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'];

  // Mock data for demonstration
  const generateMockData = (city: string): ExamRecord[] => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
    return months.map((mes, index) => ({
      id: `${city}-${index}`,
      pacienteName: `Paciente ${index + 1} - ${city}`,
      celular: `(77) 9999${index}-${String(index).padStart(4, '0')}`,
      cidade: city as any,
      dataAgendamento: `2024-${String(index + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
      tipoExame: 'Ultrassom',
      status: 'agendado' as const,
      dataChat: `${String(index + 1).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/2024`,
      mes,
      createdAt: new Date().toISOString()
    }));
  };

  const handleNewExam = (data: ExamFormData) => {
    const newExam: ExamRecord = {
      id: `exam-${Date.now()}`,
      pacienteName: data.pacienteName,
      celular: data.celular,
      cidade: data.cidade,
      dataAgendamento: format(data.dataAgendamento, 'yyyy-MM-dd'),
      tipoExame: data.tipoExame,
      observacoes: data.observacoes,
      status: 'agendado',
      dataChat: format(new Date(), 'dd/MM/yyyy'),
      mes: format(data.dataAgendamento, 'MMMM'),
      createdAt: new Date().toISOString()
    };

    setExamRecords(prev => [newExam, ...prev]);
  };

  const getAllExamsForCity = (city: string): ExamRecord[] => {
    const mockData = generateMockData(city);
    const cityExams = examRecords.filter(exam => exam.cidade === city);
    return [...cityExams, ...mockData];
  };

  const filterData = (data: ExamRecord[]) => {
    return data.filter(item =>
      item.pacienteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.celular.includes(searchTerm) ||
      item.mes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={cn(
      "p-6 space-y-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Exames
          </h1>
          <p className={cn(
            "mt-1",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Registro de exames por cidade
          </p>
        </div>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Novo Registro
        </Button>
      </div>

      <Card className={cn(
        "border",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Registro de Exames
          </CardTitle>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar por nome, celular ou mês..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className={cn(
                "pl-10",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
                  : "bg-white border-gray-200"
              )}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={cities[0]} className="w-full">
            <TabsList className={cn(
              "grid w-full grid-cols-4",
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            )}>
              {cities.map(city => (
                <TabsTrigger 
                  key={city} 
                  value={city}
                  className={cn(
                    "data-[state=active]:bg-primary data-[state=active]:text-white",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {city}
                </TabsTrigger>
              ))}
            </TabsList>

            {cities.map(city => (
              <TabsContent key={city} value={city} className="mt-6">
                <div className={cn(
                  "rounded-md border",
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                )}>
                  <Table>
                    <TableHeader>
                      <TableRow className={cn(
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      )}>
                        <TableHead className={cn(
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        )}>
                          Nome
                        </TableHead>
                        <TableHead className={cn(
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        )}>
                          Celular
                        </TableHead>
                        <TableHead className={cn(
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        )}>
                          Data de Registro
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterData(getAllExamsForCity(city)).map(item => (
                        <TableRow 
                          key={item.id}
                          className={cn(
                            "border-b",
                            isDarkMode 
                              ? "border-gray-700 hover:bg-gray-800" 
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <TableCell className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}>
                            {item.pacienteName}
                          </TableCell>
                          <TableCell className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {item.celular}
                          </TableCell>
                          <TableCell className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {format(new Date(item.dataAgendamento), 'dd/MM/yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <ExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewExam}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
