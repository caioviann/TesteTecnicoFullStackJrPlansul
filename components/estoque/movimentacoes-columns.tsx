"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Movimentacao } from "@/hooks/use-estoque";
import { Badge } from "@/components/ui/badge";

export const movimentacoesColumns: ColumnDef<Movimentacao>[] = [
  {
    accessorKey: "criado_em",
    header: "Data/Hora",
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
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
    accessorKey: "produtos.sku",
    header: "SKU",
    cell: ({ row }) => {
      return row.original.produtos.sku;
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return (
        <Badge variant={tipo === "entrada" ? "default" : "destructive"}>
          {tipo === "entrada" ? "Entrada" : "Saída"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.quantidade}</span>;
    },
  },
];
