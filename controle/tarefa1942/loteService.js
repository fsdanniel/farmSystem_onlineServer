import fs from "fs";

const filePath = "./data/lotes.json";

function carregarDados() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function salvarDados(dados) {
  fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
}

export function registrarLote({ nome, quantidade, especie, funcionarioId }) {
  const lotes = carregarDados();
  const novo = {
    id: lotes.length + 1,
    nome,
    quantidade,
    especie,
    funcionarioId
  };
  lotes.push(novo);
  salvarDados(lotes);
  return novo;
}

export function listarLotes() {
  return carregarDados();
}

export function atualizarLote(id, novosDados) {
  const lotes = carregarDados();
  const index = lotes.findIndex(l => l.id == id);
  if (index === -1) throw new Error("Lote não encontrado");
  lotes[index] = { ...lotes[index], ...novosDados };
  salvarDados(lotes);
  return lotes[index];
}

export function removerLote(id) {
  let lotes = carregarDados();
  lotes = lotes.filter(l => l.id != id);
  salvarDados(lotes);
}
