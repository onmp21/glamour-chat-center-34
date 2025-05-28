
// Função para extrair telefone do session_id no novo formato
export const extractPhoneFromSessionId = (sessionId: string) => {
  console.log(`🔍 [SESSION_PARSER] Extracting phone from session_id: "${sessionId}"`);
  
  // Para canal gerente-externo: "556292631631-andressa" -> extrair "556292631631"
  if (sessionId.includes('-andressa')) {
    const phone = sessionId.split('-andressa')[0];
    console.log(`📱 [SESSION_PARSER] Gerente externo - extracted phone: "${phone}"`);
    return phone;
  }
  
  // Para canal Yelena: normalizar para sempre usar o mesmo telefone
  if (sessionId.includes('Óticas Villa Glamour') || 
      sessionId.includes('óticas villa glamour') ||
      sessionId.includes('ÓTICAS VILLA GLAMOUR') ||
      sessionId.includes('Pedro Vila Nova')) {
    const phoneMatch = sessionId.match(/(\d{10,15})/);
    const phone = phoneMatch ? phoneMatch[1] : '556292631631';
    console.log(`🏪 [SESSION_PARSER] Yelena channel - normalized phone: "${phone}"`);
    return phone;
  }
  
  // Para outros formatos: "556292631631-nome", extrair primeira parte
  const parts = sessionId.split('-');
  if (parts.length > 1 && /^\d{10,15}$/.test(parts[0])) {
    console.log(`📞 [SESSION_PARSER] Standard format - extracted phone: "${parts[0]}"`);
    return parts[0];
  }
  
  // Fallback: procurar por sequência de números
  const phoneMatch = sessionId.match(/(\d{10,15})/);
  const phone = phoneMatch ? phoneMatch[1] : sessionId;
  console.log(`🔄 [SESSION_PARSER] Fallback - extracted phone: "${phone}"`);
  return phone;
};

// Função para extrair nome do session_id no novo formato
export const extractNameFromSessionId = (sessionId: string) => {
  console.log(`👤 [SESSION_PARSER] Extracting name from session_id: "${sessionId}"`);
  
  // Para canal Yelena: sempre "Pedro Vila Nova"
  if (sessionId.includes('Óticas Villa Glamour') || 
      sessionId.includes('óticas villa glamour') ||
      sessionId.includes('ÓTICAS VILLA GLAMOUR') ||
      sessionId.includes('Pedro Vila Nova')) {
    console.log(`🏪 [SESSION_PARSER] Yelena channel - name: "Pedro Vila Nova"`);
    return 'Pedro Vila Nova';
  }
  
  // Para canal gerente-externo: extrair o nome real do contato
  if (sessionId.includes('-andressa')) {
    const phone = sessionId.split('-andressa')[0];
    const name = `Cliente ${phone.slice(-4)}`;
    console.log(`👔 [SESSION_PARSER] Gerente externo - contact name: "${name}"`);
    return name;
  }
  
  // Para outros formatos: "556292631631-nome", extrair nome
  const parts = sessionId.split('-');
  if (parts.length > 1) {
    const name = parts.slice(1).join('-').trim();
    console.log(`📝 [SESSION_PARSER] Standard format - extracted name: "${name}"`);
    return name || 'Cliente';
  }
  
  // Fallback
  console.log(`🔄 [SESSION_PARSER] Fallback - using session_id as name`);
  return sessionId || 'Cliente';
};

// Função para normalizar session_id para consistência
export const normalizeSessionId = (sessionId: string, channelId: string): string => {
  console.log(`🔧 [SESSION_PARSER] Normalizing session_id: "${sessionId}" for channel: "${channelId}"`);
  
  const phone = extractPhoneFromSessionId(sessionId);
  
  // Para canal Yelena, sempre normalizar para o formato padrão
  if (channelId === 'chat' || channelId === 'af1e5797-edc6-4ba3-a57a-25cf7297c4d6') {
    const normalized = `${phone}-Pedro Vila Nova`;
    console.log(`🏪 [SESSION_PARSER] Yelena normalized: "${normalized}"`);
    return normalized;
  }
  
  // Para gerente-externo, manter formato original
  if (channelId === 'gerente-externo' || channelId === 'd2892900-ca8f-4b08-a73f-6b7aa5866ff7') {
    if (!sessionId.includes('-andressa')) {
      const normalized = `${phone}-andressa`;
      console.log(`👔 [SESSION_PARSER] Gerente externo normalized: "${normalized}"`);
      return normalized;
    }
  }
  
  console.log(`✅ [SESSION_PARSER] Session_id already normalized: "${sessionId}"`);
  return sessionId;
};
