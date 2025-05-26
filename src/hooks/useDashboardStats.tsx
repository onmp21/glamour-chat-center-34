
import { useMemo } from 'react';

// Mock exam data - in a real app this would come from your exam database
const mockExamData = [
  {
    id: '1',
    date: '2024-01-15',
    city: 'Canarana',
    type: 'Ultrassom'
  },
  {
    id: '2',
    date: '2024-01-18',
    city: 'Souto Soares',
    type: 'Mamografia'
  },
  {
    id: '3',
    date: '2024-01-22',
    city: 'João Dourado',
    type: 'Ultrassom'
  },
  {
    id: '4',
    date: '2024-02-03',
    city: 'América Dourada',
    type: 'Mamografia'
  },
  {
    id: '5',
    date: '2024-02-08',
    city: 'Canarana',
    type: 'Ultrassom'
  },
  // Add more mock data to simulate a realistic dataset
  ...Array.from({ length: 340 }, (_, i) => ({
    id: `${i + 6}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    city: ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'][Math.floor(Math.random() * 4)],
    type: ['Ultrassom', 'Mamografia', 'Raio-X'][Math.floor(Math.random() * 3)]
  }))
];

export const useDashboardStats = () => {
  // Calculate exam statistics from mock data
  const examStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start of current week (Sunday)
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const totalExams = mockExamData.length;
    const examsThisMonth = mockExamData.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    }).length;
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

  return { examStats };
};
