
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [rememberUser, setRememberUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Iniciando login com:', credentials);
      const success = await login(credentials);
      if (!success) {
        toast({
          title: 'Erro de autenticação',
          description: 'Usuário ou senha incorretos.',
          variant: 'destructive'
        });
      } else {
        // Mostrar mensagem de sucesso centralizada
        setShowSuccessMessage(true);
        
        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          toast({
            title: 'Login realizado',
            description: 'Bem-vindo ao sistema!',
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o login.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberUserChange = (checked: boolean | "indeterminate") => {
    setRememberUser(checked === true);
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-fade-in">
            <div className="mb-4 p-6 bg-white rounded-lg shadow-lg border-2 border-primary">
              <div className="text-4xl text-primary mb-4">✓</div>
              <h2 className="text-2xl font-bold text-primary mb-2">Login bem-sucedido!</h2>
              <p className="text-gray-600">Redirecionando para o painel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/ea397861-5fcd-451b-872e-727208c03a67.png" 
              alt="Villa Glamour Logo" 
              className="app-logo object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary">Villa Glamour</h1>
          <p className="text-gray-600">Faça login para acessar o painel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberUser}
                onCheckedChange={handleRememberUserChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="remember" className="text-sm text-gray-700">
                Lembrar usuário
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hover text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
