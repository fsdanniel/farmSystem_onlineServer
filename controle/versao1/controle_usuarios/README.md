# Backend para Controle de Usuários

Este é o backend para o sistema de controle de usuários, desenvolvido em Node.js com Express e PostgreSQL.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [PostgreSQL](https://www.postgresql.org/)

## Instalação

1.  **Clone o repositório (ou baixe os arquivos):**

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd controle_usuarios
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure o Banco de Dados:**
    - Crie um banco de dados no PostgreSQL (por exemplo, `controle_usuarios`).
    - Execute o script `esquema_banco_de_dados.sql` para criar as tabelas.
    - Abra o arquivo `src/database/db.js` e atualize as credenciais de conexão com o seu banco de dados:
      ```javascript
      const pool = new Pool({
        user: 'seu_usuario_postgres',
        host: 'localhost',
        database: 'controle_usuarios',
        password: 'sua_senha_postgres',
        port: 5432,
      });
      ```

## Como Iniciar o Servidor

-   **Para desenvolvimento (com reinicialização automática ao salvar):**
    ```bash
    npm run dev
    ```

-   **Para produção:**
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:3000`.

## API Endpoints

A seguir estão os endpoints disponíveis para um cliente front-end consumir. O `userType` pode ser `administrador`, `funcionario` ou `veterinario`.

### Gerenciamento de Usuários

-   **`POST /api/users/:userType`**
    -   **Descrição:** Cria um novo usuário.
    -   **`userType`:** `administrador`, `funcionario`, `veterinario`.
    -   **Corpo da Requisição (JSON):**
        ```json
        {
          "nome": "Nome do Usuário",
          "senha": "uma_senha_forte",
          "nascimento": "YYYY-MM-DD",
          "email": "usuario@example.com"
        }
        ```
    -   **Resposta de Sucesso (201):**
        ```json
        {
          "prefix_id": 1,
          "prefix_nome": "Nome do Usuário",
          "prefix_senha": "uma_senha_forte",
          "prefix_nascimento": "YYYY-MM-DD",
          "prefix_email": "usuario@example.com",
          "prefix_ativo": true
        }
        ```
        *(O `prefix` será `Adm`, `Fun` ou `Vet` dependendo do `userType`)*

-   **`GET /api/users/:userType`**
    -   **Descrição:** Lista todos os usuários de um determinado tipo.
    -   **`userType`:** `administrador`, `funcionario`, `veterinario`.
    -   **Resposta de Sucesso (200):**
        ```json
        [
          {
            "prefix_id": 1,
            "prefix_nome": "Nome do Usuário",
            "prefix_email": "usuario@example.com",
            "prefix_nascimento": "YYYY-MM-DD",
            "prefix_ativo": true
          }
        ]
        ```

-   **`GET /api/users/:userType/:id`**
    -   **Descrição:** Busca um usuário específico pelo ID.
    -   **`userType`:** `administrador`, `funcionario`, `veterinario`.
    -   **`id`:** ID do usuário.
    -   **Resposta de Sucesso (200):**
        ```json
        {
          "prefix_id": 1,
          "prefix_nome": "Nome do Usuário",
          "prefix_email": "usuario@example.com",
          "prefix_nascimento": "YYYY-MM-DD",
          "prefix_ativo": true
        }
        ```

-   **`PUT /api/users/:userType/:id`**
    -   **Descrição:** Atualiza os dados de um usuário.
    -   **`userType`:** `administrador`, `funcionario`, `veterinario`.
    -   **`id`:** ID do usuário.
    -   **Corpo da Requisição (JSON):**
        ```json
        {
          "nome": "Nome Atualizado",
          "nascimento": "YYYY-MM-DD",
          "email": "email.atualizado@example.com",
          "ativo": false
        }
        ```
    -   **Resposta de Sucesso (200):** Retorna o objeto do usuário atualizado.

-   **`DELETE /api/users/:userType/:id`**
    -   **Descrição:** Exclui um usuário.
    -   **`userType`:** `administrador`, `funcionario`, `veterinario`.
    -   **`id`:** ID do usuário.
    -   **Resposta de Sucesso (204):** Nenhum conteúdo.

## Observações

-   Este backend implementa as funcionalidades básicas de gerenciamento de usuários conforme as histórias de usuário.
-   Não foram implementados mecanismos de autenticação (como JWT) ou controle de permissão a nível de rota (middleware que verifica se o usuário é administrador). A lógica de permissão está implícita no fato de que apenas um administrador teria acesso à interface para chamar esses endpoints. Para um sistema de produção, a implementação de autenticação e autorização é crucial.
-   A senha do usuário está sendo salva como texto plano. Em um ambiente de produção, é essencial usar hashing (ex: com a biblioteca `bcrypt`) para armazenar as senhas de forma segura.
