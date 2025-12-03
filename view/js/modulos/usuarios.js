// Módulo para gerenciar o CRUD de Usuários (Admin)
// Arquivo: js/modulos/usuarios.js

"use strict";

// CONFIGURAÇÃO DA API
// Ajustado para uso relativo
const API_URL = '';

// --- API REAL (Integração com Back-end) ---

/**
 * Busca a lista de usuários do servidor e adapta para o formato do front-end.
 */
async function fetchUsuarios() {
    console.log("BACKEND (REAL): Buscando usuários...");
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const data = await response.json();

        if (data.sucesso) {
            // MAPEAMENTO: O banco retorna { nickname, nome, tipo }
            // O front espera { idLogin, nome, perfil }
            return data.dados.map(user => ({
                idLogin: user.nickname, // Traduz nickname -> idLogin
                nome: user.nome,
                perfil: user.tipo       // Traduz tipo -> perfil
            }));
        } else {
            console.error("Erro ao buscar usuários:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Erro', 'Não foi possível conectar ao servidor.');
        }
        return [];
    }
}

/**
 * Salva (cria ou atualiza) um usuário.
 */
async function saveUsuario(dadosUsuario) {
    console.log("BACKEND (REAL): Salvando usuário...", dadosUsuario);

    const { idLogin, idOriginal, nome, perfil, senha } = dadosUsuario;

    // Prepara o objeto conforme o server.js espera
    let body = {};

    if (idOriginal) {
        // EDIÇÃO (Backend verifica se existe 'old_nickname')
        body = {
            old_nickname: idOriginal,
            new_nickname: idLogin,
            new_nome: nome,
            new_tipo: perfil,
            new_senha: senha // Pode ser vazio se não trocou
        };
    } else {
        // CRIAÇÃO (Backend espera nickname, nome, tipo, senha)
        body = {
            nickname: idLogin,
            nome: nome,
            tipo: perfil,
            senha: senha
        };
    }

    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST', // O seu server usa POST para ambos (Create e Edit)
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao salvar usuário.");
    }

    return resultado;
}

/**
 * Exclui um usuário pelo ID (nickname).
 */
async function deleteUsuario(idLogin) {
    console.log("BACKEND (REAL): Excluindo usuário ID:", idLogin);
    
    // A rota no server é DELETE /usuarios/:nickname
    const response = await fetch(`${API_URL}/usuarios/${idLogin}`, {
        method: 'DELETE'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao excluir usuário.");
    }

    return resultado;
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
    if (formNovoUsuario) {
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
            if (dados.senha.length < 3) {
                 if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', 'A senha deve ter no mínimo 3 caracteres.');
                 return;
            }

            btnSalvarNovoUsuario.disabled = true;
            btnSalvarNovoUsuario.textContent = 'Salvando...';

            try {
                await saveUsuario(dados);
                await carregarUsuarios(); // Recarrega a tabela
                formNovoUsuario.reset();
                if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', `Usuário "${dados.idLogin}" criado.`);
            } catch (error) {
                if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro ao Salvar', error.message);
            } finally {
                btnSalvarNovoUsuario.disabled = false;
                btnSalvarNovoUsuario.textContent = 'Salvar Novo Usuário';
            }
        });
    }

    // Listener para o formulário de EDIÇÃO (no modal)
    if (formEditarUsuario) {
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
                if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', `Usuário "${dados.idLogin}" atualizado.`);
            } catch (error) {
                if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro ao Salvar', error.message);
            }
        });
    }

    // Listener para os botões na TABELA (Editar/Excluir)
    if (tabelaBody) {
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
    }

    // Listeners para FECHAR o modal de edição
    if (btnFecharModalEdicao) btnFecharModalEdicao.addEventListener('click', fecharModalUsuario);
    if (btnCancelarModalEdicao) btnCancelarModalEdicao.addEventListener('click', fecharModalUsuario);
    if (modalEdicao) {
        modalEdicao.addEventListener('click', (e) => {
            if (e.target === modalEdicao) fecharModalUsuario();
        });
    }
}


// === FUNÇÕES DO MÓDULO ===

/**
 * Carrega e renderiza a tabela de usuários.
 */
async function carregarUsuarios() {
    const tabelaBody = document.getElementById('tabela-usuarios');
    if (!tabelaBody) return; 
    
    tabelaBody.innerHTML = '<tr><td colspan="4">Carregando usuários...</td></tr>';
    
    // fetchUsuarios já retorna os dados traduzidos (idLogin, nome, perfil)
    const usuarios = await fetchUsuarios();

    tabelaBody.innerHTML = ''; 
    if (!usuarios || usuarios.length === 0) {
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
                <!-- Passando dados via dataset para facilitar preenchimento do modal -->
                <button class="btn btn-info btn-small" 
                        data-edit-id="${user.idLogin}"
                        data-nome="${user.nome}"
                        data-perfil="${user.perfil}">
                    Editar
                </button>
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
 */
function abrirModalUsuario(idLogin) {
    // Busca o botão que foi clicado para pegar os metadados (mais rápido que ir no array ou fetch)
    const btn = document.querySelector(`button[data-edit-id="${idLogin}"]`);
    
    if (!btn) return;

    const nome = btn.dataset.nome;
    const perfil = btn.dataset.perfil;

    // Preenche os campos do modal
    document.getElementById('edit-usuario-id-original').value = idLogin;
    document.getElementById('edit-usuario-id-login').value = idLogin;
    document.getElementById('edit-usuario-nome').value = nome;
    document.getElementById('edit-usuario-perfil').value = perfil;
    document.getElementById('edit-usuario-senha').value = ''; 

    // Mostra o modal
    const modal = document.getElementById('modal-usuario');
    if (modal) modal.style.display = 'block';
}

function fecharModalUsuario() {
    const modal = document.getElementById('modal-usuario');
    if (modal) modal.style.display = 'none';
}

function handleExcluirUsuario(idLogin) {
    const onConfirm = async () => {
        try {
            await deleteUsuario(idLogin);
            await carregarUsuarios(); 
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', `Usuário "${idLogin}" foi excluído.`);
        } catch (error) {
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('usuário', idLogin, idLogin, onConfirm);
    } else {
        if(confirm(`Excluir usuário ${idLogin}?`)) {
            onConfirm();
        }
    }
}