"use client";

import { useState } from "react";
import { useEstoque } from "@/hooks/use-estoque";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { estoqueColumns } from "@/components/estoque/estoque-columns";
import { AddMovimentacaoModal } from "@/components/estoque/movimentacao-add-modal";

export function EstoqueView() {
  const { data: estoque, isLoading, isError, error } = useEstoque();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        data={estoque || []}
        isLoading={isLoading}
        searchComponent={
          <Input placeholder="Buscar estoque..." className="max-w-sm" />
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
