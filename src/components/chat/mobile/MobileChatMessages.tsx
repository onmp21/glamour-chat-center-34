
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileChatMessagesProps {
  isDarkMode: boolean;
}

export const MobileChatMessages: React.FC<MobileChatMessagesProps> = ({
  isDarkMode
}) => {
  return (
    <div 
      className="absolute inset-0 overflow-y-auto chat-messages"
      style={{
        backgroundColor: isDarkMode ? "#0f0f0f" : "#f9fafb",
        paddingBottom: "100px" // Espaço para a barra de digitação
      }}
    >
      <div className="p-4 space-y-4">
        <div className="text-center">
          <span className={cn(
            "text-xs px-3 py-1 rounded-full",
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
          )}>
            Conversa iniciada hoje
          </span>
        </div>

        <div className="flex justify-start">
          <div className={cn(
            "p-3 rounded-lg shadow max-w-[80%]",
            isDarkMode ? "bg-[#1a1a1a] text-white border border-[#404040]" : "bg-white text-gray-900"
          )}>
            <span className="text-sm">Gostaria de saber sobre os produtos em promoção</span>
            <div className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>10:30</div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-[#b5103c] p-3 rounded-lg shadow max-w-[80%]">
            <span className="text-sm text-white">Olá! Claro, posso ajudá-la com informações sobre nossas promoções.</span>
            <div className="text-xs text-white/70 mt-1">10:32</div>
          </div>
        </div>

        <div className="flex justify-start">
          <div className={cn(
            "p-3 rounded-lg shadow max-w-[80%]",
            isDarkMode ? "bg-[#1a1a1a] text-white border border-[#404040]" : "bg-white text-gray-900"
          )}>
            <span className="text-sm">Estou interessada nos produtos de maquiagem</span>
            <div className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>10:35</div>
          </div>
        </div>
      </div>
    </div>
  );
};
