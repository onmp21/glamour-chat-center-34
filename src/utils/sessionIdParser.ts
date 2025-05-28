
// Função para extrair telefone do session_id no novo formato
export const extractPhoneFromSessionId = (sessionId: string) => {
  // Para session_id como "556292631631-andressa", extrair "556292631631"
  const parts = sessionId.split('-');
  if (parts.length > 1) {
    return parts[0];
  }
  
  // Fallback: procurar por sequência de números
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  return phoneMatch ? phoneMatch[1] : sessionId;
};

// Função para extrair nome do session_id no novo formato
export const extractNameFromSessionId = (sessionId: string) => {
  // Para session_id como "556292631631-andressa", extrair "andressa"
  const parts = sessionId.split('-');
  if (parts.length > 1) {
    return parts.slice(1).join('-').trim();
  }
  
  // Fallback: usar o session_id completo se não seguir o padrão
  return sessionId || 'Cliente';
};
