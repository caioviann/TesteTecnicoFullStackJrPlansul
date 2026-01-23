import prisma from '@/lib/db';
import { estoque_movimentacoes, tipo_movimentacao } from '@/generated/prisma/client';

export const findAll = async (): Promise<estoque_movimentacoes[]> => {
  return prisma.estoque_movimentacoes.findMany({
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
    orderBy: {
      criado_em: 'desc',
    },
  });
};

export const findByProdutoId = async (produto_id: bigint): Promise<estoque_movimentacoes[]> => {
  return prisma.estoque_movimentacoes.findMany({
    where: { produto_id },
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
    orderBy: {
      criado_em: 'desc',
    },
  });
};

export const create = async (data: {
  produto_id: bigint;
  quantidade: number;
  tipo: tipo_movimentacao;
}): Promise<estoque_movimentacoes> => {
  return prisma.estoque_movimentacoes.create({
    data,
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
  });
};
