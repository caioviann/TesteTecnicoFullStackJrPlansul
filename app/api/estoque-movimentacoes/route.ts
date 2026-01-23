import { NextResponse } from 'next/server';
import * as service from '@/services/estoque-movimentacoes.service';
import { $Enums } from '@/generated/prisma/client';

export async function GET() {
  try {
    const movimentacoes = await service.getAllMovimentacoes();
    const movimentacoesSerialized = movimentacoes.map(movimentacao => {
      return JSON.parse(
        JSON.stringify(movimentacao, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
    });
    return NextResponse.json(movimentacoesSerialized);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Falha ao buscar movimentações', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produto_id, quantidade, tipo } = body;

    if (!produto_id) {
      return NextResponse.json({ error: 'produto_id é obrigatório' }, { status: 400 });
    }

    if (!quantidade || quantidade <= 0) {
      return NextResponse.json({ error: 'Quantidade deve ser maior que zero' }, { status: 400 });
    }

    if (!tipo || (tipo !== 'entrada' && tipo !== 'saida')) {
      return NextResponse.json({ error: 'Tipo deve ser "entrada" ou "saida"' }, { status: 400 });
    }

    const newMovimentacao = await service.createMovimentacao({
      produto_id: BigInt(produto_id),
      quantidade: Number(quantidade),
      tipo: tipo as $Enums.tipo_movimentacao,
    });

    const newMovimentacaoSerialized = JSON.parse(
      JSON.stringify(newMovimentacao, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json(newMovimentacaoSerialized, { status: 201 });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Falha ao criar movimentação';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
