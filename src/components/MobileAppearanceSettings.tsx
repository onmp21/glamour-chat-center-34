
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Palette, Monitor } from 'lucide-react';

interface MobileAppearanceSettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const MobileAppearanceSettings: React.FC<MobileAppearanceSettingsProps> = ({
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className={cn("text-xl font-bold mb-4", isDarkMode ? "text-white" : "text-gray-900")}>
        Aparência
      </h2>
      
      <Card className={cn(
        "border",
        isDarkMode ? "bg-[#1a1a1a] border-[#404040]" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-base flex items-center gap-2", isDarkMode ? "text-white" : "text-gray-900")}>
            <Palette size={18} />
            Tema da Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button
              onClick={() => !isDarkMode && toggleDarkMode()}
              variant={isDarkMode ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isDarkMode 
                  ? "bg-[#b5103c] text-white hover:bg-[#9d0e34]" 
                  : "border-[#404040] text-gray-700 hover:bg-gray-50"
              )}
              style={{
                borderColor: isDarkMode ? '#b5103c' : '#404040'
              }}
            >
              <Moon size={18} />
              <div className="text-left">
                <div className="font-medium">Modo Escuro</div>
                <div className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                  Interface com cores escuras
                </div>
              </div>
              {isDarkMode && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </Button>
            
            <Button
              onClick={() => isDarkMode && toggleDarkMode()}
              variant={!isDarkMode ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                !isDarkMode 
                  ? "bg-[#b5103c] text-white hover:bg-[#9d0e34]" 
                  : "border-[#404040] text-gray-200 hover:bg-[#2a2a2a]"
              )}
              style={{
                borderColor: !isDarkMode ? '#b5103c' : '#404040'
              }}
            >
              <Sun size={18} />
              <div className="text-left">
                <div className="font-medium">Modo Claro</div>
                <div className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                  Interface com cores claras
                </div>
              </div>
              {!isDarkMode && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </Button>
          </div>
          
          <div className={cn("text-xs p-3 rounded-lg", isDarkMode ? "bg-[#2a2a2a] text-gray-200" : "bg-gray-50 text-gray-600")}>
            <strong>Dica:</strong> O tema escolhido será aplicado em toda a interface do sistema e será salvo para suas próximas sessões.
          </div>
        </CardContent>
      </Card>

      <Card className={cn(
        "border",
        isDarkMode ? "bg-[#1a1a1a] border-[#404040]" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-base flex items-center gap-2", isDarkMode ? "text-white" : "text-gray-900")}>
            <Monitor size={18} />
            Configurações de Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={cn("text-sm", isDarkMode ? "text-gray-200" : "text-gray-600")}>
            <div className="flex justify-between items-center mb-2">
              <span>Tema atual:</span>
              <Badge 
                className={cn(
                  "text-xs",
                  isDarkMode ? "bg-[#b5103c] text-white" : "bg-[#b5103c] text-white"
                )}
              >
                {isDarkMode ? 'Escuro' : 'Claro'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Adaptação automática:</span>
              <span className={cn("text-xs", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                Desabilitado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Adicionando Badge component se não existir
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  );
};
