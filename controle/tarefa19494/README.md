# Funcionalidade: Consulta de Relatórios de Partos e Desmames

## Descrição
Permite que o funcionário visualize relatórios sobre partos e desmames cadastrados no sistema.

---

## Rotas Implementadas

### 🔹 Listar todos os relatórios
**Endpoint:** `GET /relatorios`  
**Descrição:** Retorna todos os relatórios de partos e desmames registrados.  
**Retorno:** JSON

### 🔹 Listar relatórios de um funcionário específico
**Endpoint:** `GET /relatorios/:funcionarioId`  
**Descrição:** Retorna apenas os relatórios associados ao funcionário informado.  
**Parâmetro:** `funcionarioId`  
**Retorno:** JSON

---

## Exemplo de Dados (`relatorios.json`)
```json
[
  {
    "id": 1,
    "tipo": "parto",
    "data": "2025-03-01",
    "animal": "Vaca 21",
    "funcionarioId": "f001"
  }
]
```

---

## Observações
- Segue o mesmo padrão de estrutura e rotas dos arquivos de tarefa e ocorrência.
- As funções estão centralizadas no arquivo `relatorioService.js`.
- O JSON é utilizado como base de dados local.
