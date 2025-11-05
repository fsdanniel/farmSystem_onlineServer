import express from "express";
import { cadastrar, listar, atualizar, excluir } from "./vetService.js";
import { verificarVeterinario } from "./authMiddleware.js";

const router = express.Router();

// Middleware para checar permissão de veterinário
router.use(verificarVeterinario);

// Lotes
router.post("/lotes", (req, res) => {
  const lote = cadastrar("lotes", req.body);
  res.status(201).json({ mensagem: "Lote cadastrado", lote });
});
router.get("/lotes", (req, res) => res.json(listar("lotes")));
router.put("/lotes/:id", (req, res) => res.json({ mensagem: "Lote atualizado", lote: atualizar("lotes", req.params.id, req.body) }));
router.delete("/lotes/:id", (req, res) => res.json({ mensagem: "Lote excluído", resultado: excluir("lotes", req.params.id) }));

// Berçário
router.post("/bercario", (req, res) => {
  const item = cadastrar("bercario", req.body);
  res.status(201).json({ mensagem: "Registro cadastrado", item });
});
router.get("/bercario", (req, res) => res.json(listar("bercario")));

// Ala de maternidade
router.post("/maternidade", (req, res) => {
  const item = cadastrar("maternidade", req.body);
  res.status(201).json({ mensagem: "Registro cadastrado", item });
});
router.get("/maternidade", (req, res) => res.json(listar("maternidade")));

// Inseminação
router.post("/inseminacao", (req, res) => {
  const item = cadastrar("inseminacao", req.body);
  res.status(201).json({ mensagem: "Registro cadastrado", item });
});
router.get("/inseminacao", (req, res) => res.json(listar("inseminacao")));

export default router;
