
export interface ExamRecord {
  id: string;
  pacienteName: string;
  celular: string;
  cidade: 'Canarana' | 'Souto Soares' | 'João Dourado' | 'América Dourada';
  dataAgendamento: string;
  tipoExame: string;
  observacoes?: string;
  status: 'agendado' | 'realizado' | 'cancelado';
  dataChat: string;
  mes: string;
  createdAt: string;
}

export interface ExamFormData {
  pacienteName: string;
  celular: string;
  cidade: 'Canarana' | 'Souto Soares' | 'João Dourado' | 'América Dourada';
  dataAgendamento: Date;
  tipoExame: string;
  observacoes?: string;
}
