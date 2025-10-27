# Funcionalidade: Registro e Gerenciamento de Lotes de Animais

## Descrição
Permite que o funcionário registre, visualize, atualize e remova lotes de animais do sistema.

---

## Rotas Implementadas

### 🔹 Registrar novo lote
**Endpoint:** `POST /lotes`  
**Body:** `{ "nome": "Lote 01", "quantidade": 20, "especie": "Bovinos", "funcionarioId": "f001" }`  
**Descrição:** Registra um novo lote de animais.

### 🔹 Listar todos os lotes
**Endpoint:** `GET /lotes`  
**Descrição:** Retorna todos os lotes cadastrados.  

### 🔹 Atualizar lote
**Endpoint:** `PUT /lotes/:id`  
**Body:** `{ "nome": "Novo Lote", "quantidade": 25, "especie": "Ovinos" }`  
**Descrição:** Atualiza informações de um lote específico.  

### 🔹 Remover lote
**Endpoint:** `DELETE /lotes/:id`  
**Descrição:** Remove um lote do sistema.

---

## Exemplo de Dados (`lotes.json`)
```json
[
  {
    "id": 1,
    "nome": "Lote 01",
    "quantidade": 20,
    "especie": "Bovinos",
    "funcionarioId": "f001"
  }
]
```

---

## Observações
- Segue o mesmo padrão de estrutura e rotas dos arquivos de tarefa e ocorrência.
- As funções estão centralizadas no arquivo `loteService.js`.
- O JSON é utilizado como base de dados local.
