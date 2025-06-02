
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TagCreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  tag?: {
    id: string;
    name: string;
    color: string;
    description?: string;
  } | null;
  onSave: (tag: {
    id?: string;
    name: string;
    color: string;
    description?: string;
  }) => void;
}

const predefinedColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b', '#6b7280', '#374151'
];

export const TagCreateEditModal: React.FC<TagCreateEditModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  tag,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setDescription(tag.description || '');
      setSelectedColor(tag.color);
    } else {
      setName('');
      setDescription('');
      setSelectedColor('#3b82f6');
    }
  }, [tag, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da tag é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        id: tag?.id,
        name: name.trim(),
        color: selectedColor,
        description: description.trim() || undefined
      });

      toast({
        title: tag ? "Tag atualizada" : "Tag criada",
        description: tag 
          ? "A tag foi atualizada com sucesso." 
          : "A nova tag foi criada com sucesso.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: tag 
          ? "Não foi possível atualizar a tag." 
          : "Não foi possível criar a tag.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
            {tag ? 'Editar Tag' : 'Nova Tag'}
          </DialogTitle>
          <DialogDescription className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
            {tag 
              ? 'Edite as informações da tag abaixo.' 
              : 'Crie uma nova tag para organizar seus contatos.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Nome da Tag *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cliente VIP, Suporte, Vendas..."
              className={cn(
                isDarkMode 
                  ? "bg-zinc-800 border-zinc-700 text-white" 
                  : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito desta tag..."
              rows={3}
              className={cn(
                isDarkMode 
                  ? "bg-zinc-800 border-zinc-700 text-white" 
                  : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className={cn(isDarkMode ? "text-white" : "text-gray-900")}>
              Cor da Tag
            </Label>
            <div className="grid grid-cols-10 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                    selectedColor === color 
                      ? "border-gray-900 dark:border-white" 
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg border">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedColor }}
            />
            <span className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Preview: {name || 'Nova Tag'}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className={cn(isDarkMode ? "border-gray-600" : "border-gray-300")}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#b5103c] hover:bg-[#8a0c2e]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {tag ? 'Atualizando...' : 'Criando...'}
              </>
            ) : (
              tag ? 'Atualizar Tag' : 'Criar Tag'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
