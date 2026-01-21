"use client";

import * as z from "zod";
import { useCreateCategory, createCategoriaSchema } from "@/hooks/use-categorias";
import { BaseModal } from "@/components/custom/base-modal";
import { DynamicForm } from "@/components/custom/dynamic-form";
import { toast } from "sonner";

export function AddCategoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createCategoryMutation = useCreateCategory();

  const formFields = [
    {
      name: "nome" as const,
      label: "Nome",
      placeholder: "Nome da Categoria",
      component: "input" as const,
    },
    {
      name: "descricao" as const,
      label: "Descrição",
      placeholder: "Descrição da Categoria (opcional)",
      component: "input" as const,
    },
  ];

  const handleSubmit = (data: z.infer<typeof createCategoriaSchema>) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Categoria criada com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao criar categoria: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title="Nova Categoria"
      description="Preencha os detalhes para criar uma nova categoria."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={createCategoriaSchema}
        onSubmit={handleSubmit}
        defaultValues={{ nome: "", descricao: "" }}
        fields={formFields}
        submitButtonText="Criar Categoria"
        isSubmitting={createCategoryMutation.isPending}
      />
    </BaseModal>
  );
}
