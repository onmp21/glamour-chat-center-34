
import { useState } from 'react';

export interface Exam {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  appointmentDate: string;
  city: string;
}

const generateMockExams = (count: number): Exam[] => {
  const cities = ['Canarana', 'Souto Soares', 'João Dourado', 'América Dourada'];
  const names = ['Ana Silva', 'João Santos', 'Maria Costa', 'Pedro Lima', 'Carla Souza'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    name: names[i % names.length] + ` ${i + 1}`,
    phone: `(77) 9999${String(i).padStart(4, '0')}`,
    instagram: `@user${i + 1}`,
    appointmentDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    city: cities[i % cities.length]
  }));
};

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>(() => generateMockExams(345));

  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newId = (exams.length + 1).toString();
    const newExam: Exam = {
      ...examData,
      id: newId
    };
    
    setExams(prev => [...prev, newExam]);
    console.log('Novo exame adicionado:', newExam);
    return newExam;
  };

  const deleteExams = (examIds: string[]) => {
    setExams(prev => prev.filter(exam => !examIds.includes(exam.id)));
    console.log('Exames excluídos:', examIds);
  };

  const updateExam = (examId: string, examData: Partial<Exam>) => {
    setExams(prev => prev.map(exam => 
      exam.id === examId ? { ...exam, ...examData } : exam
    ));
    console.log('Exame atualizado:', examId, examData);
  };

  const getExamsByCity = (city: string) => {
    return exams.filter(exam => exam.city === city);
  };

  const getTotalExams = () => exams.length;

  const getExamStats = () => {
    const totalExams = exams.length;
    const examsByCity = exams.reduce((acc, exam) => {
      acc[exam.city] = (acc[exam.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisWeekExams = exams.filter(exam => {
      const examDate = new Date(exam.appointmentDate);
      return examDate >= thisWeekStart;
    }).length;

    return {
      total: totalExams,
      thisWeek: thisWeekExams,
      byCity: examsByCity
    };
  };

  return {
    exams,
    addExam,
    deleteExams,
    updateExam,
    getExamsByCity,
    getTotalExams,
    getExamStats
  };
};
