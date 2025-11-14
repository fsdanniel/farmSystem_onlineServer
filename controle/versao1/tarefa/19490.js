import express from "express";
import { registrar, listar } from "./ocorrenciaService.js";

const router = express.Router();

router.post("/ocorrencias", (req, res) => {
  try {
    const { funcionarioId, descricao, setor } = req.body;
    const nova = registrar({ funcionarioId, descricao, setor });
    res.status(201).json({ mensagem: "Ocorrência registrada", ocorrencia: nova });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Para listar todas as ocorrencias
 
router.get("/ocorrencias", (req, res) => {
  try {
    const todas = listar();
    res.json(todas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
