"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import React, { useState } from "react";

interface FilterPopoverProps {
  children: React.ReactNode;
  hasActiveFilters?: boolean;
}

export function FilterPopover({
  children,
  hasActiveFilters = false,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4" />
        Filtros
        {hasActiveFilters && (
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
            ✓
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-md border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4">
              <div className="text-sm font-semibold">Filtrar por</div>
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
