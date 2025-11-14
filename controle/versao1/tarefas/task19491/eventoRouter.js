import express from "express";
import { registrarEvento, listarEventos } from "./eventoService.js";

const router = express.Router();

router.post("/eventos", (req, res) => {
  try {
    const { tipo, data, animal, funcionarioId } = req.body;
    const novo = registrarEvento({ tipo, data, animal, funcionarioId });
    res.status(201).json({ success: true, evento: novo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/eventos", (req, res) => {
  try {
    const eventos = listarEventos();
    res.json({ success: true, eventos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
