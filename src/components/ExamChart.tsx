
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ExamChartProps {
  isDarkMode: boolean;
}

export const ExamChart: React.FC<ExamChartProps> = ({ isDarkMode }) => {
  // Mock data baseado nos dados de exames
  const examData = [
    { mes: 'Jan', exames: 24 },
    { mes: 'Fev', exames: 18 },
    { mes: 'Mar', exames: 32 },
    { mes: 'Abr', exames: 28 },
    { mes: 'Mai', exames: 35 },
    { mes: 'Jun', exames: 29 },
  ];

  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center space-x-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <span>Exames por Mês</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={examData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
              />
              <XAxis 
                dataKey="mes" 
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
              <YAxis 
                stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: isDarkMode ? "#ffffff" : "#000000"
                }}
              />
              <Bar 
                dataKey="exames" 
                fill="#b5103c"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
