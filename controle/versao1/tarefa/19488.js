import express from "express";
import { listarPorFuncionario } from "./tarefaService.js";

const router = express.Router();

router.get("/tarefas/:funcionarioId", (req, res) => {
  try {
    const { funcionarioId } = req.params;
    const tarefas = listarPorFuncionario(funcionarioId);
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});




export default router;
