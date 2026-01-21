"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Categoria } from "@/hooks/use-categorias";

export const categoriaColumns: ColumnDef<Categoria>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "criado_em",
    header: "Criado Em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
];
