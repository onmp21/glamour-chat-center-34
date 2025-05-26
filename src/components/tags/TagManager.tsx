
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useTags, Tag } from '@/hooks/useTags';
import { cn } from '@/lib/utils';
import { Plus, Edit2, Trash2, Tag as TagIcon } from 'lucide-react';

interface TagManagerProps {
  isDarkMode: boolean;
}

const colorOptions = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Amarelo', value: '#f59e0b' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Cinza', value: '#6b7280' }
];

export const TagManager: React.FC<TagManagerProps> = ({ isDarkMode }) => {
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let success = false;
    if (editingTag) {
      success = await updateTag(editingTag.id, formData.name, formData.color);
    } else {
      success = await createTag(formData.name, formData.color);
    }

    if (success) {
      setFormData({ name: '', color: '#3b82f6' });
      setIsCreateOpen(false);
      setEditingTag(null);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setIsCreateOpen(true);
  };

  const handleDelete = async (tagId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tag?')) {
      await deleteTag(tagId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
          Gerenciar Tags
        </h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTag(null);
              setFormData({ name: '', color: '#3b82f6' });
            }}>
              <Plus size={16} className="mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className={isDarkMode ? "dark-bg-secondary dark-border" : ""}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? "text-white" : ""}>
                {editingTag ? 'Editar Tag' : 'Nova Tag'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className={isDarkMode ? "text-gray-300" : ""}>Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da tag"
                  className={isDarkMode ? "dark-bg-primary dark-border text-white" : ""}
                />
              </div>
              <div>
                <Label className={isDarkMode ? "text-gray-300" : ""}>Cor</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={cn(
                        "w-full h-10 rounded-md border-2 transition-all",
                        formData.color === color.value ? "border-gray-900 scale-105" : "border-gray-300"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTag ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                isDarkMode ? "dark-bg-primary dark-border" : "bg-white border-gray-200"
              )}
            >
              <Badge style={{ backgroundColor: tag.color }} className="text-white">
                <TagIcon size={12} className="mr-1" />
                {tag.name}
              </Badge>
              <div className="flex space-x-1">
                <Button
                  onClick={() => handleEdit(tag)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  onClick={() => handleDelete(tag.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
