import * as repository from '@/repositories/estoque-movimentacoes.repository';
import { estoque_movimentacoes, $Enums } from '@/generated/prisma/client';
import prisma from '@/lib/db';

export const getAllMovimentacoes = async (): Promise<estoque_movimentacoes[]> => {
  return repository.findAll();
};

export const getMovimentacoesByProdutoId = async (produto_id: bigint): Promise<estoque_movimentacoes[]> => {
  return repository.findByProdutoId(produto_id);
};

export const createMovimentacao = async (data: {
  produto_id: bigint;
  quantidade: number;
  tipo: $Enums.tipo_movimentacao;
}): Promise<estoque_movimentacoes> => {
  const { produto_id: rawProdutoId, quantidade, tipo } = data;

  const result = await prisma.$transaction(async (tx) => {
    const produto_id = typeof rawProdutoId === 'bigint' ? rawProdutoId : BigInt(rawProdutoId as any);

    const existingEstoque = await tx.estoque.findUnique({ where: { produto_id } });
    const currentQuantidade = existingEstoque ? Number(existingEstoque.quantidade) : 0;
    const delta = tipo === 'entrada' ? Number(quantidade) : -Number(quantidade);
    const newQuantidade = currentQuantidade + delta;

    if (newQuantidade < 0) {
      throw new Error('Quantidade em estoque não pode ficar negativa');
    }

    await tx.estoque.upsert({
      where: { produto_id },
      update: {
        quantidade: newQuantidade,
        atualizado_em: new Date(),
      },
      create: {
        produto_id,
        quantidade: newQuantidade,
      },
    });

    const movimentacao = await tx.estoque_movimentacoes.create({
      data: {
        produto_id,
        quantidade: Number(quantidade),
        tipo,
      },
      include: {
        produtos: {
          include: {
            categorias: true,
          },
        },
      },
    });

    return movimentacao;
  });

  return result;
};
