"use client";

import { useDeleteCategory } from "@/hooks/use-categorias";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  categoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
}) {
  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = () => {
    if (!categoryId) return;
    deleteCategoryMutation.mutate(categoryId, {
      onSuccess: () => {
        toast.success("Categoria excluída com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao excluir categoria: ${error.message}`);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a
            categoria.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
          >
            {deleteCategoryMutation.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
