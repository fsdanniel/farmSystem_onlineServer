Este documento descreve os endpoints e funcionalidades das rotas, incluindo métodos suportados, corpos de requisição, respostas esperadas e procedimentos armazenados utilizados.

---

## Berçário (`/bercario`)

Gerencia o ciclo de vida dos lotes de leitões, permitindo cadastro, edição e exclusão de registros.

### 🔗 Endpoints do berçário

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/bercario` | Lista todos os registros de berçário. | Não se aplica (parâmetros `$1` e `$2` são null). | Lista de objetos de berçário. | `buscaBercario($1, $2)` |
| **POST** | `/bercario` | Criação ou edição (upsert). A presença de `id` define edição. | **Sem id (criação):** loteNome, quantidadeLeitoes, dataNascimento, pesoMedio, dataDesmame, status. <br> **Com id (edição):** todos os campos incluindo id. | `{ sucesso: true, operacao: "criado" }` ou `{ sucesso: true, operacao: "editado" }` | `novoRegistroBercario(...)`, `editarRegistroBercario(...)` |
| **PUT** | `/bercario/:loteNome` | Edita um registro pelo nome do lote. | qtdeLeitoes, dataNascimento, pesoMedio, dataDesmame, status. | `{ sucesso: true, operacao: "editado" }` | `editarRegistroBercario(...)` |
| **DELETE** | `/bercario/:id` | Exclui um registro pelo ID. | Não se aplica. | `{ sucesso: true, operacao: "excluido" }` | `excluirRegistroBercario($1)` |

### 📌 Detalhes importantes (POST/PUT)

- **POST `/bercario`** cria se não há `id`, edita se `id` existe.
- **PUT `/bercario/:loteNome`** permite edição usando o nome do lote diretamente na URL.

---

## Contratos (`/contratos`)

Gerencia contratos com fornecedores, incluindo validações de campos e datas.

### 🔗 Endpoints de contratos

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/contratos` | Lista todos os contratos. | Não se aplica. | Lista de objetos de contrato. | `buscaContratos()` |
| **POST** | `/contratos` | Cria um contrato. | fornecedor, objeto, dataInicio, dataVencimento. | `{ sucesso: true, operacao: "criado" }` | `novoRegistroContrato(...)` |
| **PUT** | `/contratos/:id` | Edita contrato existente. | fornecedor, objeto, dataInicio, dataVencimento. | `{ sucesso: true, operacao: "editado" }` | `editarRegistroContrato(...)` |
| **DELETE** | `/contratos/:id` | Exclui contrato pelo ID. | Não se aplica. | `{ sucesso: true, operacao: "excluido" }` | `excluirRegistroContrato($1)` |

### ✔️ Validações Implementadas

- **Campos obrigatórios:** fornecedor, objeto, dataInicio, dataVencimento.
- **Validação de datas:** `dataInicio` não pode ser posterior a `dataVencimento`.

---

## Login (`/login`)

Rota destinada à verificação de credenciais.

### 🔗 Endpoint de Login

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/login` | Realiza login verificando credenciais. | usuario, senha. | `{ sucesso: true, usuario: "...", tipo: "..." }` | `verificaLogin($1, $2)` |

### ❌ Respostas de falha

#### **400 – Bad Request**
Quando `usuario` ou `senha` estão faltando.

```
{ "sucesso": false, "motivo": "usuario_ou_senha_faltando" }
```

#### **200 – Credencias inválidas**
Quando a função `verificaLogin` não encontra correspondência.

```
{ "sucesso": false, "motivo": "credenciais_invalidas" }
```
---

## Inseminações (`/inseminacoes`)

Gerencia registros de inseminação, permitindo criação, edição, listagem e exclusão.

## 🔗 Endpoints de Inseminações

| Método     | Rota                | Descrição                                                                   | Body                                                                                                                                                            | Resposta de sucesso                                                                 | Procedure/Function                                               |
| ---------- | ------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **GET**    | `/inseminacoes`     | Lista todas as inseminações cadastradas.                                    | Não se aplica.                                                                                                                                                  | `{ sucesso: true, dados: [...] }`                                                   | `buscaInseminacao(NULL, NULL)`                                   |
| **POST**   | `/inseminacoes`     | Cria ou edita uma inseminação (upsert). Se `id` estiver presente, é edição. | **Sem id (criação):** brincoFemea, geneticaMacho, dataInseminacao, tecnica, resultado, dataVerificacao. <br> **Com id (edição):** todos os campos incluindo id. | `{ sucesso: true, operacao: "criado" }` ou `{ sucesso: true, operacao: "editado" }` | `novoRegistroInseminacao(...)`, `editarRegistroInseminacao(...)` |
| **DELETE** | `/inseminacoes/:id` | Exclui inseminação pelo ID.                                                 | Não se aplica.                                                                                                                                                  | `{ sucesso: true, operacao: "excluido" }`                                           | `excluirRegistroInseminacao($1)`                                 |

### 📌 Observações Importantes

O endpoint POST funciona como upsert: cria se não houver id, edita se houver.

Os campos de datas devem estar em formato aceito pelo PostgreSQL (YYYY-MM-DD).

---

## Insumos (`/insumos`)

Gerencia compras de insumos, estoque atual e histórico.

## 🔗 Endpoints de Insumos

| Método     | Rota                 | Descrição                           | Body                                                                      | Resposta de sucesso                       | Procedure/Function    |
| ---------- | -------------------- | ----------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------- | --------------------- |
| **POST**   | `/insumos`           | Registra a compra de insumos.       | nome, dataCompra, quantidade, nomeFornecedor, custoTotal, statusRegistro. | `{ sucesso: true, operacao: "criado" }`   | `comprarInsumos(...)` |
| **DELETE** | `/insumos/:id`       | Exclui um registro de insumo.       | Não se aplica.                                                            | `{ sucesso: true, operacao: "excluido" }` | `excluirInsumos($1)`  |
| **GET**    | `/insumos/historico` | Lista todas as compras registradas. | Não se aplica.                                                            | `{ sucesso: true, dados: [...] }`         | `historicoInsumos()`  |
| **GET**    | `/insumos/estoque`   | Retorna o estoque atual de insumos. | Não se aplica.                                                            | `{ sucesso: true, dados: [...] }`         | `estoqueInsumos()`    |

### ✔️ Validações

Todos os campos do POST são obrigatórios.

Quantidade e custo devem ser valores numéricos válidos.

---

## Relatórios (`/api/relatorios`)

Fornece dados agregados e relatórios filtrados por tipo e período.

## 📌 Resumo Geral

| Método  | Rota                     | Descrição                           | Body           | Resposta de sucesso                | Funções utilizadas                                                                                                                                                                                                                                        |
| ------- | ------------------------ | ----------------------------------- | -------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET** | `/api/relatorios/resumo` | Retorna contagens gerais da granja. | Não se aplica. | `{ ok: true, resultado: { ... } }` | `quantidadeGeneticasAtivas()`, `quantidadeLotesAtivos()`, `quantidadeAnimaisAtivos()`, `quantidadeLotesQuarentenados()`, `quantidadeLeitoesBercario()`, `quantidadePorcasGestantes()`, `quantidadePorcasLactantes()`, `quantidadeInseminacoesPendentes()` |

### 🎯 Campos retornados

geneticas, lotesAtivos, animaisAtivos, quarentena, bercario, gestantes, lactantes, inseminacoesPendentes

## 📌 Relatórios filtrados

| Método  | Rota              | Descrição                                                                     | Query Params                | Resposta de sucesso             | Function                         |                               |
| ------- | ----------------- | ----------------------------------------------------------------------------- | --------------------------- | ------------------------------- | -------------------------------- | ----------------------------- |
| **GET** | `/api/relatorios` | Retorna dados de *partos* ou *desmames*, opcionalmente filtrados por período. | `tipo` (obrigatório: partos | desmames), `dataIni`, `dataFim` | `{ ok: true, resultado: [...] }` | `buscaRelatorios($1, $2, $3)` |

### ❌ Possíveis Erros

400 – Tipo inválido
```
{ ok: false, erro: "Tipo inválido. Use: partos | desmames" }
```
