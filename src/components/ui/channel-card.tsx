
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
  compact?: boolean;
  className?: string;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  count,
  isDarkMode,
  onClick,
  compact = true,
  className
}) => {
  // Cores minimalistas baseadas em modo
  const bg = isDarkMode ? "#18181b" : "#f9fafb";
  const border = isDarkMode ? "#3f3f46" : "#e5e7eb";
  const colorTitle = isDarkMode ? "text-white" : "text-gray-900";
  const colorSub = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textCount = count !== undefined ? `${count} conversas` : "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between rounded-lg border px-3 py-2 transition-all duration-150 cursor-pointer hover:scale-[1.02]",
        "min-h-[48px]",
        className
      )}
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex flex-col items-start min-w-0">
        <div className={cn("font-medium truncate text-sm", colorTitle)}>
          {name}
        </div>
        <span className={cn("text-xs mt-0.5", colorSub)}>
          {textCount}
        </span>
      </div>
    </button>
  );
};
