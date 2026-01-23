"use client";

import { useState } from "react";
import { useMovimentacoes } from "@/hooks/use-estoque";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { movimentacoesColumns } from "@/components/estoque/movimentacoes-columns";
import { AddMovimentacaoModal } from "@/components/estoque/movimentacao-add-modal";

export function MovimentacoesView() {
  const { data: movimentacoes, isLoading, isError, error } = useMovimentacoes();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        data={movimentacoes || []}
        isLoading={isLoading}
        searchComponent={
          <Input placeholder="Buscar movimentações..." className="max-w-sm" />
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
