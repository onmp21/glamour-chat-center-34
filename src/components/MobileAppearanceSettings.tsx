
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Palette } from 'lucide-react';

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
        isDarkMode ? "bg-[#2a2a2a] border-[#404040]" : "bg-white border-gray-200"
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
              onClick={toggleDarkMode}
              variant={isDarkMode ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isDarkMode 
                  ? "bg-[#b5103c] text-white hover:bg-[#9d0e34]" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Moon size={18} />
              <div className="text-left">
                <div className="font-medium">Modo Escuro</div>
                <div className={cn("text-xs", isDarkMode ? "text-gray-200" : "text-gray-500")}>
                  Interface com cores escuras
                </div>
              </div>
            </Button>
            
            <Button
              onClick={toggleDarkMode}
              variant={!isDarkMode ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                !isDarkMode 
                  ? "bg-[#b5103c] text-white hover:bg-[#9d0e34]" 
                  : "border-[#404040] text-gray-200 hover:bg-[#404040]"
              )}
            >
              <Sun size={18} />
              <div className="text-left">
                <div className="font-medium">Modo Claro</div>
                <div className={cn("text-xs", isDarkMode ? "text-gray-300" : "text-gray-500")}>
                  Interface com cores claras
                </div>
              </div>
            </Button>
          </div>
          
          <div className={cn("text-xs p-3 rounded-lg", isDarkMode ? "bg-[#404040] text-gray-300" : "bg-gray-50 text-gray-600")}>
            <strong>Dica:</strong> O tema escolhido será aplicado em toda a interface do sistema.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
