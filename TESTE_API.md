# Guia de Testes das APIs - Estoque e Movimentações

Este documento contém exemplos de como testar as novas APIs implementadas usando **Postman** ou **curl**.

## Pré-requisitos

1. Certifique-se de que o servidor está rodando:
   ```bash
   npm run dev
   ```
   O servidor estará disponível em: `http://localhost:3000`

2. Certifique-se de que o banco de dados está rodando:
   ```bash
   docker-compose up -d
   ```

---

## 1. API de Estoque

### GET `/api/estoque` - Listar todos os estoques

#### Postman:
1. **Método:** `GET`
2. **URL:** `http://localhost:3000/api/estoque`
3. **Headers:** Não necessário
4. **Body:** Não necessário

#### curl:
```bash
curl http://localhost:3000/api/estoque
```

#### Resposta esperada (200 OK):
```json
[
  {
    "id": "1",
    "produto_id": "1",
    "quantidade": 45,
    "atualizado_em": "2026-01-23T10:00:00.000Z",
    "produtos": {
      "id": "1",
      "sku": "LIM-001",
      "nome": "Detergente Líquido 500ml",
      "categoria_id": "1",
      "estoque_minimo": 10,
      "marca": "Ypê",
      "criado_em": "2026-01-23T10:00:00.000Z",
      "categorias": {
        "id": "1",
        "nome": "Limpeza e Higienização",
        "descricao": "Produtos para limpeza e higienização de ambientes"
      }
    }
  }
]
```

---

## 2. API de Movimentações de Estoque

### GET `/api/estoque-movimentacoes` - Listar todas as movimentações

#### Postman:
1. **Método:** `GET`
2. **URL:** `http://localhost:3000/api/estoque-movimentacoes`
3. **Headers:** Não necessário
4. **Body:** Não necessário

#### curl:
```bash
curl http://localhost:3000/api/estoque-movimentacoes
```

#### Resposta esperada (200 OK):
```json
[
  {
    "id": "1",
    "produto_id": "1",
    "quantidade": 50,
    "tipo": "entrada",
    "criado_em": "2026-01-23T10:00:00.000Z",
    "produtos": {
      "id": "1",
      "sku": "LIM-001",
      "nome": "Detergente Líquido 500ml",
      "categorias": {
        "id": "1",
        "nome": "Limpeza e Higienização"
      }
    }
  }
]
```

---

### POST `/api/estoque-movimentacoes` - Criar nova movimentação

#### Postman:
1. **Método:** `POST`
2. **URL:** `http://localhost:3000/api/estoque-movimentacoes`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "produto_id": "1",
     "quantidade": 10,
     "tipo": "entrada"
   }
   ```

#### curl:
```bash
curl -X POST http://localhost:3000/api/estoque-movimentacoes \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": "1",
    "quantidade": 10,
    "tipo": "entrada"
  }'
```

#### Resposta esperada (201 Created):
```json
{
  "id": "3",
  "produto_id": "1",
  "quantidade": 10,
  "tipo": "entrada",
  "criado_em": "2026-01-23T10:30:00.000Z",
  "produtos": {
    "id": "1",
    "sku": "LIM-001",
    "nome": "Detergente Líquido 500ml",
    "categorias": {
      "id": "1",
      "nome": "Limpeza e Higienização"
    }
  }
}
```

---

## Exemplos de Testes

### Teste 1: Criar movimentação de ENTRADA

**Request:**
```json
{
  "produto_id": "2",
  "quantidade": 20,
  "tipo": "entrada"
}
```

**Resultado esperado:**
- Movimentação criada com sucesso
- Estoque do produto atualizado (quantidade anterior + 20)

---

### Teste 2: Criar movimentação de SAÍDA

**Request:**
```json
{
  "produto_id": "1",
  "quantidade": 5,
  "tipo": "saida"
}
```

**Resultado esperado:**
- Movimentação criada com sucesso
- Estoque do produto atualizado (quantidade anterior - 5)

---

### Teste 3: Tentar saída com estoque insuficiente

**Request:**
```json
{
  "produto_id": "2",
  "quantidade": 100,
  "tipo": "saida"
}
```

**Resultado esperado (500 Error):**
```json
{
  "error": "Estoque insuficiente. Disponível: 0, Solicitado: 100"
}
```

---

### Teste 4: Validação - produto_id obrigatório

**Request:**
```json
{
  "quantidade": 10,
  "tipo": "entrada"
}
```

**Resultado esperado (400 Bad Request):**
```json
{
  "error": "produto_id é obrigatório"
}
```

---

### Teste 5: Validação - quantidade inválida

**Request:**
```json
{
  "produto_id": "1",
  "quantidade": 0,
  "tipo": "entrada"
}
```

**Resultado esperado (400 Bad Request):**
```json
{
  "error": "Quantidade deve ser maior que zero"
}
```

---

### Teste 6: Validação - tipo inválido

**Request:**
```json
{
  "produto_id": "1",
  "quantidade": 10,
  "tipo": "invalid"
}
```

**Resultado esperado (400 Bad Request):**
```json
{
  "error": "Tipo deve ser \"entrada\" ou \"saida\""
}
```

---

## Fluxo Completo de Teste

1. **Listar estoque inicial:**
   ```bash
   curl http://localhost:3000/api/estoque
   ```

2. **Criar movimentação de entrada:**
   ```bash
   curl -X POST http://localhost:3000/api/estoque-movimentacoes \
     -H "Content-Type: application/json" \
     -d '{"produto_id": "1", "quantidade": 10, "tipo": "entrada"}'
   ```

3. **Verificar estoque atualizado:**
   ```bash
   curl http://localhost:3000/api/estoque
   ```
   (A quantidade do produto deve ter aumentado em 10)

4. **Verificar movimentação criada:**
   ```bash
   curl http://localhost:3000/api/estoque-movimentacoes
   ```
   (A nova movimentação deve aparecer na lista)

5. **Criar movimentação de saída:**
   ```bash
   curl -X POST http://localhost:3000/api/estoque-movimentacoes \
     -H "Content-Type: application/json" \
     -d '{"produto_id": "1", "quantidade": 5, "tipo": "saida"}'
   ```

6. **Verificar estoque final:**
   ```bash
   curl http://localhost:3000/api/estoque
   ```
   (A quantidade do produto deve ter diminuído em 5)

---

## Dicas para Postman

1. **Criar uma Collection:**
   - Crie uma collection chamada "Estoque API"
   - Adicione todas as requisições acima
   - Use variáveis de ambiente para `base_url` = `http://localhost:3000`

2. **Variáveis de Ambiente:**
   - `base_url`: `http://localhost:3000`
   - `produto_id`: `1` (para testes)

3. **Testes Automatizados (Postman Tests):**
   ```javascript
   // Para GET /api/estoque
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   
   pm.test("Response is an array", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData).to.be.an('array');
   });
   ```

---

## Troubleshooting

### Erro: "Cannot connect to server"
- Verifique se o servidor está rodando: `npm run dev`
- Verifique se a porta 3000 está disponível

### Erro: "Database connection failed"
- Verifique se o Docker está rodando: `docker ps`
- Verifique se o container do banco está ativo: `docker-compose ps`
- Verifique o arquivo `.env` com a `DATABASE_URL`

### Erro: "Produto não encontrado"
- Verifique se o `produto_id` existe no banco
- Use `GET /api/produtos` para listar produtos disponíveis

### Erro: "Estoque insuficiente"
- Verifique o estoque atual do produto: `GET /api/estoque`
- Crie uma movimentação de entrada antes de tentar saída
