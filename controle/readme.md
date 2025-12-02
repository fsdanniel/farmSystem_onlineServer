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
