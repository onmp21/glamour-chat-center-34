
import { useState, useEffect } from 'react';

export interface Exam {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  appointmentDate: string;
  city: string;
}

const STORAGE_KEY = 'villa_glamour_exams';

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

const loadExamsFromStorage = (): Exam[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar exames do localStorage:', error);
  }
  
  // Se não há dados no storage, gerar dados mock
  const mockData = generateMockExams(345);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  return mockData;
};

const saveExamsToStorage = (exams: Exam[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  } catch (error) {
    console.error('Erro ao salvar exames no localStorage:', error);
  }
};

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>(() => loadExamsFromStorage());

  // Sincronizar com localStorage sempre que exams mudar
  useEffect(() => {
    saveExamsToStorage(exams);
  }, [exams]);

  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newId = (Math.max(...exams.map(e => parseInt(e.id)), 0) + 1).toString();
    const newExam: Exam = {
      ...examData,
      id: newId
    };
    
    setExams(prev => {
      const updated = [...prev, newExam];
      console.log('Novo exame adicionado:', newExam);
      return updated;
    });
    return newExam;
  };

  const deleteExams = (examIds: string[]) => {
    setExams(prev => {
      const updated = prev.filter(exam => !examIds.includes(exam.id));
      console.log('Exames excluídos:', examIds);
      console.log('Total restante:', updated.length);
      return updated;
    });
  };

  const updateExam = (examId: string, examData: Partial<Exam>) => {
    setExams(prev => {
      const updated = prev.map(exam => 
        exam.id === examId ? { ...exam, ...examData } : exam
      );
      console.log('Exame atualizado:', examId, examData);
      return updated;
    });
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

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const thisWeekExams = exams.filter(exam => {
      const examDate = new Date(exam.appointmentDate);
      return examDate >= thisWeekStart;
    }).length;

    const thisMonthExams = exams.filter(exam => {
      const examDate = new Date(exam.appointmentDate);
      return examDate >= thisMonthStart;
    }).length;

    return {
      total: totalExams,
      thisWeek: thisWeekExams,
      thisMonth: thisMonthExams,
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
