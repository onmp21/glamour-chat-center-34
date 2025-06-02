
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
  Edit,
  Trash2
} from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { useToast } from '@/hooks/use-toast';

interface TagsProps {
  isDarkMode: boolean;
}

export const Tags: React.FC<TagsProps> = ({ isDarkMode }) => {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = () => {
    setShowCreateModal(true);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta tag?')) {
      try {
        await deleteTag(tagId);
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

  return (
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
        <Button onClick={handleCreateTag} className="bg-[#b5103c] hover:bg-[#8a0c2e]">
          <Plus className="w-4 h-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Search */}
      <Card className={cn(isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white")}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
