
import { useState, useEffect } from 'react';
import { useExams } from './useExams';

export const useDashboardStats = () => {
  const { getExamStats } = useExams();
  const [loading, setLoading] = useState(true);

  const examStats = getExamStats();

  const stats = {
    totalExams: examStats.total,
    weeklyExams: examStats.thisWeek,
    monthlyExams: Math.floor(examStats.total * 0.3), // Aproximação para exames mensais
    examsByCity: examStats.byCity,
    // Dados de conversas (mock)
    totalConversations: 87,
    activeConversations: 23,
    resolvedConversations: 64,
    conversationsByChannel: {
      'Canarana': 15,
      'Souto Soares': 12,
      'João Dourado': 18,
      'América Dourada': 10,
      'Gerente das Lojas': 8,
      'Gerente do Externo': 5,
      'Geral': 19
    }
  };

  useEffect(() => {
    // Simula carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    stats,
    loading
  };
};
