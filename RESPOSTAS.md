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
