"use client";

import { useState } from "react";
import { useCategories, Categoria } from "@/hooks/use-categorias";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoriaColumns } from "@/components/categorias/categoria-columns";
import { AddCategoryModal } from "@/components/categorias/categoria-add-modal";
import { EditCategoryModal } from "@/components/categorias/categoria-edit-modal";
import { DeleteCategoryDialog } from "@/components/categorias/categoria-delete-dialog";

export function CategoriasView() {
  const { data: categories, isLoading, isError, error } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null,
  );

  const handleEdit = (id: string) => {
    const categoryToEdit = categories?.find((cat) => cat.id === id);
    if (categoryToEdit) {
      setSelectedCategory(categoryToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCategoryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load categories."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={categoriaColumns}
        data={categories || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchComponent={
          <Input placeholder="Buscar categorias..." className="max-w-sm" />
        }
        actionButtons={[
          <Button key="new-category" onClick={() => setIsAddModalOpen(true)}>
            Nova Categoria
          </Button>,
        ]}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        categoryId={categoryIdToDelete}
      />
    </>
  );
}
