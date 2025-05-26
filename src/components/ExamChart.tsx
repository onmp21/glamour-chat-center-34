
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ExamChartProps {
  isDarkMode: boolean;
}

export const ExamChart: React.FC<ExamChartProps> = ({ isDarkMode }) => {
  const data = [
    { month: 'Jan', exams: 45 },
    { month: 'Fev', exams: 52 },
    { month: 'Mar', exams: 48 },
    { month: 'Abr', exams: 61 },
    { month: 'Mai', exams: 55 },
    { month: 'Jun', exams: 67 },
  ];

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <h3 className={cn(
        "text-lg font-semibold mb-4",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        Exames por Mês
      </h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
            />
            <Bar 
              dataKey="exams" 
              fill="#b5103c" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
