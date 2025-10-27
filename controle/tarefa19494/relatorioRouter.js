import express from "express";
import { listarRelatorios, listarPorFuncionario } from "./relatorioService.js";

const router = express.Router();

// Listar todos os relatórios de partos e desmames
router.get("/relatorios", (req, res) => {
  try {
    const relatorios = listarRelatorios();
    res.json(relatorios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar relatórios de um funcionário específico
router.get("/relatorios/:funcionarioId", (req, res) => {
  try {
    const { funcionarioId } = req.params;
    const relatorios = listarPorFuncionario(funcionarioId);
    res.json(relatorios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
