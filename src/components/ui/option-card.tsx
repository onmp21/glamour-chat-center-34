
import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  isDarkMode?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  isDarkMode,
}) => {
  const bg = isDarkMode ? "#232323" : "#f3f3f3";
  const txt = isDarkMode ? "text-white" : "text-gray-900";
  const subtxt = isDarkMode ? "text-gray-400" : "text-gray-600";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between rounded-xl p-4 my-1 hover:scale-105 active:scale-100 transition-transform duration-200 cursor-pointer",
        "border",
        isDarkMode ? "border-[#343434]" : "border-[#e0e0e0]"
      )}
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg w-10 h-10 flex items-center justify-center text-xl" style={{ background: isDarkMode ? "#121212" : "#ececec" }}>
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span className={cn("text-base font-semibold", txt)}>{title}</span>
          {subtitle && <span className={cn("text-xs", subtxt)}>{subtitle}</span>}
        </div>
      </div>
      <ChevronRight size={22} className={isDarkMode ? "text-gray-300" : "text-gray-400"} />
    </button>
  );
};
