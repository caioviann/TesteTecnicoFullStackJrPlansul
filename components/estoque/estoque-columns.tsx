"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Estoque } from "@/hooks/use-estoque";
import { Badge } from "@/components/ui/badge";

export const estoqueColumns: ColumnDef<Estoque>[] = [
  {
    accessorKey: "produtos.sku",
    header: "SKU",
    cell: ({ row }) => {
      return row.original.produtos.sku;
    },
  },
  {
    accessorKey: "produtos.nome",
    header: "Produto",
    cell: ({ row }) => {
      return row.original.produtos.nome;
    },
  },
  {
    accessorKey: "produtos.categorias.nome",
    header: "Categoria",
    cell: ({ row }) => {
      const categoria = row.original.produtos.categorias;
      return categoria ? categoria.nome : "N/A";
    },
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.quantidade}</span>;
    },
  },
  {
    accessorKey: "produtos.estoque_minimo",
    header: "Estoque Mínimo",
    cell: ({ row }) => {
      return row.original.produtos.estoque_minimo ?? 0;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const quantidade = row.original.quantidade;
      const estoqueMinimo = row.original.produtos.estoque_minimo ?? 0;
      const isLowStock = quantidade <= estoqueMinimo;

      return (
        <Badge variant={isLowStock ? "destructive" : "default"}>
          {isLowStock ? "Estoque Baixo" : "Normal"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "atualizado_em",
    header: "Atualizado Em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("atualizado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
];
