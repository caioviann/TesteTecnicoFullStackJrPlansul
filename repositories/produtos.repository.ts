import prisma from '@/lib/db';
import { produtos } from '@/generated/prisma/client';

export const findAll = async (): Promise<produtos[]> => {
  return prisma.produtos.findMany({
    include: { categorias: true },
  });
};

export const findById = async (id: bigint): Promise<produtos | null> => {
  return prisma.produtos.findUnique({
    where: { id },
    include: { categorias: true },
  });
};

export const create = async (data: Omit<produtos, 'id' | 'criado_em'>): Promise<produtos> => {
  const { sku, nome, categoria_id, estoque_minimo, marca } = data;

  return prisma.produtos.create({
    data: {
      sku,
      nome,
      categoria_id,
      estoque_minimo,
      marca,
    },
  });
};

export const update = async (id: bigint, data: Partial<Omit<produtos, 'id' | 'criado_em'>>): Promise<produtos> => {
  return prisma.produtos.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<produtos> => {
  return prisma.produtos.delete({
    where: { id },
  });
};
