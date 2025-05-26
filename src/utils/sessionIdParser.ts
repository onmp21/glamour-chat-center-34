
// Função para extrair telefone do session_id
export const extractPhoneFromSessionId = (sessionId: string) => {
  // Para session_id como "556292631631-Pedro Vila Nova", extrair "556292631631"
  const parts = sessionId.split('-');
  if (parts.length > 1) {
    return parts[0];
  }
  
  // Fallback: procurar por sequência de números
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  return phoneMatch ? phoneMatch[1] : sessionId;
};

// Função para extrair nome do session_id
export const extractNameFromSessionId = (sessionId: string) => {
  // Para session_id como "556292631631-Pedro Vila Nova", extrair "Pedro Vila Nova"
  const parts = sessionId.split('-');
  if (parts.length > 1) {
    return parts.slice(1).join('-').trim();
  }
  
  // Fallback: remover números e caracteres especiais
  const nameMatch = sessionId.replace(/\d+/g, '').replace(/[-_]/g, ' ').trim();
  return nameMatch || 'Cliente';
};
