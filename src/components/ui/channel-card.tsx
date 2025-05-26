
import React from "react";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  name: string;
  subtitle?: string;
  status?: "online" | "offline";
  count?: number;
  instagram?: string;
  isDarkMode?: boolean;
  onClick?: () => void;
  compact?: boolean; // True para cards compactos (desktop), false para cards grandes (mobile)
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  count,
  isDarkMode,
  onClick,
  compact = true // desktop default: compacto; mobile sobrescreve para false
}) => {
  // Cores dinâmicas baseadas em modo
  const bg =
    isDarkMode
      ? compact
        ? "#232323" // desktop dark - compacto
        : "#26272b" // mobile dark
      : compact
        ? "#ececec" // desktop light
        : "#f6f6f8"; // mobile light
  const border = isDarkMode ? "#313131" : "#e0e0e0";
  const colorTitle = isDarkMode ? "text-white" : "text-gray-900";
  const colorSub = isDarkMode ? "text-gray-400" : "text-gray-700";
  const textCount = count !== undefined ? `${count} conversas` : "";

  return (
    <button
      onClick={onClick}
      className={cn(
        // Desktop/web: versão compacta (cards pequenos/chunk)
        compact
          ? "w-full flex items-center justify-between rounded-xl shadow-sm px-4 py-3 mb-2 transition-transform duration-150 cursor-pointer hover:scale-[1.03] border"
          : // Mobile: pode usar o layout anterior maior (mas por padrão dias de canais já não são exibidos na home mobile)
            "w-full flex items-center justify-between rounded-2xl shadow-sm px-6 py-5 mb-3",
        "animate-fade-in",
        // Força largura/altura para desktop
        compact && "max-w-[260px] min-h-[56px] md:min-h-[56px]"
      )}
      style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}
    >
      <div className="flex flex-col min-w-0">
        <div className={cn("font-bold truncate text-base", colorTitle)}>
          {name}
        </div>
        <span className={cn("text-xs font-medium mt-0.5", colorSub)}>
          {textCount}
        </span>
      </div>
    </button>
  );
};
