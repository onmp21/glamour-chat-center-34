
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ExamLineChartsProps {
  isDarkMode: boolean;
  examData: Array<{
    id: string;
    date: string;
    city: string;
    type: string;
  }>;
}

export const ExamLineCharts: React.FC<ExamLineChartsProps> = ({ isDarkMode, examData }) => {
  const [selectedCity, setSelectedCity] = useState<string>('todas');
  
  const cities = [
    { value: 'todas', label: 'Todas as Cidades' },
    { value: 'Canarana', label: 'Canarana' },
    { value: 'Souto Soares', label: 'Souto Soares' },
    { value: 'João Dourado', label: 'João Dourado' },
    { value: 'América Dourada', label: 'América Dourada' }
  ];

  const filteredData = useMemo(() => {
    return selectedCity === 'todas' 
      ? examData 
      : examData.filter(exam => exam.city === selectedCity);
  }, [examData, selectedCity]);

  // Process data for monthly chart
  const monthlyData = useMemo(() => {
    const monthCounts: { [key: string]: number } = {};
    
    filteredData.forEach(exam => {
      const date = new Date(exam.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    return Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
        exams: count
      }));
  }, [filteredData]);

  // Process data for weekly chart
  const weeklyData = useMemo(() => {
    const weekCounts: { [key: string]: number } = {};
    
    filteredData.forEach(exam => {
      const date = new Date(exam.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
    });

    return Object.entries(weekCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 weeks
      .map(([week, count], index) => ({
        week: `Sem ${index + 1}`,
        exams: count
      }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div className="flex items-center space-x-4">
        <label className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}>
          Filtrar por Cidade:
        </label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48" style={{
            backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
            borderColor: isDarkMode ? '#686868' : '#d1d5db',
            color: isDarkMode ? '#ffffff' : '#111827'
          }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Monthly Line Chart */}
      <div className={cn(
        "p-4 rounded-lg border"
      )} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Exames por Mês {selectedCity !== 'todas' && `- ${selectedCity}`}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#686868' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="month" 
                stroke={isDarkMode ? '#a1a1aa' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={isDarkMode ? '#a1a1aa' : '#6b7280'}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#686868' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Line 
                type="monotone"
                dataKey="exams" 
                stroke="#b5103c" 
                strokeWidth={2}
                dot={{ fill: '#b5103c', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#b5103c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Line Chart */}
      <div className={cn(
        "p-4 rounded-lg border"
      )} style={{
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderColor: isDarkMode ? '#686868' : '#e5e7eb'
      }}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Exames por Semana {selectedCity !== 'todas' && `- ${selectedCity}`}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#686868' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="week" 
                stroke={isDarkMode ? '#a1a1aa' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={isDarkMode ? '#a1a1aa' : '#6b7280'}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#686868' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Line 
                type="monotone"
                dataKey="exams" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
