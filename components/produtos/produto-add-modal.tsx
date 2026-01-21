"use client";

import * as z from "zod";
import { useCreateProduto, createProdutoSchema } from "@/hooks/use-produtos";
import { useCategories } from "@/hooks/use-categorias";
import { BaseModal } from "@/components/custom/base-modal";
import { DynamicForm } from "@/components/custom/dynamic-form";
import { toast } from "sonner";

export function AddProductModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createProdutoMutation = useCreateProduto();
  const { data: categories } = useCategories();

  const categoryOptions =
    categories?.map((cat) => ({
      label: cat.nome,
      value: cat.id,
    })) || [];

  const formFields = [
    {
      name: "nome" as const,
      label: "Nome",
      placeholder: "Nome do Produto",
      component: "input" as const,
    },
    {
      name: "sku" as const,
      label: "SKU",
      placeholder: "SKU do Produto",
      component: "input" as const,
    },
    {
      name: "categoria_id" as const,
      label: "Categoria",
      placeholder: "Selecione uma categoria",
      component: "select" as const,
      options: categoryOptions,
    },
    {
      name: "estoque_minimo" as const,
      label: "Estoque Mínimo",
      placeholder: "0",
      type: "number",
      component: "input" as const,
    },
    {
      name: "marca" as const,
      label: "Marca",
      placeholder: "Marca do Produto (opcional)",
      component: "input" as const,
    },
  ];

  const handleSubmit = (data: z.infer<typeof createProdutoSchema>) => {
    createProdutoMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Produto criado com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao criar produto: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title="Novo Produto"
      description="Preencha os detalhes para criar um novo produto."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={createProdutoSchema}
        onSubmit={handleSubmit}
        fields={formFields}
        defaultValues={{
          nome: "",
          sku: "",
          categoria_id: "",
          estoque_minimo: 0,
          marca: "",
        }}
        submitButtonText="Criar Produto"
        isSubmitting={createProdutoMutation.isPending}
      />
    </BaseModal>
  );
}
