
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Search, Filter, Download, Eye, User, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';

interface AuditHistorySectionProps {
  isDarkMode: boolean;
}

export const AuditHistorySection: React.FC<AuditHistorySectionProps> = ({
  isDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const { logs, loading, refetch } = useAuditLogs();

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) return <User size={14} />;
    if (action.includes('view') || action.includes('access')) return <Eye size={14} />;
    return <Activity size={14} />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('error') || action.includes('delete')) {
      return isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200';
    }
    if (action.includes('create') || action.includes('add')) {
      return isDarkMode ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('update') || action.includes('edit')) {
      return isDarkMode ? 'bg-amber-900/30 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return isDarkMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getSeverityColor = (details: any) => {
    if (details?.error || details?.severity === 'high') {
      return isDarkMode ? 'text-red-400' : 'text-red-600';
    }
    if (details?.warning || details?.severity === 'medium') {
      return isDarkMode ? 'text-amber-400' : 'text-amber-600';
    }
    return isDarkMode ? 'text-zinc-400' : 'text-gray-600';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.context?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    
    return matchesSearch && matchesAction;
  });

  return (
    <div className={cn(
      "p-6 rounded-lg border",
      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={20} className={isDarkMode ? "text-zinc-300" : "text-gray-700"} />
          <h3 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-zinc-100" : "text-gray-900"
          )}>
            Histórico de Auditoria
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
            className={cn(
              isDarkMode ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300"
            )}
          >
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              isDarkMode ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-gray-300"
            )}
          >
            <Download size={16} className="mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search size={16} className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            isDarkMode ? "text-zinc-500" : "text-gray-400"
          )} />
          <Input
            placeholder="Buscar logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10",
              isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-white border-gray-300"
            )}
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className={cn(
            isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-white border-gray-300"
          )}>
            <SelectValue placeholder="Filtrar por ação" />
          </SelectTrigger>
          <SelectContent className={cn(
            isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
          )}>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value="login">Login/Logout</SelectItem>
            <SelectItem value="view">Visualizações</SelectItem>
            <SelectItem value="create">Criações</SelectItem>
            <SelectItem value="update">Atualizações</SelectItem>
            <SelectItem value="delete">Exclusões</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className={cn(
            isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-white border-gray-300"
          )}>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className={cn(
            isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
          )}>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <ScrollArea className="h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className={cn(
              "animate-spin rounded-full h-6 w-6 border-b-2",
              isDarkMode ? "border-zinc-400" : "border-gray-600"
            )}></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className={cn(
            "text-center py-8 text-sm",
            isDarkMode ? "text-zinc-500" : "text-gray-500"
          )}>
            Nenhum log encontrado
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  isDarkMode ? "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800" : "bg-gray-50/50 border-gray-200/50 hover:bg-gray-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "p-1.5 rounded-full mt-0.5",
                      isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )}>
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-medium", getActionColor(log.action))}
                        >
                          {log.action}
                        </Badge>
                        {log.context && (
                          <span className={cn(
                            "text-xs",
                            isDarkMode ? "text-zinc-400" : "text-gray-500"
                          )}>
                            {log.context}
                          </span>
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-zinc-300" : "text-gray-700"
                      )}>
                        {log.user_email || 'Sistema'}
                      </p>
                      
                      {log.details && (
                        <p className={cn(
                          "text-xs mt-1 line-clamp-2",
                          getSeverityColor(log.details)
                        )}>
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details, null, 2).slice(0, 100) + '...'
                            : log.details
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    )}>
                      {format(new Date(log.created_at), 'dd/MM HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
