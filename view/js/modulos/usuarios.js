// Arquivo: js/modulos/usuarios.js
// Módulo para gerenciar o CRUD de Usuários (Admin)

"use strict";

// --- DADOS MOCADOS (Simulação de BD de Usuários) ---
// (O admin 'admin' não é listado aqui, pois ele vem do login.js)
let mockUsuarios = [
    { 
        idLogin: "vet", 
        nome: "Veterinário Padrão", 
        perfil: "veterinario",
        senhaHash: "123" // Em um app real, isso seria um hash (ex: $2a$10$...)
    },
    { 
        idLogin: "func", 
        nome: "Funcionário Padrão", 
        perfil: "funcionario",
        senhaHash: "123"
    },
    { 
        idLogin: "ana.silva", 
        nome: "Ana Silva", 
        perfil: "veterinario",
        senhaHash: "abc"
    }
];

// --- API SIMULADA (async/await) ---

async function fetchUsuarios() {
    console.log("BACKEND (SIM): Buscando usuários...");
    return new Promise(resolve => {
        setTimeout(() => {
            // Retorna uma cópia para evitar mutação direta
            resolve([...mockUsuarios]); 
        }, 300);
    });
}

/**
 * Salva (cria ou atualiza) um usuário.
 * Em um app real, o backend faria a lógica de hash da senha.
 */
async function saveUsuario(dadosUsuario) {
    console.log("BACKEND (SIM): Salvando usuário...", dadosUsuario);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { idLogin, idOriginal, nome, perfil, senha } = dadosUsuario;

            // Verifica se o ID de Login já existe (ao criar ou renomear)
            if (idLogin !== idOriginal && mockUsuarios.find(u => u.idLogin === idLogin)) {
                reject(new Error(`O ID de Login "${idLogin}" já está em uso.`));
                return;
            }
            
            // Encontra o usuário para ATUALIZAR
            if (idOriginal) {
                const usuarioExistente = mockUsuarios.find(u => u.idLogin === idOriginal);
                if (usuarioExistente) {
                    usuarioExistente.idLogin = idLogin; // Atualiza o ID
                    usuarioExistente.nome = nome;
                    usuarioExistente.perfil = perfil;
                    // Atualiza a senha apenas se uma nova foi fornecida
                    if (senha) {
                        usuarioExistente.senhaHash = senha; // Simulando hash
                    }
                    resolve({ success: true, data: usuarioExistente });
                } else {
                    reject(new Error("Usuário para edição não encontrado."));
                }
            } 
            // Cria um NOVO usuário
            else {
                const novoUsuario = {
                    idLogin: idLogin,
                    nome: nome,
                    perfil: perfil,
                    senhaHash: senha // Simulando hash
                };
                mockUsuarios.push(novoUsuario);
                resolve({ success: true, data: novoUsuario });
            }
        }, 500);
    });
}

async function deleteUsuario(idLogin) {
    console.log("BACKEND (SIM): Excluindo usuário ID:", idLogin);
    return new Promise(resolve => {
        setTimeout(() => {
            mockUsuarios = mockUsuarios.filter(u => u.idLogin !== idLogin);
            resolve({ success: true });
        }, 500);
    });
}


// === INICIALIZAÇÃO DO MÓDULO ===

async function inicializarModuloUsuarios() {
    // Seletores específicos do módulo
    const tabelaBody = document.getElementById('tabela-usuarios');
    const formNovoUsuario = document.getElementById('form-novo-usuario');
    const btnSalvarNovoUsuario = document.getElementById('btn-salvar-novo-usuario');
    
    // Seletores do Modal de Edição
    const modalEdicao = document.getElementById('modal-usuario');
    const formEditarUsuario = document.getElementById('form-editar-usuario');
    const btnFecharModalEdicao = document.getElementById('btn-x-fechar-modal-usuario');
    const btnCancelarModalEdicao = document.getElementById('btn-cancelar-modal-usuario');

        // Carrega os dados iniciais
    await carregarUsuarios();

    // Configura a busca na tabela de usuários
    configurarBuscaUsuarios();

    

    // Listener para o formulário de NOVO usuário
    formNovoUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            idLogin: document.getElementById('usuario-id-login').value,
            nome: document.getElementById('usuario-nome').value,
            senha: document.getElementById('usuario-senha').value,
            perfil: document.getElementById('usuario-perfil').value,
            idOriginal: null // Flag para "criar"
        };

        // Validação simples
        if (dados.senha.length < 3) { // Em produção, seria > 6
             mostrarNotificacao('Erro', 'A senha deve ter no mínimo 3 caracteres.');
             return;
        }

        btnSalvarNovoUsuario.disabled = true;
        btnSalvarNovoUsuario.textContent = 'Salvando...';

        try {
            await saveUsuario(dados);
            await carregarUsuarios(); // Recarrega a tabela
            formNovoUsuario.reset();
            mostrarNotificacao('Sucesso!', `Usuário "${dados.idLogin}" criado.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Salvar', error.message);
        }

        btnSalvarNovoUsuario.disabled = false;
        btnSalvarNovoUsuario.textContent = 'Salvar Novo Usuário';
    });

    // Listener para o formulário de EDIÇÃO (no modal)
    formEditarUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            idOriginal: document.getElementById('edit-usuario-id-original').value,
            idLogin: document.getElementById('edit-usuario-id-login').value,
            nome: document.getElementById('edit-usuario-nome').value,
            perfil: document.getElementById('edit-usuario-perfil').value,
            senha: document.getElementById('edit-usuario-senha').value // Pode estar vazio
        };

        try {
            await saveUsuario(dados);
            await carregarUsuarios(); // Recarrega a tabela
            fecharModalUsuario();
            mostrarNotificacao('Sucesso!', `Usuário "${dados.idLogin}" atualizado.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Salvar', error.message);
        }
    });

    // Listener para os botões na TABELA (Editar/Excluir)
    tabelaBody.addEventListener('click', (e) => {
        const editId = e.target.dataset.editId;
        const deleteId = e.target.dataset.deleteId;

        if (editId) {
            abrirModalUsuario(editId);
        }
        if (deleteId) {
            handleExcluirUsuario(deleteId);
        }
    });

    // Listeners para FECHAR o modal de edição
    btnFecharModalEdicao.addEventListener('click', fecharModalUsuario);
    btnCancelarModalEdicao.addEventListener('click', fecharModalUsuario);
    modalEdicao.addEventListener('click', (e) => {
        if (e.target === modalEdicao) fecharModalUsuario();
    });
}


// === FUNÇÕES DO MÓDULO ===

/**
 * Carrega e renderiza a tabela de usuários.
 */
async function carregarUsuarios() {
    const tabelaBody = document.getElementById('tabela-usuarios');
    if (!tabelaBody) return; // Sai se a seção não estiver visível/pronta
    
    tabelaBody.innerHTML = '<tr><td colspan="4">Carregando usuários...</td></tr>';
    const usuarios = await fetchUsuarios();

    tabelaBody.innerHTML = ''; // Limpa o "Carregando"
    if (usuarios.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.idLogin}</td>
            <td>${user.nome}</td>
            <td><span class="status-badge status-${user.perfil || 'inativo'}">${user.perfil}</span></td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${user.idLogin}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${user.idLogin}">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}
function configurarBuscaUsuarios() {
    const inputBusca = document.getElementById('busca-usuarios');
    const tabelaBody = document.getElementById('tabela-usuarios');

    if (!inputBusca || !tabelaBody) return;

    inputBusca.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim();
        const linhas = tabelaBody.querySelectorAll('tr');

        linhas.forEach((linha) => {
            const textoLinha = linha.innerText.toLowerCase();

            if (!termo || textoLinha.includes(termo)) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
}


/**
 * Abre o modal de edição e preenche com os dados do usuário.
 * @param {string} idLogin - O ID do usuário a ser editado.
 */
function abrirModalUsuario(idLogin) {
    const usuario = mockUsuarios.find(u => u.idLogin === idLogin);
    if (!usuario) {
        mostrarNotificacao('Erro', 'Usuário não encontrado.');
        return;
    }

    // Preenche os campos do modal
    document.getElementById('edit-usuario-id-original').value = usuario.idLogin;
    document.getElementById('edit-usuario-id-login').value = usuario.idLogin;
    document.getElementById('edit-usuario-nome').value = usuario.nome;
    document.getElementById('edit-usuario-perfil').value = usuario.perfil;
    document.getElementById('edit-usuario-senha').value = ''; // Limpa o campo senha

    // Mostra o modal
    document.getElementById('modal-usuario').style.display = 'block';
}

/**
 * Fecha o modal de edição.
 */
function fecharModalUsuario() {
    document.getElementById('modal-usuario').style.display = 'none';
}

/**
 * Lida com o clique no botão "Excluir".
 * @param {string} idLogin - O ID do usuário a ser excluído.
 */
function handleExcluirUsuario(idLogin) {
    // Define a função de callback que será executada na confirmação
    const onConfirm = async () => {
        try {
            await deleteUsuario(idLogin);
            await carregarUsuarios(); // Recarrega a tabela
            mostrarNotificacao('Sucesso!', `Usuário "${idLogin}" foi excluído.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    // Chama o modal de confirmação global
    mostrarConfirmacao('usuário', idLogin, idLogin, onConfirm);
}