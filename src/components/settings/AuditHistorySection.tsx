
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileText, Search, Filter, Calendar, User, Activity } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditHistorySectionProps {
  isDarkMode: boolean;
}

export const AuditHistorySection: React.FC<AuditHistorySectionProps> = ({ isDarkMode }) => {
  const { logs, loading, error, loadLogs } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resource_type === resourceFilter;

    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'criar':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'atualizar':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'excluir':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'user':
      case 'usuario':
        return <User size={16} />;
      case 'exam':
      case 'exame':
        return <Calendar size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const formatDetails = (details: any) => {
    if (!details) return 'N/A';
    if (typeof details === 'string') return details;
    return JSON.stringify(details, null, 2);
  };

  if (loading) {
    return (
      <Card className={cn(
        "border",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className={cn("mt-4", isDarkMode ? "text-gray-300" : "text-gray-600")}>
            Carregando histórico de auditoria...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn(
        "border",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadLogs()} className="mt-4">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={cn(
        "border",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center space-x-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <FileText size={20} />
            <span>Histórico de Auditoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por usuário, ação ou recurso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="create">Criar</SelectItem>
                <SelectItem value="update">Atualizar</SelectItem>
                <SelectItem value="delete">Excluir</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por recurso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os recursos</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="exam">Exame</SelectItem>
                <SelectItem value="channel">Canal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className={cn("mx-auto mb-4", isDarkMode ? "text-gray-600" : "text-gray-400")} />
                <p className={cn("text-lg font-medium", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                  Nenhum log encontrado
                </p>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Tente ajustar os filtros para ver mais resultados
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDarkMode 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={cn(
                        "p-2 rounded-full",
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      )}>
                        {getResourceIcon(log.resource_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                          <span className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}>
                            {log.user_name}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        )}>
                          {log.resource_type} {log.resource_id && `(ID: ${log.resource_id})`}
                        </p>
                        {log.details && (
                          <div className={cn(
                            "mt-2 p-2 rounded text-xs font-mono",
                            isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
                          )}>
                            {formatDetails(log.details)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {format(new Date(log.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {format(new Date(log.created_at), 'HH:mm:ss', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t" style={{
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
          }}>
            <span className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {filteredLogs.length} registro(s) encontrado(s)
            </span>
            <Button
              onClick={() => loadLogs()}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Filter size={16} />
              <span>Atualizar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
