import React from "react";
import { Search } from "lucide-react";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  value,
  onChange,
  placeholder = "Filter...",
}) => {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-2 py-1.5 w-full text-sm border border-gray-300 rounded-md focus:ring-2"
        autoFocus
      />
    </div>
  );
};
