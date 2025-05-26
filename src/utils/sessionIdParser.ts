
// Função para extrair telefone do session_id
export const extractPhoneFromSessionId = (sessionId: string) => {
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  return phoneMatch ? phoneMatch[1] : sessionId.split(/[-_]/)[0];
};

// Função para extrair nome do session_id
export const extractNameFromSessionId = (sessionId: string) => {
  const nameMatch = sessionId.replace(/\d+/g, '').replace(/[-_]/g, ' ').trim();
  return nameMatch || 'Cliente';
};
