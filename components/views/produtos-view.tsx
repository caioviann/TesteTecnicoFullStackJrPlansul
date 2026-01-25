"use client";

import { useState, useMemo } from "react";
import { useProdutos, Produto } from "@/hooks/use-produtos";
import { useCategories } from "@/hooks/use-categorias";
import { DataTable } from "@/components/custom/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { produtoColumns } from "@/components/produtos/produto-columns";
import { AddProductModal } from "@/components/produtos/produto-add-modal";
import { EditProductModal } from "@/components/produtos/produto-edit-modal";
import { DeleteProductDialog } from "@/components/produtos/produto-delete-dialog";
import { FilterPopover } from "@/components/custom/filter-popover";
import { FilterCheckboxGroup } from "@/components/custom/filter-checkbox-group";

export function ProdutosView() {
  const { data: produtos, isLoading, isError, error } = useProdutos();
  const { data: categories } = useCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedMarcas, setSelectedMarcas] = useState<Set<string>>(
    new Set()
  );

  const handleEdit = (id: string) => {
    const productToEdit = produtos?.find((prod) => prod.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Filtrar e buscar produtos
  const filteredProdutos = useMemo(() => {
    if (!produtos) return [];

    return produtos.filter((produto) => {
      // Busca por nome ou SKU
      const searchLower = searchText.toLowerCase().trim();
      const matchesSearch =
        searchLower === "" ||
        produto.nome.toLowerCase().includes(searchLower) ||
        produto.sku.toLowerCase().includes(searchLower);

      // Filtro por categoria
      const matchesCategory =
        selectedCategories.size === 0 ||
        selectedCategories.has(produto.categoria_id || "null");

      // Filtro por marca
      const matchesMarca =
        selectedMarcas.size === 0 ||
        selectedMarcas.has(produto.marca || "Generico");

      return matchesSearch && matchesCategory && matchesMarca;
    });
  }, [produtos, searchText, selectedCategories, selectedMarcas]);

  // Extrair opções de categorias
  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, number>();
    produtos?.forEach((p) => {
      const catId = p.categoria_id || "null";
      categoryMap.set(catId, (categoryMap.get(catId) || 0) + 1);
    });

    return categories
      ? categories.map((cat) => ({
          value: cat.id,
          label: cat.nome,
          count: categoryMap.get(cat.id) || 0,
        }))
      : [];
  }, [categories, produtos]);

  // Extrair opções de marcas
  const marcaOptions = useMemo(() => {
    const marcaMap = new Map<string, number>();
    produtos?.forEach((p) => {
      const marca = p.marca || "Generico";
      marcaMap.set(marca, (marcaMap.get(marca) || 0) + 1);
    });

    return Array.from(marcaMap.entries())
      .map(([marca, count]) => ({
        value: marca,
        label: marca,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [produtos]);

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedMarcas.size > 0 ||
    searchText.length > 0;

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load products."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={produtoColumns}
        data={filteredProdutos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar por nome ou SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm"
          />
        }
        filterComponent={
          <FilterPopover hasActiveFilters={hasActiveFilters}>
            <FilterCheckboxGroup
              label="Categoria"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
            />
            <FilterCheckboxGroup
              label="Marca"
              options={marcaOptions}
              selectedValues={selectedMarcas}
              onChange={setSelectedMarcas}
              searchable
            />
          </FilterPopover>
        }
        actionButtons={[
          <Button key="new-product" onClick={() => setIsAddModalOpen(true)}>
            Novo Produto
          </Button>,
        ]}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productIdToDelete}
      />
    </>
  );
}
