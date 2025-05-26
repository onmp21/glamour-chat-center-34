
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Exam {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  appointmentDate: string;
  city: string;
}

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar exames do Supabase
  const loadExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar exames:', error);
        return;
      }

      // Converter formato do Supabase para o formato esperado pela aplicação
      const formattedExams: Exam[] = (data || []).map(exam => ({
        id: exam.id,
        name: exam.patient_name,
        phone: exam.phone,
        instagram: exam.instagram || '',
        appointmentDate: exam.appointment_date,
        city: exam.city
      }));

      setExams(formattedExams);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar exames na inicialização
  useEffect(() => {
    loadExams();
  }, []);

  const addExam = async (examData: Omit<Exam, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([
          {
            patient_name: examData.name,
            phone: examData.phone,
            instagram: examData.instagram || null,
            city: examData.city,
            appointment_date: examData.appointmentDate,
            exam_type: 'Exame de Vista',
            status: 'agendado'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar exame:', error);
        throw error;
      }

      const newExam: Exam = {
        id: data.id,
        name: data.patient_name,
        phone: data.phone,
        instagram: data.instagram || '',
        appointmentDate: data.appointment_date,
        city: data.city
      };

      setExams(prev => [newExam, ...prev]);
      console.log('Novo exame adicionado:', newExam);
      return newExam;
    } catch (error) {
      console.error('Erro ao adicionar exame:', error);
      throw error;
    }
  };

  const deleteExams = async (examIds: string[]) => {
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .in('id', examIds);

      if (error) {
        console.error('Erro ao excluir exames:', error);
        throw error;
      }

      setExams(prev => prev.filter(exam => !examIds.includes(exam.id)));
      console.log('Exames excluídos:', examIds);
    } catch (error) {
      console.error('Erro ao excluir exames:', error);
      throw error;
    }
  };

  const updateExam = async (examId: string, examData: Partial<Exam>) => {
    try {
      const updateData: any = {};
      
      if (examData.name) updateData.patient_name = examData.name;
      if (examData.phone) updateData.phone = examData.phone;
      if (examData.instagram !== undefined) updateData.instagram = examData.instagram || null;
      if (examData.city) updateData.city = examData.city;
      if (examData.appointmentDate) updateData.appointment_date = examData.appointmentDate;

      const { error } = await supabase
        .from('exams')
        .update(updateData)
        .eq('id', examId);

      if (error) {
        console.error('Erro ao atualizar exame:', error);
        throw error;
      }

      setExams(prev => prev.map(exam => 
        exam.id === examId ? { ...exam, ...examData } : exam
      ));
      console.log('Exame atualizado:', examId, examData);
    } catch (error) {
      console.error('Erro ao atualizar exame:', error);
      throw error;
    }
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
    loading,
    addExam,
    deleteExams,
    updateExam,
    getExamsByCity,
    getTotalExams,
    getExamStats,
    refreshExams: loadExams
  };
};
