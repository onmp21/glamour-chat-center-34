
import { useMemo } from 'react';

// Mock exam data - mesmos dados do ExamesTable
const mockExamData = [
  {
    id: '1',
    date: '2024-01-15',
    city: 'Canarana',
    type: 'Exame de Vista'
  },
  {
    id: '2',
    date: '2024-01-18',
    city: 'Souto Soares',
    type: 'Exame de Vista'
  },
  {
    id: '3',
    date: '2024-01-22',
    city: 'João Dourado',
    type: 'Exame de Vista'
  },
  {
    id: '4',
    date: '2024-02-03',
    city: 'América Dourada',
    type: 'Exame de Vista'
  },
  {
    id: '5',
    date: '2024-02-08',
    city: 'Canarana',
    type: 'Exame de Vista'
  },
  // Add more mock data to simulate a realistic dataset - dados reais da tabela
  ...Array.from({ length: 340 }, (_, i) => ({
    id: `${i + 6}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    city: ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'][Math.floor(Math.random() * 4)],
    type: 'Exame de Vista'
  }))
];

export const useDashboardStats = () => {
  // Calculate exam statistics from real exam data
  const examStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start of current week (Sunday)
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Total exams from all stores
    const totalExams = mockExamData.length;
    
    // Exams this month from all stores
    const examsThisMonth = mockExamData.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    }).length;
    
    // Exams this week from all stores
    const examsThisWeek = mockExamData.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= currentWeekStart;
    }).length;

    return {
      totalExams,
      examsThisMonth,
      examsThisWeek
    };
  }, []);

  // Get exam data by city for additional analytics
  const getExamsByCity = useMemo(() => {
    const examsByCity = mockExamData.reduce((acc, exam) => {
      acc[exam.city] = (acc[exam.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return examsByCity;
  }, []);

  return { examStats, getExamsByCity };
};
