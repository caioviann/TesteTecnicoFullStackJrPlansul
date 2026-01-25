"use client";

import { useState, useMemo } from "react";
import { useEstoque } from "@/hooks/use-estoque";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { estoqueColumns } from "@/components/estoque/estoque-columns";
import { AddMovimentacaoModal } from "@/components/estoque/movimentacao-add-modal";
import { FilterPopover } from "@/components/custom/filter-popover";
import { FilterCheckboxGroup } from "@/components/custom/filter-checkbox-group";

export function EstoqueView() {
  const { data: estoque, isLoading, isError, error } = useEstoque();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  // Filtrar e buscar estoque
  const filteredEstoque = useMemo(() => {
    if (!estoque) return [];

    const searchLower = searchText.toLowerCase().trim();

    return estoque.filter((item) => {
      const matchesSearch =
        searchLower === "" ||
        item.produtos.nome.toLowerCase().includes(searchLower) ||
        item.produtos.sku.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategories.size === 0 ||
        (item.produtos.categorias &&
          selectedCategories.has(item.produtos.categorias.id));

      return matchesSearch && matchesCategory;
    });
  }, [estoque, searchText, selectedCategories]);

  // Extrair opções de categorias
  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, number>();
    estoque?.forEach((item) => {
      if (item.produtos.categorias) {
        const catId = item.produtos.categorias.id;
        categoryMap.set(catId, (categoryMap.get(catId) || 0) + 1);
      }
    });

    return Array.from(categoryMap.entries())
      .map(([id, count]) => ({
        value: id,
        label: estoque
          ?.find((e) => e.produtos.categorias?.id === id)
          ?.produtos.categorias?.nome || "N/A",
        count,
      }))
      .filter((opt) => opt.label !== "N/A");
  }, [estoque]);

  const hasActiveFilters = selectedCategories.size > 0 || searchText.length > 0;

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoque."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={estoqueColumns}
        data={filteredEstoque}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar por nome ou SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm"
          />
        }
        filterComponent={
          <FilterPopover hasActiveFilters={hasActiveFilters}>
            <FilterCheckboxGroup
              label="Categoria"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
            />
          </FilterPopover>
        }
        actionButtons={[
          <Button key="new-movimentacao" onClick={() => setIsAddModalOpen(true)}>
            Nova Movimentação
          </Button>,
        ]}
      />

      <AddMovimentacaoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
