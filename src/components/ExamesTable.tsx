
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ExamesTableProps {
  isDarkMode: boolean;
}

interface ExameData {
  id: string;
  nome: string;
  celular: string;
  dataChat: string;
  mes: string;
}

export const ExamesTable: React.FC<ExamesTableProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const cities = ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'];

  // Mock data for demonstration
  const generateMockData = (city: string): ExameData[] => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
    return months.map((mes, index) => ({
      id: `${city}-${index}`,
      nome: `Paciente ${index + 1} - ${city}`,
      celular: `(77) 9999${index}-${String(index).padStart(4, '0')}`,
      dataChat: `${String(index + 1).padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/2024`,
      mes
    }));
  };

  const filterData = (data: ExameData[]) => {
    return data.filter(item =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.celular.includes(searchTerm) ||
      item.mes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={cn(
      "p-6 space-y-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
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
          Controle de exames por cidade
        </p>
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
                    "data-[state=active]:bg-villa-primary data-[state=active]:text-white",
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
                          Mês
                        </TableHead>
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
                          Data do Chat
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterData(generateMockData(city)).map(item => (
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
                            {item.mes}
                          </TableCell>
                          <TableCell className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {item.nome}
                          </TableCell>
                          <TableCell className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {item.celular}
                          </TableCell>
                          <TableCell className={cn(
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            {item.dataChat}
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
    </div>
  );
};
