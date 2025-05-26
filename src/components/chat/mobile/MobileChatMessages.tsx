
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
        backgroundColor: isDarkMode ? "#0a0a0a" : "#f8fafc",
        paddingBottom: "100px"
      }}
    >
      <div className="p-4 space-y-4">
        <div className="text-center">
          <span className={cn(
            "text-xs px-3 py-1 rounded-full",
            isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-gray-200 text-gray-600"
          )}>
            Conversa iniciada hoje
          </span>
        </div>

        {/* Mensagem recebida - cinza neutro */}
        <div className="flex justify-start">
          <div className={cn(
            "p-3 rounded-lg shadow-sm max-w-[80%]",
            isDarkMode ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "bg-white text-gray-900 border border-gray-200"
          )}>
            <span className="text-sm">Gostaria de saber sobre os produtos em promoção</span>
            <div className={cn("text-xs mt-1", isDarkMode ? "text-zinc-500" : "text-gray-500")}>10:30</div>
          </div>
        </div>

        {/* Mensagem enviada - vermelho #b5103c */}
        <div className="flex justify-end">
          <div className="bg-[#b5103c] p-3 rounded-lg shadow-sm max-w-[80%]">
            <span className="text-sm text-white">Olá! Claro, posso ajudá-la com informações sobre nossas promoções.</span>
            <div className="text-xs text-red-100 mt-1">10:32</div>
          </div>
        </div>

        {/* Mensagem recebida - cinza neutro */}
        <div className="flex justify-start">
          <div className={cn(
            "p-3 rounded-lg shadow-sm max-w-[80%]",
            isDarkMode ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "bg-white text-gray-900 border border-gray-200"
          )}>
            <span className="text-sm">Estou interessada nos produtos de maquiagem</span>
            <div className={cn("text-xs mt-1", isDarkMode ? "text-zinc-500" : "text-gray-500")}>10:35</div>
          </div>
        </div>
      </div>
    </div>
  );
};
