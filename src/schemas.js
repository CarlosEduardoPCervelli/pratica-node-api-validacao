const { z } = require("zod");

// Usado ao criar uma tarefa: título é obrigatório, descrição é opcional
// e status já começa como "pendente" se não for informado.
const criarTaskSchema = z.object({
  titulo: z.string().trim().min(1, "O título é obrigatório."),
  descricao: z.string().trim().optional(),
  status: z.enum(["pendente", "em_andamento", "concluida"]).optional().default("pendente"),
});

// Usado ao atualizar uma tarefa: todos os campos são opcionais, mas pelo
// menos um deve ser enviado (senão não há nada para atualizar).
const atualizarTaskSchema = z
  .object({
    titulo: z.string().trim().min(1, "O título não pode ser vazio.").optional(),
    descricao: z.string().trim().optional(),
    status: z.enum(["pendente", "em_andamento", "concluida"]).optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: "Envie ao menos um campo para atualizar (titulo, descricao ou status).",
  });

module.exports = { criarTaskSchema, atualizarTaskSchema };
