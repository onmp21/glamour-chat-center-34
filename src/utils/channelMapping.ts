
export type TableName = 
  | 'yelena_ai_conversas'
  | 'canarana_conversas'
  | 'souto_soares_conversas'
  | 'joao_dourado_conversas'
  | 'america_dourada_conversas'
  | 'gerente_lojas_conversas'
  | 'gerente_externo_conversas'
  | 'pedro_conversas';

export const getTableNameForChannel = (channelId: string): TableName => {
  console.log('🔍 Mapeando canal:', channelId);
  
  const channelToTableMap: Record<string, TableName> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'yelena_ai_conversas',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'canarana_conversas',
    'b7996f75-41a7-4725-8229-564f31868027': 'souto_soares_conversas',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'joao_dourado_conversas',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'america_dourada_conversas',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'gerente_lojas_conversas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'gerente_externo_conversas',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'pedro_conversas',
  };
  
  const nameToTableMap: Record<string, TableName> = {
    'chat': 'yelena_ai_conversas',
    'yelena': 'yelena_ai_conversas',
    'yelena-ai': 'yelena_ai_conversas',
    'canarana': 'canarana_conversas',
    'souto-soares': 'souto_soares_conversas',
    'joao-dourado': 'joao_dourado_conversas',
    'america-dourada': 'america_dourada_conversas',
    'gerente-lojas': 'gerente_lojas_conversas',
    'gerente-externo': 'gerente_externo_conversas',
    'gerente_externo': 'gerente_externo_conversas',
    'pedro': 'pedro_conversas'
  };
  
  const tableName = channelToTableMap[channelId] || nameToTableMap[channelId] || 'yelena_ai_conversas';
  console.log('✅ Canal:', channelId, '-> Tabela:', tableName);
  return tableName;
};

export const getChannelDisplayName = (channelId: string): string => {
  const channelDisplayMap: Record<string, string> = {
    'af1e5797-edc6-4ba3-a57a-25cf7297c4d6': 'Yelena',
    '011b69ba-cf25-4f63-af2e-4ad0260d9516': 'Canarana',
    'b7996f75-41a7-4725-8229-564f31868027': 'Souto Soares',
    '621abb21-60b2-4ff2-a0a6-172a94b4b65c': 'João Dourado',
    '64d8acad-c645-4544-a1e6-2f0825fae00b': 'América Dourada',
    'd8087e7b-5b06-4e26-aa05-6fc51fd4cdce': 'Gerente Lojas',
    'd2892900-ca8f-4b08-a73f-6b7aa5866ff7': 'Gerente Externo',
    '1e233898-5235-40d7-bf9c-55d46e4c16a1': 'Pedro',
    'chat': 'Yelena',
    'yelena': 'Yelena',
    'yelena-ai': 'Yelena',
    'canarana': 'Canarana',
    'souto-soares': 'Souto Soares',
    'joao-dourado': 'João Dourado',
    'america-dourada': 'América Dourada',
    'gerente-lojas': 'Gerente Lojas',
    'gerente-externo': 'Gerente Externo',
    'pedro': 'Pedro'
  };
  
  return channelDisplayMap[channelId] || 'Yelena';
};

export const getUniqueConversationKey = (channelId: string, phone: string): string => {
  return `${channelId}::${phone}`;
};

export const parseUniqueConversationKey = (key: string): { channelId: string; phone: string } => {
  const [channelId, phone] = key.split('::');
  return { channelId: channelId || '', phone: phone || '' };
};
