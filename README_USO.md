# Documentação de Uso do Projeto

Guia completo para configurar, executar e utilizar a aplicação de Controle de Categorias, Produtos e Estoque.

---

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Configuração Inicial](#configuração-inicial)
3. [Executando a Aplicação](#executando-a-aplicação)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Guia de Uso da Interface](#guia-de-uso-da-interface)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos do Sistema

### Dependências Globais

- **Node.js:** v18.0.0 ou superior
- **npm:** v9.0.0 ou superior (ou yarn/pnpm)
- **PostgreSQL:** v12.0 ou superior
- **Git:** para clonar o repositório (opcional)

### Como Verificar Versões Instaladas

```bash
node --version
npm --version
psql --version
```

---

## ⚙️ Configuração Inicial

### Passo 1: Clonar/Abrir o Projeto

```bash
cd /Users/caiohenrique/Documents/Dev/TesteTecnico/PlansulNodeReact/junior-technical-assessment
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Este comando irá:
- Instalar todas as dependências do `package.json`
- Configurar o Prisma ORM
- Gerar os tipos TypeScript

### Passo 3: Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto:

```bash
touch .env
```

2. Configure as variáveis necessárias. Exemplo para desenvolvimento local:

```env
# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"

# Porta do Next.js (opcional, padrão: 3000)
PORT=3000
```

**Exemplo Completo com Valores Padrão:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_tecnico"
NODE_ENV=development
```

### Passo 4: Preparar o Banco de Dados

#### Opção A: Com Docker Compose (Recomendado)

O projeto possui um `docker-compose.yml` pré-configurado:

```bash
docker-compose up -d
```

Este comando irá:
- Criar um container PostgreSQL
- Usar as variáveis do arquivo `docker-compose.yml`
- Inicializar o banco de dados

#### Opção B: PostgreSQL Local

Se você tem PostgreSQL instalado localmente:

1. Crie um banco de dados:

```bash
createdb test_tecnico
```

2. Atualize a `DATABASE_URL` no `.env`:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/test_tecnico"
```

### Passo 5: Executar Migrações do Prisma

```bash
npx prisma migrate dev --name init
```

Este comando irá:
- Gerar as tabelas no banco de dados
- Executar os scripts SQL do projeto
- Atualizar os tipos Prisma

Se tiver um arquivo `sql/init.sql`, ele será executado automaticamente.

### Passo 6: Gerar Cliente Prisma

```bash
npx prisma generate
```

Esto atualiza os tipos e o cliente Prisma.

---

## 🚀 Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

**O que acontece:**
- O servidor Next.js inicia em `http://localhost:3000`
- O código é recarregado automaticamente ao fazer alterações
- Erros são exibidos no console

**Saída esperada:**
```
> dev
> next dev

  ▲ Next.js 16.1.2
  - Local:        http://localhost:3000
```

### Modo Produção

1. Compile o projeto:

```bash
npm run build
```

2. Inicie o servidor:

```bash
npm start
```

### Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
junior-technical-assessment/
├── app/
│   ├── api/                    # Endpoints da API
│   │   ├── categorias/
│   │   ├── produtos/
│   │   ├── estoque/
│   │   └── estoque-movimentacoes/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página inicial
│   ├── providers.tsx           # Context e providers
│   └── globals.css             # Estilos globais
├── components/
│   ├── views/                  # Componentes de página
│   ├── categorias/             # Componentes de categoria
│   ├── produtos/               # Componentes de produtos
│   ├── estoque/                # Componentes de estoque
│   ├── custom/                 # Componentes reutilizáveis
│   └── ui/                     # Componentes UI base
├── hooks/                      # React Custom Hooks
├── services/                   # Lógica de negócio
├── repositories/               # Acesso a dados
├── lib/                        # Utilitários
├── prisma/
│   └── schema.prisma           # Schema do banco
├── public/                     # Assets estáticos
├── sql/                        # Scripts SQL
├── package.json
├── tsconfig.json
├── next.config.ts
├── README_API.md               # Documentação das APIs
└── README_USO.md               # Este arquivo
```

### Principais Pastas

- **`app/api/`**: Endpoints REST da aplicação
- **`components/`**: Componentes React reutilizáveis
- **`services/`**: Lógica de negócio (regras, transformações)
- **`repositories/`**: Operações diretas com banco de dados
- **`hooks/`**: Custom hooks React com React Query

---

## ✨ Funcionalidades Principais

### 1. Gerenciamento de Categorias

**Ações Disponíveis:**
- ✅ Listar categorias
- ✅ Criar nova categoria
- ✅ Editar categoria existente
- ✅ Deletar categoria

**Acesso:**
- Interface: Aba "Categorias"
- API: `/api/categorias`

---

### 2. Gerenciamento de Produtos

**Ações Disponíveis:**
- ✅ Listar produtos com filtros
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Deletar produto
- ✅ Filtrar por categoria
- ✅ Buscar por nome/SKU

**Campos de Produto:**
- `SKU`: Código único do produto
- `Nome`: Nome do produto
- `Categoria`: Categoria associada
- `Marca`: Fabricante
- `Estoque Mínimo`: Quantidade mínima recomendada

**Acesso:**
- Interface: Aba "Produtos"
- API: `/api/produtos`

---

### 3. Controle de Estoque

**Estado do Estoque:**
- ✅ Visualizar quantidade atual de cada produto
- ✅ Ver data da última atualização

**Acesso:**
- Interface: Aba "Estado do Estoque"
- API: `/api/estoque`

---

### 4. Movimentações de Estoque

**Ações Disponíveis:**
- ✅ Registrar entrada de estoque
- ✅ Registrar saída de estoque
- ✅ Visualizar histórico de movimentações
- ✅ Filtrar por tipo (entrada/saída)
- ✅ Ver data e hora da movimentação

**Campos de Movimentação:**
- `Produto`: Qual produto foi movimentado
- `Quantidade`: Número de itens
- `Tipo`: "Entrada" ou "Saída"
- `Data/Hora`: Quando foi feito

**Acesso:**
- Interface: Aba "Histórico de Movimentações"
- API: `/api/estoque-movimentacoes`

---

## 📱 Guia de Uso da Interface

### Tela Inicial

Ao acessar a aplicação, você verá 4 abas principais:

1. **Categorias** - Gerenciar categorias de produtos
2. **Produtos** - Listar e gerenciar produtos
3. **Estado do Estoque** - Ver quantidade de itens em estoque
4. **Histórico de Movimentações** - Ver histórico de entradas/saídas

### Navegação

- **Menu de Abas**: Clique nas abas no topo para alternar entre seções
- **Tema**: Use o toggle de tema (canto superior) para alternar entre modo claro/escuro

---

### 1️⃣ Trabalhar com Categorias

#### Listar Categorias
- Abra a aba "Categorias"
- A tabela exibe: ID, Nome, Descrição, Data de Criação

#### Criar Categoria
- Clique no botão "Adicionar Categoria" (ou "+" verde)
- Preencha o formulário:
  - **Nome** (obrigatório): ex. "Eletrônicos"
  - **Descrição** (opcional): ex. "Produtos eletrônicos diversos"
- Clique em "Salvar"

#### Editar Categoria
- Localize a categoria na tabela
- Clique no botão de edição (ícone de lápis)
- Altere os dados desejados
- Clique em "Atualizar"

#### Deletar Categoria
- Localize a categoria na tabela
- Clique no botão de exclusão (ícone de lixeira)
- Confirme a exclusão no diálogo

---

### 2️⃣ Trabalhar com Produtos

#### Listar Produtos
- Abra a aba "Produtos"
- A tabela exibe: ID, SKU, Nome, Categoria, Marca, Estoque Mínimo, Data de Criação

#### Buscar/Filtrar Produtos
- Use o campo de busca para procurar por nome ou SKU
- Selecione uma categoria no filtro de categoria (se disponível)
- A tabela é atualizada em tempo real

#### Criar Produto
- Clique no botão "Adicionar Produto" (ou "+" verde)
- Preencha o formulário:
  - **SKU** (obrigatório): Código único como "ELET-001"
  - **Nome** (obrigatório): "Teclado Mecânico"
  - **Categoria**: Selecione uma categoria existente (opcional)
  - **Marca**: "Razer" ou "Genérico" (opcional)
  - **Estoque Mínimo**: Quantidade mínima desejada (opcional)
- Clique em "Salvar"

#### Editar Produto
- Localize o produto na tabela
- Clique no botão de edição (ícone de lápis)
- Altere os dados desejados
- Clique em "Atualizar"

#### Deletar Produto
- Localize o produto na tabela
- Clique no botão de exclusão (ícone de lixeira)
- Confirme a exclusão no diálogo

> ⚠️ **Nota**: Ao deletar um produto, todas as suas movimentações de estoque serão deletadas.

---

### 3️⃣ Consultar Estado do Estoque

#### Visualizar Estoque
- Abra a aba "Estado do Estoque"
- A tabela exibe:
  - **ID do Estoque**: Identificador único
  - **Produto**: Nome do produto
  - **Quantidade**: Quantidade atual em estoque
  - **Última Atualização**: Data/hora da última movimentação

#### Interpretar os Dados
- Quantidade 0 = Produto sem estoque
- Última Atualização = Quando foi feita a última entrada ou saída

> 💡 **Dica**: O estoque é atualizado automaticamente quando você registra uma movimentação.

---

### 4️⃣ Registrar Movimentações de Estoque

#### Listar Movimentações
- Abra a aba "Histórico de Movimentações"
- A tabela exibe:
  - **ID**: Identificador único
  - **Produto**: Nome do produto
  - **Tipo**: "Entrada" ou "Saída"
  - **Quantidade**: Número de itens
  - **Data/Hora**: Quando foi registrada

#### Registrar Entrada de Estoque
- Clique no botão "Adicionar Movimentação" (ou "+" verde)
- No formulário:
  - **Tipo**: Selecione "Entrada"
  - **Produto**: Escolha o produto
  - **Quantidade**: Digite a quantidade (ex: 10)
- Clique em "Salvar"
- A quantidade do produto no estoque aumentará

#### Registrar Saída de Estoque
- Clique no botão "Adicionar Movimentação" (ou "+" verde)
- No formulário:
  - **Tipo**: Selecione "Saída"
  - **Produto**: Escolha o produto
  - **Quantidade**: Digite a quantidade (ex: 5)
- Clique em "Salvar"
- A quantidade do produto no estoque diminuirá

#### Filtrar Movimentações
- Use os filtros disponíveis para:
  - Buscar por produto
  - Filtrar por tipo (Entrada/Saída)
  - Ver movimentações em um período

---

## 🔧 Desenvolvimento

### Estrutura de Dados - Hooks

O projeto usa React Query para gerenciar estado e cache de dados:

```typescript
// Exemplo de uso em um componente
import { useProdutos } from '@/hooks/use-produtos';

export function MeuComponente() {
  const { data: produtos, isLoading, error } = useProdutos();
  
  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar</p>;
  
  return (
    <ul>
      {produtos?.map(p => <li key={p.id}>{p.nome}</li>)}
    </ul>
  );
}
```

### Formulários

O projeto usa React Hook Form com validação Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
});

export function MinhaForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* formulário */}
    </form>
  );
}
```

### Chamadas de API

As chamadas à API são feitas através dos hooks em `/hooks/`:

```typescript
// Exemplo: useProdutos
export function useProdutos() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await fetch('/api/produtos');
      return response.json();
    },
  });
}
```

---

## 🐛 Troubleshooting

### Problema: "Cannot find module '@/...'"

**Solução:**
- Verifique o arquivo `tsconfig.json` - deve ter paths configurados
- Execute `npm install` novamente
- Reinicie o servidor de desenvolvimento

### Problema: "Database connection failed"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -h localhost

# Ou com Docker:
docker-compose ps

# Se não estiver rodando:
docker-compose up -d
```

### Problema: "Prisma migrations failed"

**Solução:**
```bash
# Resetar banco de dados (⚠️ apaga tudo)
npx prisma migrate reset

# Ou ver status das migrações
npx prisma migrate status

# Gerar cliente novamente
npx prisma generate
```

### Problema: "Port 3000 is already in use"

**Solução:**
```bash
# Matar processo na porta 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 npm run dev
```

### Problema: Estilos não estão carregando

**Solução:**
```bash
# Reconstruir Tailwind CSS
npm run build

# Ou limpar cache
rm -rf .next
npm run dev
```

### Problema: Erro "EACCES: permission denied"

**Solução:**
```bash
# Verificar permissões
ls -la package.json

# Se necessário, atualizar permissões
chmod 644 package.json

# Ou reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Logs e Debugging

### Ver Logs do Servidor

Os logs são exibidos no console ao executar `npm run dev`:

```
[API] GET /api/produtos → 200 OK
[API] POST /api/estoque-movimentacoes → 201 Created
[Error] Database query failed: connection timeout
```

### Verificar Dados no Prisma Studio

```bash
npx prisma studio
```

Abre uma interface web em `http://localhost:5555` para visualizar e editar dados diretamente.

### Logs do Banco de Dados

Para ver queries SQL executadas:

```bash
# No arquivo .env
DATABASE_URL="postgresql://user:pass@host/db?logging=true"
```

---

## 🚢 Deployment

### Preparar para Produção

1. Build da aplicação:
```bash
npm run build
```

2. Executar migrações no banco:
```bash
npx prisma migrate deploy
```

3. Iniciar servidor:
```bash
npm start
```

### Variáveis de Ambiente em Produção

Certifique-se de configurar:
- `DATABASE_URL`: URL do banco de dados em produção
- `NODE_ENV=production`
- Qualquer outra variável específica do ambiente

---

## 📞 Suporte e Documentação

- **Documentação da API**: Veja [README_API.md](README_API.md)
- **Prisma ORM**: https://www.prisma.io/docs/
- **Next.js**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest
- **React Hook Form**: https://react-hook-form.com/

---

## ✅ Checklist de Primeiro Uso

- [ ] Node.js e npm instalados
- [ ] PostgreSQL instalado ou Docker disponível
- [ ] Projeto clonado/aberto
- [ ] `npm install` executado
- [ ] `.env` configurado com `DATABASE_URL`
- [ ] PostgreSQL iniciado (local ou Docker)
- [ ] Migrações executadas: `npx prisma migrate dev --name init`
- [ ] Servidor iniciado: `npm run dev`
- [ ] Navegador aberto em `http://localhost:3000`
- [ ] Todas as abas aparecem e funcionam

---

Parabéns! Você está pronto para usar a aplicação! 🎉
