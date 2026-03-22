import React, { useState, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

function Dropdown({ label, options, isOpen, onToggle, onSelect, selected }) {
  return (
    <div className="relative w-48">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full border border-gray-300 px-4 py-2 bg-white text-black"
      >
        {selected || label}
        <ChevronDown className="h-4" />
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full max-h-60 overflow-y-auto border border-gray-200 bg-white shadow-lg z-10 text-black">
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => onSelect(label, opt)}
              className="px-3 py-2 hover:bg-gray-100 bg-slate-100 m-2 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// A dedicated component for the price range slider
function PriceRangeSlider({ min, max, value, onChange }) {
  const handleSliderChange = (e) => {
    onChange(parseInt(e.target.value));
  };
  
  // If no value is set, default to the max price
  const displayValue = value || max;

  return (
  
    <div className="w-56">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price Range: ₹{min} - ₹{displayValue}
        </label>
        <input
            id="price"
            type="range"
            min={min}
            max={max}
            value={displayValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
    </div>
  );
}

export default function FilterBar({ selectedFilters, onFilterChange, onReset, priceConfig }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState(selectedFilters.search || "");

  useEffect(() => {
    setSearchTerm(selectedFilters.search || "");
  }, [selectedFilters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only fire if the debounced term differs from the one in selectedFilters
      if (searchTerm !== (selectedFilters.search || "")) {
        onFilterChange((prev) => ({ ...prev, search: searchTerm }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedFilters.search, onFilterChange]);

  const filterOptions = {
    "Sort by": ["Popularity", "Newest", "Price: Low to High", "Price: High to Low"],
    Brand: ["Nike", "Adidas", "Puma", "New Balance", "Crocs"],
    Color: ["Black", "White", "Blue", "Red", "Green", "Grey"],
    Gender: ["Men", "Women"],
  };

  const handleToggle = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleSelect = (label, value) => {
    onFilterChange((prev) => ({ ...prev, [label]: value }));
    setOpenDropdown(null);
  };
  
  const handlePriceChange = (priceValue) => {
    onFilterChange((prev) => ({...prev, price: priceValue}));
  };

  return (
    <div className="flex flex-wrap items-center gap-4 px-20 bg-white shadow-sm py-3 border-b border-gray-100">
      
      {/* Search Input */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm text-black transition-colors duration-200"
        />
      </div>

      {Object.entries(filterOptions).map(([label, options], idx) => (
        <Dropdown
          key={idx}
          label={label}
          options={options}
          isOpen={openDropdown === label}
          onToggle={() => handleToggle(label)}
          onSelect={handleSelect}
          selected={selectedFilters[label]}
        />
      ))}
      
      {/* Render the Price Slider */}
      <PriceRangeSlider 
        min={priceConfig.min}
        max={priceConfig.max}
        value={selectedFilters.price}
        onChange={handlePriceChange}
      />

      <button 
        onClick={onReset}
        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
      >
        <X size={16} className="mr-1"/>
        Reset
      </button>
    </div>
   
  );
}