<<<<<<< HEAD
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
=======
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
>>>>>>> 5543c809c9d28a3c9f4892184b57e28cb15da9db
