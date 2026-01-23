"use client";

import * as z from "zod";
import { useCreateMovimentacao, createMovimentacaoSchema } from "@/hooks/use-estoque";
import { useProdutos } from "@/hooks/use-produtos";
import { BaseModal } from "@/components/custom/base-modal";
import { DynamicForm } from "@/components/custom/dynamic-form";
import { toast } from "sonner";

export function AddMovimentacaoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const createMovimentacaoMutation = useCreateMovimentacao();
  const { data: produtos } = useProdutos();

  const produtoOptions =
    produtos?.map((prod) => ({
      label: `${prod.sku} - ${prod.nome}`,
      value: prod.id,
    })) || [];

  const tipoOptions = [
    { label: "Entrada", value: "entrada" },
    { label: "Saída", value: "saida" },
  ];

  const formFields = [
    {
      name: "produto_id" as const,
      label: "Produto",
      placeholder: "Selecione um produto",
      component: "select" as const,
      options: produtoOptions,
    },
    {
      name: "tipo" as const,
      label: "Tipo",
      placeholder: "Selecione o tipo",
      component: "select" as const,
      options: tipoOptions,
    },
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "0",
      type: "number",
      component: "input" as const,
    },
  ];

  const handleSubmit = (data: z.infer<typeof createMovimentacaoSchema>) => {
    createMovimentacaoMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Movimentação criada com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao criar movimentação: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title="Nova Movimentação"
      description="Registre uma nova movimentação de estoque (entrada ou saída)."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={createMovimentacaoSchema}
        onSubmit={handleSubmit}
        fields={formFields}
        defaultValues={{
          produto_id: "",
          tipo: "entrada",
          quantidade: 1,
        }}
        submitButtonText="Criar Movimentação"
        isSubmitting={createMovimentacaoMutation.isPending}
      />
    </BaseModal>
  );
}
