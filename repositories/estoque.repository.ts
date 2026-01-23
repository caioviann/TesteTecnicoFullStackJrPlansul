import prisma from '@/lib/db';
import { estoque } from '@/generated/prisma/client';

export const findAll = async (): Promise<estoque[]> => {
  return prisma.estoque.findMany({
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
  });
};

export const findByProdutoId = async (produto_id: bigint): Promise<estoque | null> => {
  return prisma.estoque.findUnique({
    where: { produto_id },
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
  });
};

export const updateQuantidade = async (produto_id: bigint, quantidade: number): Promise<estoque> => {
  return prisma.estoque.upsert({
    where: { produto_id },
    update: {
      quantidade,
      atualizado_em: new Date(),
    },
    create: {
      produto_id,
      quantidade,
    },
    include: {
      produtos: {
        include: {
          categorias: true,
        },
      },
    },
  });
};
