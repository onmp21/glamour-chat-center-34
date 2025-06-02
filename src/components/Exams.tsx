
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Plus, Edit, Trash2, Filter, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExams } from '@/hooks/useExams';

interface ExamsProps {
  isDarkMode: boolean;
}

export const Exams: React.FC<ExamsProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const { exams, loading, createExam, updateExam, deleteExam } = useExams();

  const [newExam, setNewExam] = useState({
    name: '',
    phone: '',
    examType: 'Exame de Vista',
    appointmentDate: '',
    city: '',
    notes: '',
    instagram: ''
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.phone.includes(searchTerm) ||
      exam.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExam.name || !newExam.phone || !newExam.appointmentDate || !newExam.city) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const success = await createExam(newExam);
    if (success) {
      setNewExam({
        name: '',
        phone: '',
        examType: 'Exame de Vista',
        appointmentDate: '',
        city: '',
        notes: '',
        instagram: ''
      });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'realizado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className={cn(
              "text-3xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Gerenciamento de Exames
            </h1>
            <p className={cn(
              "text-lg",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Agende, gerencie e acompanhe exames de vista
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#b5103c] hover:bg-[#8a0c2e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Exame
          </Button>
        </div>

        {/* Formulário de Novo Exame */}
        {showAddForm && (
          <Card className={cn(
            "mb-6",
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Agendar Novo Exame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Paciente *</Label>
                  <Input
                    id="name"
                    value={newExam.name}
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={newExam.phone}
                    onChange={(e) => setNewExam({ ...newExam, phone: e.target.value })}
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="appointmentDate">Data do Exame *</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={newExam.appointmentDate}
                    onChange={(e) => setNewExam({ ...newExam, appointmentDate: e.target.value })}
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={newExam.city}
                    onChange={(e) => setNewExam({ ...newExam, city: e.target.value })}
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={newExam.instagram}
                    onChange={(e) => setNewExam({ ...newExam, instagram: e.target.value })}
                    placeholder="@usuario"
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={newExam.notes}
                    onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                    className={cn(
                      isDarkMode 
                        ? "bg-slate-700 border-slate-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit" className="bg-[#b5103c] hover:bg-[#8a0c2e]">
                    Agendar Exame
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className={cn(
                      isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""
                    )}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filtros e Busca */}
        <Card className={cn(
          "mb-6",
          isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, telefone ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={cn(
                    statusFilter === 'all' && "bg-[#b5103c] hover:bg-[#8a0c2e] text-white",
                    isDarkMode && statusFilter !== 'all' && "border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'agendado' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter('agendado')}
                  className={cn(
                    statusFilter === 'agendado' && "bg-[#b5103c] hover:bg-[#8a0c2e] text-white",
                    isDarkMode && statusFilter !== 'agendado' && "border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Agendados
                </Button>
                <Button
                  variant={statusFilter === 'realizado' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter('realizado')}
                  className={cn(
                    statusFilter === 'realizado' && "bg-[#b5103c] hover:bg-[#8a0c2e] text-white",
                    isDarkMode && statusFilter !== 'realizado' && "border-slate-600 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  Realizados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Exames */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => (
            <Card 
              key={exam.id}
              className={cn(
                "transition-all duration-200 hover:shadow-lg",
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={cn(
                      "text-lg",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {exam.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {exam.phone} • {exam.city}
                    </CardDescription>
                  </div>
                  
                  <Badge className={getStatusColor(exam.status)}>
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(exam.appointmentDate).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className={cn(
                    "font-medium",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {exam.examType}
                  </div>
                  
                  {exam.instagram && (
                    <div className="text-blue-600 dark:text-blue-400">
                      @{exam.instagram}
                    </div>
                  )}
                  
                  {exam.notes && (
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {exam.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <Card className={cn(
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-8 text-center">
              <Calendar className={cn(
                "w-12 h-12 mx-auto mb-4",
                isDarkMode ? "text-gray-400" : "text-gray-400"
              )} />
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Nenhum exame encontrado
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                {searchTerm || statusFilter !== 'all' 
                  ? "Tente ajustar seus filtros ou termo de busca"
                  : "Comece agendando seu primeiro exame"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
