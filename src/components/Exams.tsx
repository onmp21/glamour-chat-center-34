
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useExams, Exam } from '@/hooks/useExams';
import { ExamTable } from '@/components/exams/ExamTable';
import { ExamFiltersWeek } from '@/components/exams/ExamFiltersWeek';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExamsProps {
  isDarkMode: boolean;
}

export const Exams: React.FC<ExamsProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWeekFilter, setShowWeekFilter] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { exams, loading, createExam, updateExam, deleteExams } = useExams();

  const [newExam, setNewExam] = useState({
    name: '',
    phone: '',
    examType: 'Exame de Vista',
    appointmentDate: '',
    city: '',
    observations: '',
    instagram: ''
  });

  // Filtrar exames da semana atual
  const getWeekExams = (examsList: Exam[]) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
    endOfWeek.setHours(23, 59, 59, 999);

    return examsList.filter(exam => {
      const examDate = new Date(exam.appointmentDate);
      return examDate >= startOfWeek && examDate <= endOfWeek;
    });
  };

  // Aplicar filtros
  const filteredExams = (() => {
    let filtered = showWeekFilter ? getWeekExams(exams) : exams;
    
    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.phone.includes(searchTerm) ||
        exam.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }
    
    return filtered;
  })();

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

    try {
      await createExam({
        name: newExam.name,
        phone: newExam.phone,
        examType: newExam.examType,
        appointmentDate: newExam.appointmentDate,
        city: newExam.city,
        observations: newExam.observations,
        instagram: newExam.instagram,
        status: 'agendado'
      });
      
      setNewExam({
        name: '',
        phone: '',
        examType: 'Exame de Vista',
        appointmentDate: '',
        city: '',
        observations: '',
        instagram: ''
      });
      setShowAddForm(false);
      
      toast({
        title: "Sucesso",
        description: "Exame agendado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar exame",
        variant: "destructive"
      });
    }
  };

  const handleExamSelect = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExams.length === filteredExams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(filteredExams.map(exam => exam.id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteExams(selectedExams);
      setSelectedExams([]);
      setShowDeleteDialog(false);
      
      toast({
        title: "Sucesso",
        description: `${selectedExams.length} exame(s) excluído(s) com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir exames",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (exam: Exam) => {
    // TODO: Implementar modal de edição
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição será implementada em breve",
    });
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filtros e Cabeçalho */}
        <ExamFiltersWeek
          isDarkMode={isDarkMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showWeekFilter={showWeekFilter}
          onToggleWeekFilter={() => setShowWeekFilter(!showWeekFilter)}
          selectedCount={selectedExams.length}
          onDeleteSelected={() => setShowDeleteDialog(true)}
          onAddNew={() => setShowAddForm(true)}
        />

        {/* Formulário de Novo Exame */}
        {showAddForm && (
          <Card className={cn(
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
                  <Label htmlFor="observations">Observações</Label>
                  <Input
                    id="observations"
                    value={newExam.observations}
                    onChange={(e) => setNewExam({ ...newExam, observations: e.target.value })}
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

        {/* Tabela de Exames */}
        <ExamTable
          exams={filteredExams}
          isDarkMode={isDarkMode}
          selectedExams={selectedExams}
          onExamSelect={handleExamSelect}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          showWeekFilter={showWeekFilter}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className={cn(
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"
          )}>
            <AlertDialogHeader>
              <AlertDialogTitle className={cn(
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className={cn(
                isDarkMode ? "text-slate-400" : "text-gray-600"
              )}>
                Tem certeza que deseja excluir {selectedExams.length} exame(s) selecionado(s)? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={cn(
                isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""
              )}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
