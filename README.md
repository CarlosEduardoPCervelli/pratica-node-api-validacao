# API de Tasks com Validação (zod)

Mesma ideia da API REST de tarefas (`/tasks`, CRUD, array em memória), mas
agora validando o corpo da requisição com **zod** antes de salvar qualquer
coisa.

## Estrutura

- `src/schemas.js`: define as regras de validação.
  - `criarTaskSchema`: `titulo` obrigatório (não pode ser vazio), `descricao`
    opcional, `status` só aceita `"pendente"`, `"em_andamento"` ou
    `"concluida"` (e já assume `"pendente"` se não for enviado).
  - `atualizarTaskSchema`: todos os campos são opcionais, mas o `.refine()`
    garante que pelo menos um campo seja enviado.
- `src/index.js`: rotas Express. O middleware `validar(schema)` roda o
  `schema.safeParse(req.body)` — se falhar, responde `400` com a lista de
  erros; se passar, substitui `req.body` pelos dados já validados.

## Endpoints

| Método | Rota         | Descrição                          |
|--------|--------------|-------------------------------------|
| GET    | `/tasks`     | Lista todas as tarefas              |
| GET    | `/tasks/:id` | Busca uma tarefa pelo id            |
| POST   | `/tasks`     | Cria uma tarefa (valida o body)     |
| PUT    | `/tasks/:id` | Atualiza uma tarefa (valida o body) |
| DELETE | `/tasks/:id` | Remove uma tarefa                   |

## Como executar

```bash
npm install
npm start
```

Testando com `curl`:

```bash
# título vazio -> erro 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo":""}'

# criação válida -> 201
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudar SQL","descricao":"Revisar JOINs"}'
```

## Nota sobre os testes deste exercício

O ambiente onde este código foi escrito não tinha acesso à internet para
rodar `npm install`, então `express` e `zod` não puderam ser instalados e
testados de ponta a ponta aqui. A lógica de validação e das rotas (títulos
vazios, status inválido, valores padrão) foi testada isoladamente com uma
validação equivalente escrita à mão, sem as bibliotecas reais. Vale rodar
`npm install && npm start` na sua máquina antes de confiar 100% no código.

## Possíveis melhorias futuras
- Validar também os parâmetros da URL (ex: `:id` precisa ser numérico).
- Adicionar paginação em `GET /tasks`.
