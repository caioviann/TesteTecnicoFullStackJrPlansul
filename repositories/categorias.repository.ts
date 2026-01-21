import prisma from '@/lib/db';
import { categorias } from '@/generated/prisma/client';

export const findAll = async (): Promise<categorias[]> => {
  return prisma.categorias.findMany();
};

export const findById = async (id: bigint): Promise<categorias | null> => {
  return prisma.categorias.findUnique({
    where: { id },
  });
};

export const create = async (data: Omit<categorias, 'id' | 'criado_em'>): Promise<categorias> => {
  return prisma.categorias.create({
    data,
  });
};

export const update = async (id: bigint, data: Partial<Omit<categorias, 'id' | 'criado_em'>>): Promise<categorias> => {
  return prisma.categorias.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<categorias> => {
  return prisma.categorias.delete({
    where: { id },
  });
};
