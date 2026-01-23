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
    console.error(error);
    return NextResponse.json({ error: 'Falha ao buscar estoque' }, { status: 500 });
  }
}
