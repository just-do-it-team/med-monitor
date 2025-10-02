import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortDirection = "asc" | "desc" | null | undefined;

interface SortButtonProps {
  direction: SortDirection;
  onClick: () => void;
}

export const SortButton: React.FC<SortButtonProps> = ({
  direction,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="ml-1 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      aria-label={direction === "asc" ? "Sort descending" : "Sort ascending"}
    >
      {direction === "asc" ? (
        <ChevronUp size={16} className="text-blue-600" />
      ) : direction === "desc" ? (
        <ChevronDown size={16} className="text-blue-600" />
      ) : (
        <div className="relative h-4 w-4 opacity-30 hover:opacity-100">
          <ChevronUp size={14} className="absolute top-[-5px]" />
          <ChevronDown size={14} className="absolute top-[5px]" />
        </div>
      )}
    </button>
  );
};
