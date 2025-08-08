import { Search } from "lucide-react";
import React from "react";

const SearchBar = React.memo<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
}>(({ searchTerm, onSearchChange }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-200 dark:bg-zinc-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 transition-all duration-200"
        />
      </div>
    </div>
  );
});

export default SearchBar;