import express from "express";
import { registrarLote, listarLotes, atualizarLote, removerLote } from "./loteService.js";

const router = express.Router();

router.post("/lotes", (req, res) => {
  try {
    const { nome, quantidade, especie, funcionarioId } = req.body;
    const novo = registrarLote({ nome, quantidade, especie, funcionarioId });
    res.status(201).json({ success: true, lote: novo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/lotes", (req, res) => {
  try {
    const lotes = listarLotes();
    res.json({ success: true, lotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/lotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = atualizarLote(id, req.body);
    res.json({ success: true, loteAtualizado: atualizado });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/lotes/:id", (req, res) => {
  try {
    removerLote(req.params.id);
    res.json({ success: true, message: "Lote removido com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
