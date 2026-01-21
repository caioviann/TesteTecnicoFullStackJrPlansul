import { NextResponse } from 'next/server';
import * as service from '@/services/categorias.service';

export async function GET() {
  const categorias = await service.getAllCategorias();
  const categoriasSerialized = categorias.map(categoria => {
    return JSON.parse(
      JSON.stringify(categoria, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  });
  return NextResponse.json(categoriasSerialized);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao } = body;
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }
    const newCategoria = await service.createCategoria({ nome, descricao });
    const newCategoriaSerialized = {
      ...newCategoria,
      id: newCategoria.id.toString()
    };
    return NextResponse.json(newCategoriaSerialized, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha ao criar categoria' }, { status: 500 });
  }
}
