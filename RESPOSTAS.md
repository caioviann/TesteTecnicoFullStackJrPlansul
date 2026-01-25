## Parte 1: Debugging do Backend
### Identificação do erro:
Fui no diretório

```text
/
├── app/            
├── api/           
├── produtos/          
└── route.ts

```
Onde imaginei que estaria o GET da listagem de produtos, la eu vi que a função estava retornando somente erro.
<p align="center">
  <img src="https://github.com/caioviann/TesteTecnicoFullStackJrPlansul/blob/9f6c4dc4a58522d3eda24626c607916c787f59f5/screenshots/Captura%20de%20Tela%202026-01-22%20%C3%A0s%2009.21.49.png" alt="Logo" width="300"/>
</p>

### Correção do Problema:
Realizei a implementação da lógica de listagem para garatir a exibição dos produtos. 
<p align="center">
  <img src="https://github.com/caioviann/TesteTecnicoFullStackJrPlansul/blob/9f6c4dc4a58522d3eda24626c607916c787f59f5/screenshots/Captura%20de%20Tela%202026-01-22%20%C3%A0s%2010.11.55.png" alt="Logo" width="300"/>
</p>

## Parte 2: Reimplementação e Integração do Módulo de Estoque
### Backend: 
#### Estoque (Prisma)<br>
Implementação de controle de estoque utilizando Prisma ORM, separando o estado atual do estoque do histórico de movimentações.

Model estoque
Armazena a quantidade atual de cada produto em estoque.
- Um produto possui apenas um estoque (produto_id é único).
- A quantidade é atualizada conforme as movimentações.
- Relacionamento 1:1 com produtos.

Campos principais:
- produto_id: referência ao produto
- quantidade: quantidade disponível
- atualizado_em: última atualização

Model estoque_movimentacoes<br>
Registra o histórico de entradas e saídas do estoque.
- Um produto pode ter várias movimentações.
- Usado para rastreabilidade e auditoria.
- Relacionamento N:1 com produtos.

Campos principais:
- produto_id: produto movimentado
- quantidade: quantidade movimentada
- tipo: tipo da movimentação
- criado_em: data da movimentação

### Repository
Foi realizado um CRUD padrão.

### Service
O estoque.service apenas retornado todos os estoques e o estoque de um produto em especifico.
Já o estoque-movimentacoes.service tem mas lógicas:
- Valida quantidade > 0
- Verifica se o produto existe
- Busca estoque atual (ou assume 0 se não existir)
- Para saída: valida se há estoque suficiente
- Calcula nova quantidade (entrada: soma, saída: subtrai)
- Executa transação do Prisma:
- - Cria a movimentação
- - Atualiza ou cria o estoque com a nova quantidade

### API Routes
#### estoque/route.ts
- GET: lista todos os estoques com informações do produto e categoria
- Serializa BigInt para string
- Tratamento de erros

#### estoque-movimentacoes/route.ts
- GET: lista todas as movimentações ordenadas por - - data (mais recente primeiro)
- POST: cria nova movimentação com validações:
- Valida produto_id obrigatório
- Valida quantidade > 0
- Valida tipo como "entrada" ou "saida"
- Converte produto_id para BigInt
- Usa o enum do Prisma ($Enums.tipo_movimentacao)
- Retorna mensagens de erro do service (ex: "Estoque insuficiente")

## Parte 3: Filtros, Ordenação e Buscas

### O que foi feito:

#### 🔄 **Ordenação em Todas as Colunas**
- Integrei `getSortedRowModel()` do TanStack React Table no componente `DataTable`
- Adicionei ícone de seta no cabeçalho das colunas
- Clique para ordenar ascendente/descendente - funciona em tempo real

#### 🔍 **Filtros Dinâmicos**
Criei dois componentes reutilizáveis:
- `FilterPopover`: Componente visual com botão "Filtros" que abre um dropdown
- `FilterCheckboxGroup`: Checkboxes para seleção múltipla com busca opcional e contador

Filtros implementados:
- **Produtos**: Por categoria e marca
- **Estoque**: Por categoria
- **Movimentações**: Por tipo (entrada/saída)
- **Categorias**: Apenas busca por nome/descrição

#### 🔎 **Busca em Tempo Real**
- **Produtos**: Nome ou SKU
- **Categorias**: Nome ou descrição  
- **Estoque**: Nome ou SKU do produto
- **Movimentações**: Nome ou SKU do produto

Usei `useMemo` para otimizar o filtering e evitar recálculos desnecessários.

### Processo de Análise:

1. **Estudei o projeto existente**: Entendi que usava TanStack React Table, React Query e Prisma
2. **Identifiquei o padrão**: Cada view já tinha estado local com `useState`, perfeito para integrar filtros
3. **Evitei overengineering**: Filteringedas no frontend (dados já carregados) em vez de API
4. **Testei a compilação**: Corrigir erro de Zod na validação de enums

### Código-chave:

```tsx
// No componente View:
const filteredProdutos = useMemo(() => {
  if (!produtos) return [];
  return produtos.filter((produto) => {
    const matchesSearch = searchLower === "" || 
      produto.nome.toLowerCase().includes(searchLower) ||
      produto.sku.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategories.size === 0 ||
      selectedCategories.has(produto.categoria_id || "null");
    
    return matchesSearch && matchesCategory;
  });
}, [produtos, searchText, selectedCategories]);
```

---

## 2. O que poderia ser diferente?

### Alternativa: Filtros no Backend
**O que existe agora**: Filtragem frontend após carregar todos os dados

**Alternativa**: Passar filtros como query params na API
```bash
GET /api/produtos?categoria=1&marca=Razer&search=teclado
```

**Por que não usei**:
- Projeto pequeno, quantidade de dados manejável
- Menos requests HTTP, UX mais fluida
- Exemplo: 1000 produtos carregam em <1s

**Quando seria melhor**:
- 100k+ registros → filtrar no banco economiza banda e processamento
- Produtos em diferentes páginas → paginação com filtros

### Alternativa: Usar estados globais (Redux/Zustand)
**Hoje**: Estados locais em cada View

**Melhor se**: Múltiplas páginas compartilhassem filtros

---

## 3. Próximos Passos (Ideias)

### 🚀 Curto prazo (fácil):
- **Exportar dados**: Botão "Baixar CSV" das tabelas
- **Paginação**: Já há suporte no React Table, só precisa implementar
- **Favoritos**: Salvar produtos/movimentações frequentes

### 📊 Médio prazo:
- **Relatórios**: Gráfico de entrada/saída por período
- **Alertas**: Notificação quando estoque < mínimo
- **Busca avançada**: Filtro por data, intervalo de quantidade

### 🔒 Longo prazo:
- **Autenticação**: Controlar quem vê/edita o quê
- **Auditoria**: Log de quem fez cada ação
- **API em produção**: Cache, rate limit, validações extras