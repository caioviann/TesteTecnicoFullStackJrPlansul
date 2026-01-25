# Documentação das APIs

Este documento descreve todos os endpoints disponíveis na aplicação, incluindo métodos HTTP, parâmetros, autenticação e exemplos de requisição/resposta.

## Base URL

```
http://localhost:3000/api
```

## Estrutura de Resposta

### Sucesso (2xx)

As respostas bem-sucedidas retornam dados em formato JSON:

```json
{
  "id": "1",
  "campo": "valor",
  "data": "2024-01-15T10:30:00Z"
}
```

### Erro (4xx/5xx)

Em caso de erro, a resposta segue este padrão:

```json
{
  "error": "Descrição do erro",
  "details": "Detalhes adicionais (opcional)"
}
```

---

## 1. CATEGORIAS

### 1.1 Listar Todas as Categorias

- **Método:** `GET`
- **Endpoint:** `/categorias`
- **Autenticação:** Não requerida
- **Parâmetros de Query:** Nenhum

**Request:**
```bash
curl -X GET http://localhost:3000/api/categorias
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral",
    "criado_em": "2024-01-10T08:00:00.000Z"
  },
  {
    "id": "2",
    "nome": "Livros",
    "descricao": "Livros diversos",
    "criado_em": "2024-01-11T09:30:00.000Z"
  }
]
```

---

### 1.2 Obter Categoria por ID

- **Método:** `GET`
- **Endpoint:** `/categorias/{id}`
- **Autenticação:** Não requerida
- **Parâmetros de Path:** 
  - `id` (string/number): ID da categoria

**Request:**
```bash
curl -X GET http://localhost:3000/api/categorias/1
```

**Response (200 OK):**
```json
{
  "id": "1",
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral",
  "criado_em": "2024-01-10T08:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Categoria não encontrada"
}
```

---

### 1.3 Criar Nova Categoria

- **Método:** `POST`
- **Endpoint:** `/categorias`
- **Autenticação:** Não requerida
- **Content-Type:** `application/json`

**Parâmetros do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ✅ | Nome da categoria (máx. 100 caracteres) |
| `descricao` | string | ❌ | Descrição opcional da categoria |

**Request:**
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Periféricos",
    "descricao": "Acessórios de computador"
  }'
```

**Response (201 Created):**
```json
{
  "id": "3",
  "nome": "Periféricos",
  "descricao": "Acessórios de computador",
  "criado_em": "2024-01-15T10:30:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Nome é obrigatório"
}
```

---

### 1.4 Atualizar Categoria

- **Método:** `PUT`
- **Endpoint:** `/categorias/{id}`
- **Autenticação:** Não requerida
- **Content-Type:** `application/json`

**Parâmetros do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ❌ | Novo nome da categoria |
| `descricao` | string | ❌ | Nova descrição |

**Request:**
```bash
curl -X PUT http://localhost:3000/api/categorias/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Eletrônicos Diversos",
    "descricao": "Produtos eletrônicos em geral e acessórios"
  }'
```

**Response (200 OK):**
```json
{
  "id": "1",
  "nome": "Eletrônicos Diversos",
  "descricao": "Produtos eletrônicos em geral e acessórios",
  "criado_em": "2024-01-10T08:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Categoria não encontrada para atualização"
}
```

---

### 1.5 Deletar Categoria

- **Método:** `DELETE`
- **Endpoint:** `/categorias/{id}`
- **Autenticação:** Não requerida

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/categorias/3
```

**Response (204 No Content):**
```
(sem corpo)
```

**Response (404 Not Found):**
```json
{
  "error": "Categoria não encontrada para exclusão"
}
```

---

## 2. PRODUTOS

### 2.1 Listar Todos os Produtos

- **Método:** `GET`
- **Endpoint:** `/produtos`
- **Autenticação:** Não requerida
- **Parâmetros de Query:** Nenhum

**Request:**
```bash
curl -X GET http://localhost:3000/api/produtos
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "categoria_id": "1",
    "sku": "ELET-001",
    "nome": "Teclado Mecânico",
    "estoque_minimo": 5,
    "marca": "Razer",
    "criado_em": "2024-01-12T11:00:00.000Z"
  },
  {
    "id": "2",
    "categoria_id": "1",
    "sku": "ELET-002",
    "nome": "Mouse Wireless",
    "estoque_minimo": 10,
    "marca": "Logitech",
    "criado_em": "2024-01-12T11:30:00.000Z"
  }
]
```

---

### 2.2 Obter Produto por ID

- **Método:** `GET`
- **Endpoint:** `/produtos/{id}`
- **Autenticação:** Não requerida
- **Parâmetros de Path:** 
  - `id` (string/number): ID do produto

**Request:**
```bash
curl -X GET http://localhost:3000/api/produtos/1
```

**Response (200 OK):**
```json
{
  "id": "1",
  "categoria_id": "1",
  "sku": "ELET-001",
  "nome": "Teclado Mecânico",
  "estoque_minimo": 5,
  "marca": "Razer",
  "criado_em": "2024-01-12T11:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Produto não encontrado"
}
```

---

### 2.3 Criar Novo Produto

- **Método:** `POST`
- **Endpoint:** `/produtos`
- **Autenticação:** Não requerida
- **Content-Type:** `application/json`

**Parâmetros do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `sku` | string | ✅ | SKU único do produto (máx. 50 caracteres) |
| `nome` | string | ✅ | Nome do produto (máx. 255 caracteres) |
| `categoria_id` | number | ❌ | ID da categoria |
| `estoque_minimo` | number | ❌ | Quantidade mínima em estoque (padrão: 0) |
| `marca` | string | ❌ | Marca do produto (padrão: "Generico") |

**Request:**
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "ELET-003",
    "nome": "Monitor 27 polegadas",
    "categoria_id": 1,
    "estoque_minimo": 3,
    "marca": "LG"
  }'
```

**Response (201 Created):**
```json
{
  "id": "3",
  "categoria_id": "1",
  "sku": "ELET-003",
  "nome": "Monitor 27 polegadas",
  "estoque_minimo": 3,
  "marca": "LG",
  "criado_em": "2024-01-15T10:30:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "SKU e Nome são obrigatórios"
}
```

---

### 2.4 Atualizar Produto

- **Método:** `PUT`
- **Endpoint:** `/produtos/{id}`
- **Autenticação:** Não requerida
- **Content-Type:** `application/json`

**Parâmetros do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `sku` | string | ❌ | Novo SKU |
| `nome` | string | ❌ | Novo nome |
| `categoria_id` | number | ❌ | Nova categoria |
| `estoque_minimo` | number | ❌ | Novo estoque mínimo |
| `marca` | string | ❌ | Nova marca |

**Request:**
```bash
curl -X PUT http://localhost:3000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teclado Mecânico RGB",
    "marca": "Corsair",
    "estoque_minimo": 8
  }'
```

**Response (200 OK):**
```json
{
  "id": "1",
  "categoria_id": "1",
  "sku": "ELET-001",
  "nome": "Teclado Mecânico RGB",
  "estoque_minimo": 8,
  "marca": "Corsair",
  "criado_em": "2024-01-12T11:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Produto não encontrado para atualização"
}
```

---

### 2.5 Deletar Produto

- **Método:** `DELETE`
- **Endpoint:** `/produtos/{id}`
- **Autenticação:** Não requerida

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/produtos/3
```

**Response (204 No Content):**
```
(sem corpo)
```

**Response (404 Not Found):**
```json
{
  "error": "Produto não encontrado para exclusão"
}
```

---

## 3. ESTOQUE

### 3.1 Listar Estado do Estoque

- **Método:** `GET`
- **Endpoint:** `/estoque`
- **Autenticação:** Não requerida
- **Parâmetros de Query:** Nenhum

**Descrição:** Retorna o estado atual do estoque de todos os produtos.

**Request:**
```bash
curl -X GET http://localhost:3000/api/estoque
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "produto_id": "1",
    "quantidade": 25,
    "atualizado_em": "2024-01-14T14:30:00.000Z"
  },
  {
    "id": "2",
    "produto_id": "2",
    "quantidade": 15,
    "atualizado_em": "2024-01-13T09:00:00.000Z"
  }
]
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Falha ao buscar estoque",
  "details": "Descrição do erro específico"
}
```

---

## 4. ESTOQUE - MOVIMENTAÇÕES

### 4.1 Listar Todas as Movimentações

- **Método:** `GET`
- **Endpoint:** `/estoque-movimentacoes`
- **Autenticação:** Não requerida
- **Parâmetros de Query:** Nenhum

**Descrição:** Retorna o histórico de todas as movimentações de estoque (entrada e saída).

**Request:**
```bash
curl -X GET http://localhost:3000/api/estoque-movimentacoes
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "produto_id": "1",
    "quantidade": 10,
    "tipo": "entrada",
    "criado_em": "2024-01-12T10:00:00.000Z"
  },
  {
    "id": "2",
    "produto_id": "1",
    "quantidade": 2,
    "tipo": "saida",
    "criado_em": "2024-01-13T15:30:00.000Z"
  },
  {
    "id": "3",
    "produto_id": "2",
    "quantidade": 20,
    "tipo": "entrada",
    "criado_em": "2024-01-14T11:00:00.000Z"
  }
]
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Falha ao buscar movimentações",
  "details": "Descrição do erro específico"
}
```

---

### 4.2 Registrar Nova Movimentação de Estoque

- **Método:** `POST`
- **Endpoint:** `/estoque-movimentacoes`
- **Autenticação:** Não requerida
- **Content-Type:** `application/json`

**Descrição:** Cria uma nova movimentação de estoque (entrada ou saída). Esta operação atualiza automaticamente a quantidade disponível no estoque do produto.

**Parâmetros do Body:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `produto_id` | number | ✅ | ID do produto |
| `quantidade` | number | ✅ | Quantidade movimentada (deve ser > 0) |
| `tipo` | string | ✅ | Tipo de movimentação: "entrada" ou "saida" |

**Request - Entrada de Estoque:**
```bash
curl -X POST http://localhost:3000/api/estoque-movimentacoes \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "quantidade": 15,
    "tipo": "entrada"
  }'
```

**Request - Saída de Estoque:**
```bash
curl -X POST http://localhost:3000/api/estoque-movimentacoes \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "quantidade": 5,
    "tipo": "saida"
  }'
```

**Response (201 Created):**
```json
{
  "id": "4",
  "produto_id": "1",
  "quantidade": 15,
  "tipo": "entrada",
  "criado_em": "2024-01-15T10:30:00.000Z"
}
```

**Response (400 Bad Request - Erro de Validação):**
```json
{
  "error": "produto_id é obrigatório"
}
```

```json
{
  "error": "Quantidade deve ser maior que zero"
}
```

```json
{
  "error": "Tipo deve ser \"entrada\" ou \"saida\""
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Descrição do erro específico"
}
```

---

## Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| `200` | OK | Requisição bem-sucedida (GET, PUT) |
| `201` | Created | Recurso criado com sucesso (POST) |
| `204` | No Content | Operação bem-sucedida sem retorno de dados (DELETE) |
| `400` | Bad Request | Requisição inválida (parâmetros ausentes ou inválidos) |
| `404` | Not Found | Recurso não encontrado |
| `500` | Internal Server Error | Erro no servidor |

---

## Exemplos Práticos com JavaScript/Fetch

### Criar Produto

```javascript
const criarProduto = async (produto) => {
  const response = await fetch('http://localhost:3000/api/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao criar produto');
  }
  
  return response.json();
};

// Uso
criarProduto({
  sku: 'ELET-004',
  nome: 'Webcam HD',
  categoria_id: 1,
  estoque_minimo: 2,
  marca: 'Logitech'
});
```

### Registrar Movimentação

```javascript
const registrarMovimentacao = async (movimentacao) => {
  const response = await fetch('http://localhost:3000/api/estoque-movimentacoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movimentacao),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao registrar movimentação');
  }
  
  return response.json();
};

// Uso
registrarMovimentacao({
  produto_id: 1,
  quantidade: 10,
  tipo: 'entrada'
});
```

---