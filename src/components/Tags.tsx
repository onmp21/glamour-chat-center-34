
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Search, Plus, Users, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagsProps {
  isDarkMode: boolean;
}

interface ContactTag {
  id: string;
  contactName: string;
  contactPhone: string;
  tags: string[];
  lastInteraction: string;
  channel: string;
  status: 'active' | 'resolved';
}

export const Tags: React.FC<TagsProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<ContactTag[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulação de dados - substituir por dados reais
  useEffect(() => {
    const mockContacts: ContactTag[] = [
      {
        id: '1',
        contactName: 'Pedro Vila Nova',
        contactPhone: '11987654321',
        tags: ['Novo Contato', 'Quero fazer um exame'],
        lastInteraction: '2024-01-06T10:30:00Z',
        channel: 'Yelena',
        status: 'active'
      },
      {
        id: '2',
        contactName: 'Maria Silva',
        contactPhone: '11976543210',
        tags: ['Cliente Retornando'],
        lastInteraction: '2024-01-05T15:45:00Z',
        channel: 'Canarana',
        status: 'resolved'
      },
      {
        id: '3',
        contactName: 'João Santos',
        contactPhone: '11965432109',
        tags: ['Novo Contato', 'Quero fazer um exame'],
        lastInteraction: '2024-01-06T09:15:00Z',
        channel: 'Yelena',
        status: 'active'
      }
    ];
    setContacts(mockContacts);
  }, []);

  const allTags = Array.from(new Set(contacts.flatMap(contact => contact.tags)));
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactPhone.includes(searchTerm) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = !filterTag || contact.tags.includes(filterTag);
    
    return matchesSearch && matchesFilter;
  });

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Novo Contato':
        return 'bg-blue-500';
      case 'Quero fazer um exame':
        return 'bg-green-500';
      case 'Cliente Retornando':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTagStats = () => {
    return allTags.map(tag => ({
      name: tag,
      count: contacts.filter(contact => contact.tags.includes(tag)).length,
      color: getTagColor(tag)
    }));
  };

  const addCustomTag = (contactId: string, newTag: string) => {
    if (!newTag.trim()) return;
    
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, tags: [...contact.tags, newTag.trim()] }
        : contact
    ));
    
    toast({
      title: "Tag adicionada",
      description: `Tag "${newTag}" foi adicionada ao contato`,
    });
  };

  const removeTag = (contactId: string, tagToRemove: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, tags: contact.tags.filter(tag => tag !== tagToRemove) }
        : contact
    ));
    
    toast({
      title: "Tag removida",
      description: `Tag "${tagToRemove}" foi removida`,
    });
  };

  return (
    <div className={cn(
      "h-full overflow-auto",
      isDarkMode ? "bg-[#09090b]" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Tags de Contatos
          </h1>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Gerencie e organize contatos através de tags automáticas e manuais
          </p>
        </div>

        {/* Estatísticas das Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Total de Contatos
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {contacts.length}
                  </p>
                </div>
                <Users className={cn(
                  "h-8 w-8",
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                )} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Novos Contatos
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {contacts.filter(c => c.tags.includes('Novo Contato')).length}
                  </p>
                </div>
                <TrendingUp className={cn(
                  "h-8 w-8",
                  isDarkMode ? "text-green-400" : "text-green-500"
                )} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Querem Exame
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {contacts.filter(c => c.tags.includes('Quero fazer um exame')).length}
                  </p>
                </div>
                <Clock className={cn(
                  "h-8 w-8",
                  isDarkMode ? "text-yellow-400" : "text-yellow-500"
                )} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Total de Tags
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {allTags.length}
                  </p>
                </div>
                <Tag className={cn(
                  "h-8 w-8",
                  isDarkMode ? "text-purple-400" : "text-purple-500"
                )} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className={cn(
          "mb-6",
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )} />
                  <Input
                    placeholder="Buscar por nome, telefone ou tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      "pl-10",
                      isDarkMode 
                        ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag(null)}
                  className={cn(
                    filterTag === null && "bg-[#b5103c] hover:bg-[#a00f36] text-white",
                    isDarkMode && filterTag !== null && "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  Todas
                </Button>
                {getTagStats().map((tag) => (
                  <Button
                    key={tag.name}
                    variant={filterTag === tag.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterTag(filterTag === tag.name ? null : tag.name)}
                    className={cn(
                      filterTag === tag.name && "bg-[#b5103c] hover:bg-[#a00f36] text-white",
                      isDarkMode && filterTag !== tag.name && "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                    )}
                  >
                    {tag.name} ({tag.count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contatos */}
        <Card className={cn(
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Contatos ({filteredContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={cn(
                        "font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        {contact.contactName}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {contact.contactPhone} • {contact.channel}
                      </p>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      )}>
                        Última interação: {new Date(contact.lastInteraction).toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant={contact.status === 'active' ? 'default' : 'secondary'}
                      className={contact.status === 'active' ? 'bg-green-500' : ''}
                    >
                      {contact.status === 'active' ? 'Ativo' : 'Resolvido'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className={cn(
                          "text-white cursor-pointer hover:opacity-80",
                          getTagColor(tag)
                        )}
                        onClick={() => removeTag(contact.id, tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-6 px-2 text-xs",
                        isDarkMode ? "border-zinc-600 text-zinc-300 hover:bg-zinc-700" : ""
                      )}
                      onClick={() => {
                        const newTag = prompt('Digite a nova tag:');
                        if (newTag) addCustomTag(contact.id, newTag);
                      }}
                    >
                      <Plus size={12} className="mr-1" />
                      Adicionar Tag
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-8">
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  )}>
                    Nenhum contato encontrado com os filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
