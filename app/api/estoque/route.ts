import { NextResponse } from 'next/server';
import * as service from '@/services/estoque.service';

export async function GET() {
  try {
    const estoque = await service.getAllEstoque();
    const estoqueSerialized = estoque.map(item => {
      return JSON.parse(
        JSON.stringify(item, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
    });
    return NextResponse.json(estoqueSerialized);
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Falha ao buscar estoque', details: errorMessage },
      { status: 500 }
    );
  }
}
