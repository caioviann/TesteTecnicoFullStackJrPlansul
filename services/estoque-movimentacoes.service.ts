import * as repository from '@/repositories/estoque-movimentacoes.repository';
import * as estoqueRepository from '@/repositories/estoque.repository';
import * as produtosRepository from '@/repositories/produtos.repository';
import prisma from '@/lib/db';
import { estoque_movimentacoes, $Enums } from '@/generated/prisma/client';

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
  const { produto_id, quantidade, tipo } = data;

  // Validar quantidade
  if (quantidade <= 0) {
    throw new Error('Quantidade deve ser maior que zero');
  }

  // Verificar se o produto existe
  const produto = await produtosRepository.findById(produto_id);
  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  // Buscar estoque atual do produto
  const estoqueAtual = await estoqueRepository.findByProdutoId(produto_id);
  const quantidadeAtual = estoqueAtual?.quantidade || 0;

  // Validar saída: verificar se há estoque suficiente
  if (tipo === $Enums.tipo_movimentacao.saida) {
    if (quantidadeAtual < quantidade) {
      throw new Error(`Estoque insuficiente. Disponível: ${quantidadeAtual}, Solicitado: ${quantidade}`);
    }
  }

  // Calcular nova quantidade
  const novaQuantidade =
    tipo === $Enums.tipo_movimentacao.entrada
      ? quantidadeAtual + quantidade
      : quantidadeAtual - quantidade;

  // Executar transação: criar movimentação e atualizar estoque
  return prisma.$transaction(async (tx) => {
    // Criar movimentação
    const movimentacao = await tx.estoque_movimentacoes.create({
      data: {
        produto_id,
        quantidade,
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

    // Atualizar ou criar estoque
    await tx.estoque.upsert({
      where: { produto_id },
      update: {
        quantidade: novaQuantidade,
        atualizado_em: new Date(),
      },
      create: {
        produto_id,
        quantidade: novaQuantidade,
      },
    });

    return movimentacao;
  });
};
