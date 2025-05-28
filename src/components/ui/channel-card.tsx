
import React from "react";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";

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
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  count,
  isDarkMode,
  onClick,
  compact = true,
  className,
  isPinned = false,
  onTogglePin
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
        "w-full flex items-center justify-between rounded-lg border px-3 py-2 transition-all duration-150 cursor-pointer hover:scale-[1.02] relative group",
        "min-h-[48px]",
        className
      )}
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex flex-col items-start min-w-0 flex-1">
        <div className={cn("font-medium truncate text-sm", colorTitle)}>
          {name}
        </div>
        <span className={cn("text-xs mt-0.5", colorSub)}>
          {textCount}
        </span>
      </div>
      
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
            isPinned && "opacity-100",
            isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
          )}
        >
          <Pin 
            size={14} 
            className={cn(
              isPinned ? "text-[#b5103c]" : (isDarkMode ? "text-gray-400" : "text-gray-600")
            )} 
          />
        </button>
      )}
    </button>
  );
};
