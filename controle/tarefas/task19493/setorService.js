import fs from "fs";

const filePath = "./data/setores.json";

function carregar() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function salvar(setores) {
  fs.writeFileSync(filePath, JSON.stringify(setores, null, 2));
}

export function atualizarSetor(id, novosDados) {
  const setores = carregar();
  const index = setores.findIndex(s => s.id == id);
  if (index === -1) throw new Error("Setor não encontrado");
  setores[index] = { ...setores[index], ...novosDados };
  salvar(setores);
  return setores[index];
}

export function removerSetor(id) {
  const setores = carregar().filter(s => s.id != id);
  salvar(setores);
}
