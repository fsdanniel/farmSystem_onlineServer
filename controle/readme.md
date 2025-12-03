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

#  Lotes (`/lotes`)

Gerencia agrupamentos de animais, permitindo cadastro, edição e exclusão de lotes vinculados a uma genética específica.

## Endpoints

| Método | Rota | Descrição | Body / Params | Resposta de Sucesso | Procedure SQL |
|---|---|---|---|---|---|
| **GET** | `/lotes` | Lista lotes | Query params: genetica?, status? | `{ sucesso: true, dados: [...] }` | `buscaPaginaLotes($1,$2)` |
| **POST** | `/lotes` | Cria novo lote | nome, genetica, quantidade, dataCriacao, status | `{ sucesso: true, operacao: "criado" }` | `novoLote(...)` |
| **PUT** | `/lotes/:id` | Edita lote existente | nome, genetica, quantidade, dataCriacao, status | `{ sucesso: true, operacao: "editado" }` | `editaLote(...)` |
| **DELETE** | `/lotes/:id` | Remove lote | — | `{ sucesso: true, operacao: "excluido" }` | `excluirLote($1)` |

---

#  Maternidade (`/maternidades`)

Gerencia dados de porcas prenhas, controle de cobertura, previsão de parto e histórico reprodutivo.

## Endpoints

| Método | Rota | Descrição | Body | Resposta de Sucesso | Procedure SQL |
|---|---|---|---|---|---|
| **GET** | `/maternidades` | Lista registros maternidade | genetica?, status? | `{ sucesso: true, dados: [...] }` | `buscaMaternidade($1,$2)` |
| **POST** | `/maternidades` | Cria ou edita registro | brincoFemea, genetica, dataCobertura, dataPartoPrevisto, qtdeLeitoes, status (+ id) | `{ sucesso: true, operacao: "criado/editado" }` | `novoRegistroMaternidade(...)`, `editarRegistroMaternidade(...)` |
| **DELETE** | `/maternidades/:id` | Exclui registro | — | `{ sucesso: true, operacao: "excluido" }` | `excluirRegistroMaternidade($1)` |

---

#  Ocorrências (`/ocorrencias`)

Registra eventos relacionados à saúde, mortalidade, manejo e intervenções aplicadas.

## Endpoints principais

| Método | Rota | Descrição | Body | Resposta | Procedure SQL |
|---|---|---|---|---|---|
| **GET** | `/ocorrencias` | Lista ocorrências | — | `{ sucesso: true, dados: [...] }` | `buscaOcorrencias(...)` |
| **POST** | `/ocorrencias` | Cria/edita ocorrência | lote, tipo, prioridade, data, hora, titulo, descricao, quantidadeAnimaisAfetados, medicamentoAplicado, dosagem, responsavel, proximasAcoes, status (+ id) | `{ sucesso: true, operacao: "criado/editado" }` | `novaOcorrencia(...)`, `editarOcorrencia(...)` |
| **DELETE** | `/ocorrencias/:id` | Remove ocorrência | — | `{ sucesso: true, operacao: "excluido" }` | `excluirOcorrencia($1)` |

---

## Endpoints auxiliares (ocorrências)

| Método | Rota | Descrição |
|---|---|---|
| **GET** | `/ocorrencias/lotes` | Retorna lotes existentes |
| **GET** | `/ocorrencias/qtd-criticas` | Quantidade de ocorrências críticas |
| **GET** | `/ocorrencias/qtd-pendentes` | Quantidade de ocorrências abertas |
| **GET** | `/ocorrencias/qtd-resolvidas-hoje` | Ocorrências resolvidas no dia |

---

## 🛠 Observações Gerais

- Todos os endpoints retornam JSON.
- O uso de procedures centraliza a regra de negócio no PostgreSQL.
- O POST nas rotas funciona como **upsert** quando permitido (cria ou edita dependendo da presença do campo `id`).
- Datas devem usar formato compatível com o PostgreSQL: `YYYY-MM-DD`.

---

## Tarefas (`/tarefas`)

Gerencia o controle de tarefas do sistema, permitindo listagem, criação, atualização e exclusão.

### 🔗 Endpoints de tarefas

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/tarefas` | Lista todas as tarefas do sistema. | Não se aplica. | `{ ok: true, dados: [...] }` | `listarTarefas()` |
| **POST** | `/tarefas` | Insere uma nova tarefa. | Campos definidos no corpo da requisição. | `{ ok: true, dados: {...} }` | `inserirTarefa(req.body)` |
| **PUT** | `/tarefas/:id` | Atualiza uma tarefa existente. | Campos atualizados da tarefa. | `{ ok: true, dados: {...} }` | `atualizarTarefa(id, req.body)` |
| **DELETE** | `/tarefas/:id` | Exclui uma tarefa pelo ID. | Não se aplica. | `{ ok: true, dados: {...} }` | `excluirTarefa(id)` |

### 📌 Detalhes importantes

- Todos os retornos seguem o padrão `{ ok: true/false }`.
- Em caso de erro interno, o backend retorna **500** com `{ ok: false, erro: "mensagem" }`.
- Procedures utilizadas localizadas em:
  `modelo/versao3/man/manTarefas.sql`.

---

## Usuários (`/usuarios`)

Gerencia o cadastro de usuários do sistema, incluindo criação, edição, listagem e exclusão.

### 🔗 Endpoints de usuários

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/usuarios` | Lista todos os usuários. | Não se aplica. | `{ ok: true, dados: [...] }` | `buscaUsuarios()` |
| **POST** | `/usuarios` | Cria um novo usuário. | nickname, nome, tipo, senha. | `{ ok: true, dados: {...} }` | `novoRegistroUsuario(...)` |
| **PUT** | `/usuarios` | Edita dados de um usuário existente. | old_nickname, new_nickname, new_nome, new_tipo, new_senha. | `{ ok: true, dados: {...} }` | `editarRegistroUsuario(...)` |
| **DELETE** | `/usuarios/:nickname` | Exclui usuário pelo nickname. | Não se aplica. | `{ ok: true, dados: {...} }` | `excluirRegistroUsuario(nickname)` |

### 📌 Detalhes importantes

- A edição utiliza **old_nickname** para localizar o usuário.
- A exclusão utiliza o **nickname** direto na URL.
- Em caso de erro, é retornado status **500**.
- Procedures utilizadas em:
  `modelo/versao3/man/manUsuarios.sql`.

---

## Eventos (`/eventos`)

Gerencia eventos reprodutivos e de mortalidade na granja, incluindo coberturas, partos, desmames e óbitos.

### 🔗 Endpoints de eventos

#### 📍 Cobertura/Inseminação

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/eventos/cobertura` | Registra novo evento de cobertura/inseminação. | dataCobertura, matrizId, tipo, observacoes. | Objeto do evento criado. | `novoEventoCoberturaInseminacao(...)` |
| **DELETE** | `/eventos/cobertura/:id` | Exclui evento de cobertura pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirEventoCoberturaInseminacao($1)` |

#### 📍 Parto

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/eventos/parto` | Registra novo evento de parto. | data, matrizId, quantidadeNascidos, observacoes. | Objeto do evento criado. | `novoEventoParto(...)` |
| **DELETE** | `/eventos/parto/:id` | Exclui evento de parto pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirEventoParto($1)` |

#### 📍 Desmame

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/eventos/desmame` | Registra novo evento de desmame. | data, loteId, quantidadeDesmamados, observacoes. | Objeto do evento criado. | `novoEventoDesmame(...)` |
| **DELETE** | `/eventos/desmame/:id` | Exclui evento de desmame pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirEventoDesmame($1)` |

#### 📍 Morte de Lote

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/eventos/morte-lote` | Registra morte em lote. | loteData, loteIdLote, loteCausaMorte, loteObservacoes. | Objeto do evento criado. | `novoEventoMorteLote(...)` |
| **DELETE** | `/eventos/morte-lote/:id` | Exclui evento de morte de lote pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirEventoMorteLote($1)` |

#### 📍 Morte de Fêmea

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **POST** | `/eventos/morte-femea` | Registra morte de matriz/fêmea. | femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes. | Objeto do evento criado. | `novoEventoMorteFemea(...)` |
| **DELETE** | `/eventos/morte-femea/:id` | Exclui evento de morte de fêmea pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirEventoMorteFemea($1)` |

### 📌 Detalhes importantes

- Todos os eventos devem incluir data no formato `YYYY-MM-DD`.
- Os IDs de matriz e lote devem corresponder a registros existentes.
- Procedures utilizadas em: `modelo/versao3/man/manEventos.sql`.

---

## Financeiro (`/financeiro`)

Gerencia registros financeiros de receitas e despesas da granja.

### 🔗 Endpoints de financeiro

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/financeiro` | Lista todos os registros financeiros. | Não se aplica. | Lista de objetos financeiros. | `buscaFinanceiro()` |
| **POST** | `/financeiro` | Cria novo registro financeiro. | data, descricao, valor, tipo, categoria. | Objeto do registro criado. | `novoRegistroFinanceiro(...)` |
| **PUT** | `/financeiro/:id` | Edita registro financeiro existente. | data, descricao, valor, tipo, categoria. | Objeto do registro editado. | `editarRegistroFinanceiro(...)` |
| **DELETE** | `/financeiro/:id` | Exclui registro financeiro pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirRegistroFinanceiro($1)` |

### 📌 Detalhes importantes

- **tipo** deve ser "receita" ou "despesa".
- **categoria** classifica a natureza do registro (exemplo: venda, compra, manutenção).
- **valor** deve ser numérico positivo.
- Procedures utilizadas em: `modelo/versao3/man/manFinanceiro.sql`.

---

## Genéticas (`/geneticas`)

Gerencia informações sobre linhagens genéticas de animais utilizadas na granja.

### 🔗 Endpoints de genéticas

| Método | Rota | Descrição | Body | Resposta de sucesso | Stored procedure/Function |
|--------|-------|------------|-------|------------------------|------------------------------|
| **GET** | `/geneticas` | Lista todas as genéticas cadastradas. | Não se aplica. | Lista de objetos de genéticas. | `buscaGenetica("")` |
| **POST** | `/geneticas` | Cria ou edita genética (upsert). Com `id` edita, sem `id` cria. | **Sem id:** nome, descricao, caracteristicas. <br> **Com id:** nome, descricao, caracteristicas, status, id. | Objeto da genética criada/editada. | `novoRegistroGenetica(...)`, `editaRegistroGenetica(...)` |
| **DELETE** | `/geneticas/:id` | Exclui genética pelo ID. | Não se aplica. | Confirmação de exclusão. | `excluirRegistroGenetica($1)` |

### 🔗 Endpoints auxiliares

| Método | Rota | Descrição | Resposta | Function |
|--------|------|-----------|----------|----------|
| **GET** | `/geneticas/nomes` | Retorna apenas nomes das genéticas. | Lista de nomes. | `listaNomesGeneticas()` |
| **GET** | `/geneticas/paginadas` | Retorna listagem paginada de genéticas. | Lista paginada. | `listagemFinalPaginaGeneticas()` |

### 📌 Detalhes importantes

- **POST** funciona como upsert: presença de `id` determina edição.
- **caracteristicas** armazena atributos específicos da linhagem.
- **status** indica se a genética está ativa ou inativa.
- Procedures utilizadas em: `modelo/versao3/man/manGenetica.sql`.

---
