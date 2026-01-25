"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterCheckboxGroupProps {
  label: string;
  options: FilterOption[];
  selectedValues: Set<string>;
  onChange: (values: Set<string>) => void;
  searchable?: boolean;
}

export function FilterCheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  searchable = false,
}: FilterCheckboxGroupProps) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleChange = (value: string) => {
    const newSet = new Set(selectedValues);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    onChange(newSet);
  };

  const handleClear = () => {
    onChange(new Set());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        {selectedValues.size > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-blue-600 hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      {searchable && (
        <Input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-xs"
        />
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {filteredOptions.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`filter-${label}-${option.value}`}
              checked={selectedValues.has(option.value)}
              onChange={() => handleChange(option.value)}
              className="rounded border-gray-300 text-blue-600"
            />
            <label
              htmlFor={`filter-${label}-${option.value}`}
              className="flex-1 text-xs text-gray-700 cursor-pointer"
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-gray-500">({option.count})</span>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
