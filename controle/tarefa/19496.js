import express from "express";
import { cadastrarGenetica, listarGeneticas, cadastrarLote, listarLotes } from "./granjaService.js";

const router = express.Router();

// Cadastrar genética
router.post("/geneticas", (req, res) => {
  const { nome, descricao, caracteristicas } = req.body;
  const genetica = cadastrarGenetica({ nome, descricao, caracteristicas });
  res.status(201).json({ mensagem: "Genética cadastrada", genetica });
});

// Listar genéticas
router.get("/geneticas", (req, res) => {
  const geneticas = listarGeneticas();
  res.json(geneticas);
});

// Cadastrar lote
router.post("/lotes", (req, res) => {
  const { nome, quantidadeAnimais, geneticaId } = req.body;
  const lote = cadastrarLote({ nome, quantidadeAnimais, geneticaId });
  res.status(201).json({ mensagem: "Lote cadastrado", lote });
});

// Listar lotes
router.get("/lotes", (req, res) => {
  const lotes = listarLotes();
  res.json(lotes);
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 5543c809c9d28a3c9f4892184b57e28cb15da9db
