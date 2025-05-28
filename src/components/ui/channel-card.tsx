
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
        "w-full flex flex-col items-center justify-center rounded-lg border p-4 transition-all duration-150 cursor-pointer hover:scale-[1.02] relative group",
        "min-h-[80px] text-center space-y-2",
        className
      )}
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex flex-col items-center space-y-1 flex-1 justify-center">
        <div className={cn("font-medium text-sm", colorTitle)}>
          {name}
        </div>
        <span className={cn("text-xs", colorSub)}>
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
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
            isPinned && "opacity-100",
            isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
          )}
        >
          <Pin 
            size={12} 
            className={cn(
              isPinned ? "text-[#b5103c] fill-current" : (isDarkMode ? "text-gray-400" : "text-gray-600")
            )} 
          />
        </button>
      )}
    </button>
  );
};
