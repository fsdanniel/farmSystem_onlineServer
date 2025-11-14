import { listarPorFuncionario, finalizar } from "./tarefaService.js";


router.put("/tarefas/:id/finalizar", (req, res) => {
  try {
    const { id } = req.params;
    const tarefa = finalizar(id);
    res.json({ mensagem: "Tarefa finalizada com sucesso", tarefa });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
