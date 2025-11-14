import express from "express";
import { gerarRelatorio } from "./relatorioService.js";
import { verificarFuncionario } from "./authMiddleware.js";

const router = express.Router();

// Middleware para checar permissão de funcionário
router.use(verificarFuncionario);

// Gerar relatório do setor do funcionário
router.get("/relatorios", (req, res) => {
  const { setorId } = req.query; // ou pegar do usuário logado
  const relatorio = gerarRelatorio(setorId);
  res.json({ mensagem: "Relatório gerado", relatorio });
});

export default router;