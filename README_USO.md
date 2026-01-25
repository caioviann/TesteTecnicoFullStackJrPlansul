# Guia Rápido de Execução

## Requisitos

- **Node.js** v18.0.0 ou superior
- **npm** v9.0.0 ou superior
- **PostgreSQL** v12.0 ou superior (ou Docker)

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"
```

### 3. Iniciar o Banco de Dados

**Opção A: Com Docker (Recomendado)**

```bash
docker-compose up -d
```

**Opção B: PostgreSQL Local**

```bash
createdb test_tecnico
```

### 4. Executar Migrações

```bash
npx prisma migrate dev --name init
```

### 5. Iniciar a Aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## Funcionalidades

- **Categorias**: Criar, editar, deletar e listar categorias
- **Produtos**: Gerenciar produtos com SKU, nome, marca e categoria
- **Estoque**: Consultar quantidade de produtos em estoque
- **Movimentações**: Registrar entradas e saídas de estoque

### Filtros e Busca

- **Buscar**: Digite nome ou SKU de produtos
- **Filtrar por Categoria**: Selecione uma ou mais categorias
- **Filtrar por Marca**: Disponível em produtos
- **Filtrar por Tipo de Movimentação**: Entrada ou Saída
- **Ordenar**: Clique no cabeçalho de qualquer coluna para ordenar
