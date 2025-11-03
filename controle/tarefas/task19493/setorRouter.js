import express from "express";
import { atualizarSetor, removerSetor } from "./setorService.js";

const router = express.Router();

router.put("/setores/:id", (req, res) => {
  try {
    const atualizado = atualizarSetor(req.params.id, req.body);
    res.json({ success: true, setorAtualizado: atualizado });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/setores/:id", (req, res) => {
  try {
    removerSetor(req.params.id);
    res.json({ success: true, message: "Setor removido com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
