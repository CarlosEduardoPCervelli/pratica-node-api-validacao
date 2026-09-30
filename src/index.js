const express = require("express");
const { criarTaskSchema, atualizarTaskSchema } = require("./schemas");

const app = express();
app.use(express.json());

// "Banco de dados" em memória: some quando o servidor reinicia.
let tasks = [];
let proximoId = 1;

/**
 * Middleware genérico: valida req.body contra um schema do zod.
 * Se der erro, responde 400 com a lista de problemas encontrados.
 * Se der certo, substitui req.body pelos dados já validados/normalizados.
 */
function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const erros = resultado.error.issues.map((issue) => issue.message);
      return res.status(400).json({ erros });
    }

    req.body = resultado.data;
    next();
  };
}

// GET /tasks - lista todas as tarefas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - busca uma tarefa específica
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }
  res.json(task);
});

// POST /tasks - cria uma nova tarefa
app.post("/tasks", validar(criarTaskSchema), (req, res) => {
  const novaTask = {
    id: proximoId++,
    titulo: req.body.titulo,
    descricao: req.body.descricao ?? "",
    status: req.body.status,
  };

  tasks.push(novaTask);
  res.status(201).json(novaTask);
});

// PUT /tasks/:id - atualiza uma tarefa existente
app.put("/tasks/:id", validar(atualizarTaskSchema), (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  Object.assign(task, req.body);
  res.json(task);
});

// DELETE /tasks/:id - remove uma tarefa
app.delete("/tasks/:id", (req, res) => {
  const indice = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  const [removida] = tasks.splice(indice, 1);
  res.json(removida);
});

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

module.exports = app;
