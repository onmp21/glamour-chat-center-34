
import { useState, useEffect } from 'react';
import { useExams } from './useExams';

export const useDashboardStats = () => {
  const { getExamStats } = useExams();
  const [loading, setLoading] = useState(true);

  const examStats = getExamStats();

  // Calcular estatísticas reais baseadas nos dados dos exames
  const getCurrentMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return startOfMonth;
  };

  const stats = {
    totalExams: examStats.total,
    weeklyExams: examStats.thisWeek,
    monthlyExams: examStats.thisMonth, // Usar dados reais do hook de exames
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
