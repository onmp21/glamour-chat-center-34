
import React from "react";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  name: string;
  subtitle?: string;
  status?: "online" | "offline";
  count?: number;
  isDarkMode?: boolean;
  onClick?: () => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  subtitle,
  status = "online",
  count,
  isDarkMode,
  onClick,
}) => {
  // Determinar cores de acordo com modo escuro/claro e status
  const bg = isDarkMode ? "#232323" : "#f3f3f3";
  const border = isDarkMode ? "#343434" : "#e0e0e0";
  const colorTitle = isDarkMode ? "text-white" : "text-gray-900";
  const colorSub = isDarkMode ? "text-gray-400" : "text-gray-600";
  const statusColor = status === "online" ? "#22c55e" : "#f43f5e";
  const statusText = status === "online" ? "Ativo" : "Offline";
  const textCount = count !== undefined ? `${count} conversas` : "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between rounded-2xl shadow-none p-5 md:p-7 hover:scale-105 transition-transform duration-200 cursor-pointer",
        "animate-fade-in"
      )}
      style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}
    >
      <div>
        <div className={cn("font-bold text-xl md:text-2xl mb-1", colorTitle)}>
          {name}
        </div>
        {subtitle && (
          <div className={cn("text-sm md:text-base", colorSub, "mb-2")}>
            {subtitle}
          </div>
        )}
        <div className={cn("text-xs font-medium", colorSub)}>
          {textCount}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {/* Status indicator */}
        <div className="flex items-center">
          <span
            className="block w-3 h-3 rounded-full mr-2"
            style={{ background: statusColor, boxShadow: `0 0 0 3px ${bg}` }}
            aria-label={statusText}
          />
          <span className={cn("text-xs font-semibold", colorSub)}>
            {statusText}
          </span>
        </div>
      </div>
    </button>
  );
};
