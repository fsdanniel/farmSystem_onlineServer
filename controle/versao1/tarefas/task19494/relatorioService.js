import fs from "fs";

const filePath = "./data/relatorios.json";

export function listarRelatorios() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function listarPorFuncionario(funcionarioId) {
  const data = fs.readFileSync(filePath, "utf-8");
  const relatorios = JSON.parse(data);
  return relatorios.filter(r => r.funcionarioId === funcionarioId);
}
