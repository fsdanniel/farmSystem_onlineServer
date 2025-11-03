import fs from "fs";

const filePath = "./data/eventos.json";

function carregarEventos() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function salvarEventos(eventos) {
  fs.writeFileSync(filePath, JSON.stringify(eventos, null, 2));
}

export function registrarEvento({ tipo, data, animal, funcionarioId }) {
  const eventos = carregarEventos();
  const novo = { id: eventos.length + 1, tipo, data, animal, funcionarioId };
  eventos.push(novo);
  salvarEventos(eventos);
  return novo;
}

export function listarEventos() {
  return carregarEventos();
}
