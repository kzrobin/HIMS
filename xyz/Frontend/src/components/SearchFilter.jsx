import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchFilter = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = () => {
    onSearch({ searchTerm, selectedCategory });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("");
    onSearch({ searchTerm: "", selectedCategory: "" });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white shadow p-4 rounded-lg mt-4">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-1/4">
        <select
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex w-full md:w-auto gap-2">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
