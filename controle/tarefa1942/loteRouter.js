import express from "express";
import { registrarLote, listarLotes, atualizarLote, removerLote } from "./loteService.js";

const router = express.Router();

// Registrar novo lote
router.post("/lotes", (req, res) => {
  try {
    const { nome, quantidade, especie, funcionarioId } = req.body;
    const novoLote = registrarLote({ nome, quantidade, especie, funcionarioId });
    res.status(201).json({ mensagem: "Lote registrado com sucesso", lote: novoLote });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar todos os lotes
router.get("/lotes", (req, res) => {
  try {
    const lotes = listarLotes();
    res.json(lotes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar informações de um lote
router.put("/lotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { nome, quantidade, especie } = req.body;
    const atualizado = atualizarLote(id, { nome, quantidade, especie });
    res.json({ mensagem: "Lote atualizado com sucesso", lote: atualizado });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Remover um lote
router.delete("/lotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    removerLote(id);
    res.json({ mensagem: "Lote removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
