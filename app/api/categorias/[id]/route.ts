import { NextResponse } from 'next/server';
import * as service from '@/services/categorias.service';

interface Params {
  params: Promise<{ id: string; }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    const categoria = await service.getCategoriaById(id);
    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    const categoriaSerialized = {
      ...categoria,
      id: categoria.id.toString()
    };
    return NextResponse.json(categoriaSerialized);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
}

export async function PUT(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    const body = await request.json();
    const { nome, descricao } = body;

    const updatedCategoria = await service.updateCategoria(id, { nome, descricao });
    const updatedCategoriaSerialized = {
      ...updatedCategoria,
      id: updatedCategoria.id.toString()
    };
    return NextResponse.json(updatedCategoriaSerialized);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Categoria não encontrada para atualização' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Falha ao atualizar categoria' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    await service.deleteCategoria(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Categoria não encontrada para exclusão' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Falha ao excluir categoria' }, { status: 500 });
  }
}
