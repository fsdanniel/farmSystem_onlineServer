import fs from "fs";

export function listarRelatorios() {
  const data = fs.readFileSync("./data/relatorios.json", "utf-8");
  return JSON.parse(data);
}

export function listarPorFuncionario(funcionarioId) {
  const data = fs.readFileSync("./data/relatorios.json", "utf-8");
  const relatorios = JSON.parse(data);
  return relatorios.filter(r => r.funcionarioId === funcionarioId);
}
