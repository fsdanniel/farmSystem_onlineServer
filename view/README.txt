Projeto: Sistema de Gestão de Granja (Frontend)
Este documento serve como o guia oficial para desenvolvedores do frontend do Sistema de Gestão de Granja. 
O projeto está num estado "feature-complete", com todos os módulos principais integrados e funcionais.

Como Executar o Projeto
O projeto é um frontend puro (HTML/CSS/JS) e não requer um backend para ser executado (os dados são simulados).
Pré-requisitos: Um editor de código (como VS Code) e a extensão "Live Server".
Abrir o Projeto: Abra a pasta view/ no VS Code.
Executar: Clique com o botão direito no ficheiro index.html e selecione "Open with Live Server".
Acesso: O sistema irá abrir no seu navegador. A primeira página é o login.

Informações de Login (Mocadas)
O sistema simula três perfis de usuário distintos. O login é validado no js/login.js e a sessão é guardada no localStorage do navegador.
Use as seguintes credenciais para testar os diferentes níveis de acesso:

Perfil: Administrador
Usuário (ID de Login): admin
Senha: 123
Nome (Salvo na Sessão): Administrador

Perfil: Veterinário
Usuário (ID de Login): vet
Senha: 123
Nome (Salvo na Sessão): Dr. João

Perfil: Funcionário
Usuário (ID de Login): func
Senha: 123
Nome (Salvo na Sessão): Carlos (Funcionário)

Arquitetura do Frontend (SPA Modular)
O projeto é uma Single Page Application (SPA) (app.html) precedida por uma página de login (index.html).
Estrutura de Ficheiros (Overview)
view/
├── css/
│   ├── global/
│   │   └── global.css   # (Design System: Cores, Fontes, Botões, Forms)
│   ├── app.css          # (Layout: Sidebar, Header, Tabelas, Modais)
│   └── style.css        # (Apenas da página de login)
│
├── js/
│   ├── modulos/
│   │   ├── veterinario.js # (Lógica: Genéticas, Lotes, Ocorrências...)
│   │   ├── insumos.js     # (Lógica: Gestão de Insumos)
│   │   ├── usuarios.js    # (Lógica: CRUD de Usuários)
│   │   ├── financeiro.js  # (Lógica: CRUD de Lançamentos)
│   │   ├── tarefas.js     # (Lógica: CRUD de Tarefas)
│   │   ├── contratos.js   # (Lógica: CRUD de Contratos)
│   │   ├── registros.js   # (Lógica: UI do menu de Registos)
│   │   └── relatorios.js  # (Lógica: UI do filtro de Relatórios)
│   │
│   ├── app.js           # (O "Maestro": Inicialização e Funções Globais)
│   └── login.js         # (Lógica de Autenticação)
│
├── app.html             # (A SPA: Layout principal e todas as secções)
└── index.html           # (A Página de Login)