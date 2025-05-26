import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, FileText, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamesTableProps {
  isDarkMode: boolean;
}

// Mock exam data - in a real app this would come from your exam database
const mockExamData = [{
  id: '1',
  date: '2024-01-15',
  city: 'Canarana',
  type: 'Ultrassom'
}, {
  id: '2',
  date: '2024-01-18',
  city: 'Souto Soares',
  type: 'Mamografia'
}, {
  id: '3',
  date: '2024-01-22',
  city: 'João Dourado',
  type: 'Ultrassom'
}, {
  id: '4',
  date: '2024-02-03',
  city: 'América Dourada',
  type: 'Mamografia'
}, {
  id: '5',
  date: '2024-02-08',
  city: 'Canarana',
  type: 'Ultrassom'
},
// Add more mock data to simulate a realistic dataset
...Array.from({
  length: 340
}, (_, i) => ({
  id: `${i + 6}`,
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  city: ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'][Math.floor(Math.random() * 4)],
  type: ['Ultrassom', 'Mamografia', 'Raio-X'][Math.floor(Math.random() * 3)]
}))];

interface Exam {
  id: string;
  date: string;
  city: string;
  type: string;
}

export const ExamesTable: React.FC<ExamesTableProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'];

  const filteredExams = mockExamData.filter(exam => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const cityFilter = selectedCity === 'all' || exam.city === selectedCity;
    return searchRegex.test(exam.type) && cityFilter;
  });

  return (
    <div className="h-screen flex flex-col" style={{
      backgroundColor: isDarkMode ? "#111112" : "#f9fafb"
    }}>
      {/* Header Mobile/Desktop */}
      <div className="p-4 border-b" style={{ borderColor: isDarkMode ? "#2a2a2a" : "#e5e7eb" }}>
        <h1 className={cn("text-xl md:text-2xl font-bold mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
          Controle de Exames
        </h1>
        
        {/* Mobile: Filtros compactos */}
        <div className="md:hidden space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar exames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full",
                  isDarkMode ? "bg-[#232323] border-[#2a2a2a] text-white" : "bg-white border-gray-200"
                )}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter size={16} />
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button 
              variant={selectedCity === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCity('all')}
              className="whitespace-nowrap"
            >
              Todas
            </Button>
            {cities.map(city => (
              <Button
                key={city}
                variant={selectedCity === city ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCity(city)}
                className="whitespace-nowrap"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {/* Desktop: Filtros em linha */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar exames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-10",
                isDarkMode ? "bg-[#232323] border-[#2a2a2a] text-white" : "bg-white border-gray-200"
              )}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedCity === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCity('all')}
            >
              Todas as Cidades
            </Button>
            {cities.map(city => (
              <Button
                key={city}
                variant={selectedCity === city ? 'default' : 'outline'}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Mobile: Cards layout */}
        <div className="md:hidden space-y-3">
          {filteredExams.map((exam) => (
            <Card 
              key={exam.id} 
              className={cn(
                "border transition-all duration-200 hover:shadow-md",
                isDarkMode ? "bg-[#232323] border-[#2a2a2a]" : "bg-white border-gray-200"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#b5103c]" />
                    <span className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                      {exam.type}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    #{exam.id}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className={cn(isDarkMode ? "text-gray-300" : "text-gray-600")}>
                      {exam.city}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span className={cn(isDarkMode ? "text-gray-300" : "text-gray-600")}>
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden md:block">
          <Card className={cn(
            "border",
            isDarkMode ? "bg-[#232323] border-[#2a2a2a]" : "bg-white border-gray-200"
          )}>
            <CardHeader className="py-4 px-6">
              <CardTitle className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                Lista de Exames
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? "bg-[#333333] text-white" : "bg-gray-50 text-gray-700"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Cidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Tipo de Exame
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredExams.map((exam) => (
                      <tr key={exam.id} className={isDarkMode ? "bg-[#232323] hover:bg-[#333333]" : "bg-white hover:bg-gray-100"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                            #{exam.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                            {new Date(exam.date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                            {exam.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                            {exam.type}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
