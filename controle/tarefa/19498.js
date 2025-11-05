import express from "express";
import { registrarOcorrencia, listarOcorrencias, atualizarOcorrencia } from "./ocorrenciaService.js";

const router = express.Router();

// Registrar nova ocorrência
router.post("/ocorrencias", (req, res) => {
  const { loteId, descricao, data } = req.body;
  const ocorrencia = registrarOcorrencia({ loteId, descricao, data });
  res.status(201).json({ mensagem: "Ocorrência registrada", ocorrencia });
});

// Listar todas as ocorrências
router.get("/ocorrencias", (req, res) => {
  const ocorrencias = listarOcorrencias();
  res.json(ocorrencias);
});

// Atualizar ocorrência
router.put("/ocorrencias/:id", (req, res) => {
  const { id } = req.params;
  const { descricao, data } = req.body;
  const ocorrenciaAtualizada = atualizarOcorrencia(id, { descricao, data });
  res.json({ mensagem: "Ocorrência atualizada", ocorrencia: ocorrenciaAtualizada });
});

export default router;
