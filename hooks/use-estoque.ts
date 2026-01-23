import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

// Zod Schemas
export const createMovimentacaoSchema = z.object({
  produto_id: z.string().min(1, "Produto é obrigatório"),
  quantidade: z.coerce.number().int().min(1, "quantidade deve ser maior que zero"),
  tipo: z.enum(["entrada", "saida"], {
    required_error: "tipo é obrigatório",
    invalid_type_error: "tipo deve ser 'entrada' ou 'saida'",
  }),
});

// Types
export type Estoque = {
  id: string;
  produto_id: string;
  quantidade: number;
  atualizado_em: string;
  produtos: {
    id: string;
    sku: string;
    nome: string;
    estoque_minimo: number | null;
    categorias: {
      id: string;
      nome: string;
    } | null;
  };
};

export type Movimentacao = {
  id: string;
  produto_id: string;
  quantidade: number;
  tipo: "entrada" | "saida";
  criado_em: string;
  produtos: {
    id: string;
    sku: string;
    nome: string;
    categorias: {
      id: string;
      nome: string;
    } | null;
  };
};

export type CreateMovimentacaoPayload = z.infer<typeof createMovimentacaoSchema>;

// API Functions
const fetchEstoque = async (): Promise<Estoque[]> => {
  const response = await fetch("/api/estoque");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch estoque");
  }
  return response.json();
};

const fetchMovimentacoes = async (): Promise<Movimentacao[]> => {
  const response = await fetch("/api/estoque-movimentacoes");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch movimentacoes");
  }
  return response.json();
};

const createMovimentacao = async (
  payload: CreateMovimentacaoPayload
): Promise<Movimentacao> => {
  const response = await fetch("/api/estoque-movimentacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || errorData.details || "Failed to create movimentacao";
    throw new Error(errorMessage);
  }
  return response.json();
};

// React Query Hooks
export const useEstoque = () => {
  return useQuery<Estoque[], Error>({
    queryKey: ["estoque"],
    queryFn: fetchEstoque,
  });
};

export const useMovimentacoes = () => {
  return useQuery<Movimentacao[], Error>({
    queryKey: ["movimentacoes"],
    queryFn: fetchMovimentacoes,
  });
};

export const useCreateMovimentacao = () => {
  const queryClient = useQueryClient();
  return useMutation<Movimentacao, Error, CreateMovimentacaoPayload>({
    mutationFn: createMovimentacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
    },
  });
};
