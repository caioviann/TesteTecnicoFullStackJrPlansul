"use client";

import { useState, useMemo } from "react";
import { useMovimentacoes } from "@/hooks/use-estoque";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { movimentacoesColumns } from "@/components/estoque/movimentacoes-columns";
import { AddMovimentacaoModal } from "@/components/estoque/movimentacao-add-modal";
import { FilterPopover } from "@/components/custom/filter-popover";
import { FilterCheckboxGroup } from "@/components/custom/filter-checkbox-group";

export function MovimentacoesView() {
  const { data: movimentacoes, isLoading, isError, error } = useMovimentacoes();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedTipos, setSelectedTipos] = useState<Set<string>>(new Set());

  const filteredMovimentacoes = useMemo(() => {
    if (!movimentacoes) return [];

    const searchLower = searchText.toLowerCase().trim();

    return movimentacoes.filter((mov) => {
      const matchesSearch =
        searchLower === "" ||
        mov.produtos.nome.toLowerCase().includes(searchLower) ||
        mov.produtos.sku.toLowerCase().includes(searchLower);

      const matchesTipo =
        selectedTipos.size === 0 || selectedTipos.has(mov.tipo);

      return matchesSearch && matchesTipo;
    });
  }, [movimentacoes, searchText, selectedTipos]);

  const tipoOptions = useMemo(() => {
    const tipoMap = new Map<string, number>();
    movimentacoes?.forEach((mov) => {
      tipoMap.set(mov.tipo, (tipoMap.get(mov.tipo) || 0) + 1);
    });

    return Array.from(tipoMap.entries())
      .map(([tipo, count]) => ({
        value: tipo,
        label: tipo === "entrada" ? "Entrada" : "Saída",
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [movimentacoes]);

  const hasActiveFilters = selectedTipos.size > 0 || searchText.length > 0;

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load movimentacoes."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={movimentacoesColumns}
        data={filteredMovimentacoes}
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
              label="Tipo de Movimentação"
              options={tipoOptions}
              selectedValues={selectedTipos}
              onChange={setSelectedTipos}
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
