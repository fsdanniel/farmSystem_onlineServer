import express from "express";
import { listarRelatorios, listarPorFuncionario } from "./relatorioService.js";

const router = express.Router();

router.get("/relatorios", (req, res) => {
  try {
    const relatorios = listarRelatorios();
    res.json({ success: true, relatorios });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/relatorios/:funcionarioId", (req, res) => {
  try {
    const { funcionarioId } = req.params;
    const relatorios = listarPorFuncionario(funcionarioId);
    res.json({ success: true, relatorios });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
