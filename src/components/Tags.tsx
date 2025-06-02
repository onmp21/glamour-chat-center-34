import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Tags as TagsIcon, 
  Plus, 
  Search, 
  Filter, 
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTags } from '@/hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { TagCreateEditModal } from './tags/TagCreateEditModal';

interface TagsProps {
  isDarkMode: boolean;
}

interface TagStats {
  id: string;
  name: string;
  color: string;
  contactsCount: number;
  conversationsCount: number;
  lastUsed: Date;
  createdAt: Date;
  description?: string;
}

export const Tags: React.FC<TagsProps> = ({ isDarkMode }) => {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagStats | null>(null);

  // Mock data for demonstration - in real app, this would come from the hook
  const [tagStats, setTagStats] = useState<TagStats[]>([
    {
      id: '1',
      name: 'Cliente VIP',
      color: '#f59e0b',
      contactsCount: 45,
      conversationsCount: 128,
      lastUsed: new Date('2024-01-15'),
      createdAt: new Date('2024-01-01'),
      description: 'Clientes com alto valor de compra'
    },
    {
      id: '2',
      name: 'Suporte Técnico',
      color: '#ef4444',
      contactsCount: 89,
      conversationsCount: 234,
      lastUsed: new Date('2024-01-14'),
      createdAt: new Date('2024-01-02'),
      description: 'Problemas técnicos e suporte'
    },
    {
      id: '3',
      name: 'Vendas',
      color: '#10b981',
      contactsCount: 67,
      conversationsCount: 156,
      lastUsed: new Date('2024-01-13'),
      createdAt: new Date('2024-01-03'),
      description: 'Oportunidades de vendas'
    },
    {
      id: '4',
      name: 'Follow-up',
      color: '#8b5cf6',
      contactsCount: 23,
      conversationsCount: 45,
      lastUsed: new Date('2024-01-12'),
      createdAt: new Date('2024-01-04'),
      description: 'Contatos para retomar'
    }
  ]);

  const filteredTags = tagStats.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tag.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    if (filterBy === 'active') return matchesSearch && tag.conversationsCount > 0;
    if (filterBy === 'inactive') return matchesSearch && tag.conversationsCount === 0;
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'contacts': return b.contactsCount - a.contactsCount;
      case 'conversations': return b.conversationsCount - a.conversationsCount;
      case 'recent': return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      case 'name':
      default: return a.name.localeCompare(b.name);
    }
  });

  const totalContacts = tagStats.reduce((sum, tag) => sum + tag.contactsCount, 0);
  const totalConversations = tagStats.reduce((sum, tag) => sum + tag.conversationsCount, 0);
  const activeTags = tagStats.filter(tag => tag.conversationsCount > 0).length;

  const handleCreateTag = () => {
    setSelectedTag(null);
    setShowCreateModal(true);
  };

  const handleEditTag = (tag: TagStats) => {
    setSelectedTag(tag);
    setShowCreateModal(true);
  };

  const handleSaveTag = async (tagData: {
    id?: string;
    name: string;
    color: string;
    description?: string;
  }) => {
    if (tagData.id) {
      // Update existing tag
      setTagStats(prev => prev.map(tag => 
        tag.id === tagData.id 
          ? { ...tag, ...tagData }
          : tag
      ));
    } else {
      // Create new tag
      const newTag: TagStats = {
        id: Date.now().toString(),
        name: tagData.name,
        color: tagData.color,
        description: tagData.description,
        contactsCount: 0,
        conversationsCount: 0,
        lastUsed: new Date(),
        createdAt: new Date()
      };
      setTagStats(prev => [...prev, newTag]);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta tag? Esta ação não pode ser desfeita.')) {
      try {
        await deleteTag(tagId);
        setTagStats(prev => prev.filter(tag => tag.id !== tagId));
        toast({
          title: "Tag removida",
          description: "A tag foi removida com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível remover a tag.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportTags = () => {
    const csvContent = [
      ['Nome', 'Descrição', 'Contatos', 'Conversas', 'Último Uso', 'Criado em'],
      ...filteredTags.map(tag => [
        tag.name,
        tag.description || '',
        tag.contactsCount.toString(),
        tag.conversationsCount.toString(),
        tag.lastUsed.toLocaleDateString('pt-BR'),
        tag.createdAt.toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tags-relatorio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório exportado",
      description: "O relatório de tags foi baixado com sucesso.",
    });
  };

  return (
    <>
      <div className={cn("p-6 space-y-6", isDarkMode ? "bg-zinc-950" : "bg-gray-50")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn("text-2xl font-bold flex items-center gap-2", isDarkMode ? "text-white" : "text-gray-900")}>
              <TagsIcon className="w-6 h-6" />
              Tags de Contatos
            </h1>
            <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
              Gerencie e organize seus contatos com tags personalizadas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportTags}
              variant="outline"
              className={cn(isDarkMode ? "border-gray-600" : "border-gray-300")}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleCreateTag} className="bg-[#b5103c] hover:bg-[#8a0c2e]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tag
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                    Total de Tags
                  </p>
                  <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                    {tagStats.length}
                  </p>
                </div>
                <TagsIcon className={cn("w-8 h-8", isDarkMode ? "text-gray-400" : "text-gray-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                    Tags Ativas
                  </p>
                  <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                    {activeTags}
                  </p>
                </div>
                <TrendingUp className={cn("w-8 h-8", isDarkMode ? "text-gray-400" : "text-gray-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                    Total Contatos
                  </p>
                  <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                    {totalContacts}
                  </p>
                </div>
                <Users className={cn("w-8 h-8", isDarkMode ? "text-gray-400" : "text-gray-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                    Conversas Taggeadas
                  </p>
                  <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                    {totalConversations}
                  </p>
                </div>
                <BarChart3 className={cn("w-8 h-8", isDarkMode ? "text-gray-400" : "text-gray-600")} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
          <CardHeader>
            <CardTitle className={cn("text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  <SelectItem value="active">Tags ativas</SelectItem>
                  <SelectItem value="inactive">Tags inativas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="contacts">Número de contatos</SelectItem>
                  <SelectItem value="conversations">Conversas</SelectItem>
                  <SelectItem value="recent">Uso recente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tags List */}
        <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
          <CardHeader>
            <CardTitle className={cn("text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
              Tags ({filteredTags.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b5103c]"></div>
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="text-center py-8">
                <TagsIcon className={cn("w-12 h-12 mx-auto mb-4", isDarkMode ? "text-gray-600" : "text-gray-400")} />
                <p className={cn("text-lg font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Nenhuma tag encontrada
                </p>
                <p className={cn("text-sm", isDarkMode ? "text-gray-500" : "text-gray-500")}>
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Crie sua primeira tag para começar'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      isDarkMode ? "border-zinc-700 hover:bg-zinc-800" : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <div>
                          <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                            {tag.name}
                          </h3>
                          {tag.description && (
                            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                              {tag.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {tag.contactsCount} contatos
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tag.conversationsCount} conversas
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTag(tag)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Último uso: {tag.lastUsed.toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Criado em: {tag.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TagCreateEditModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isDarkMode={isDarkMode}
        tag={selectedTag}
        onSave={handleSaveTag}
      />
    </>
  );
};
