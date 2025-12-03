// Arquivo: js/modulos/tarefas.js
// Módulo para gerenciar o CRUD de Tarefas (Admin) e
// a visualização/conclusão de tarefas (Funcionário).

"use strict";

// CONFIGURAÇÃO DA API
const API_URL_TAREFAS = 'http://undeluded-filmier-eusebio.ngrok-free.dev/api';

// Variáveis de Estado
let tarefaEditando = null;

// --- API REAL (Integração com Back-end) ---

/**
 * Busca TODAS as tarefas (para o Admin).
 */
async function fetchTarefas() {
    console.log("BACKEND (REAL): Buscando todas as tarefas...");
    try {
        const response = await fetch(`${API_URL_TAREFAS}/tarefas`);
        const data = await response.json();

        if (data.sucesso) {
            // Mapeamento: Backend (postgres) -> Frontend
            // Backend espera/retorna 'usuariresponsavel', front usa 'atribuidoA'
            return data.dados.map(t => ({
                id: t.id,
                titulo: t.titulo,
                descricao: t.descricao,
                atribuidoA: t.usuariresponsavel || t.usuarioresponsavel, // Tolerância a nomes de coluna
                prioridade: t.prioridade,
                status: t.status
            }));
        } else {
            console.error("Erro ao buscar tarefas:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        return [];
    }
}

/**
 * Busca apenas as tarefas do usuário logado (para Funcionário/Vet).
 * Otimização: Usa a rota específica do servidor.
 */
async function fetchMinhasTarefas(nomeUsuario) {
    console.log(`BACKEND (REAL): Buscando tarefas de ${nomeUsuario}...`);
    try {
        // Codifica o nome para URL (ex: "João Silva" -> "Jo%C3%A3o%20Silva")
        const nomeCodificado = encodeURIComponent(nomeUsuario);
        const response = await fetch(`${API_URL_TAREFAS}/tarefas/minhas/${nomeCodificado}`);
        const data = await response.json();

        if (data.sucesso) {
            return data.dados.map(t => ({
                id: t.id,
                titulo: t.titulo,
                descricao: t.descricao,
                atribuidoA: t.usuariresponsavel,
                prioridade: t.prioridade,
                status: t.status
            }));
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar minhas tarefas:", error);
        return [];
    }
}

async function saveTarefa(dadosTarefa) {
    console.log("BACKEND (REAL): Salvando tarefa...", dadosTarefa);

    const { id, titulo, descricao, atribuidoA, prioridade, status } = dadosTarefa;
    
    // Mapeamento inverso para o Backend (server.js espera 'usuariresponsavel')
    const body = {
        titulo,
        descricao,
        usuariresponsavel: atribuidoA, 
        prioridade,
        status: status || 'pendente'
    };

    let url = `${API_URL_TAREFAS}/tarefas`;
    let method = 'POST';

    if (id) {
        url = `${API_URL_TAREFAS}/tarefas/${id}`;
        method = 'PUT';
    }

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao salvar tarefa.");
    }

    return resultado;
}

async function deleteTarefa(id) {
    console.log("BACKEND (REAL): Excluindo tarefa ID:", id);
    
    const response = await fetch(`${API_URL_TAREFAS}/tarefas/${id}`, {
        method: 'DELETE'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao excluir tarefa.");
    }

    return resultado;
}

/**
 * Conclui uma tarefa específica.
 */
async function concluirTarefaAPI(id) {
    console.log(`BACKEND (REAL): Concluindo tarefa ${id}`);
    
    const response = await fetch(`${API_URL_TAREFAS}/tarefas/concluir/${id}`, {
        method: 'POST'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao concluir tarefa.");
    }

    return resultado;
}


// === INICIALIZAÇÃO DO MÓDULO ===

async function inicializarModuloTarefas() {
    // Seletores (Modal)
    const modalTarefa = document.getElementById('modal-tarefa');
    const formTarefa = document.getElementById('form-tarefa');
    const btnAbrirModalTarefa = document.getElementById('btn-abrir-modal-tarefa');
    const btnFecharModalTarefa = document.getElementById('btn-x-fechar-modal-tarefa');
    const btnCancelarModalTarefa = document.getElementById('btn-cancelar-modal-tarefa');
    
    // Seleciona elementos da view
    const adminViews = document.querySelectorAll('#tarefas-section .admin-view');
    const tabelaBodyAdmin = document.getElementById('tabela-tarefas-admin');
    const funcionarioViews = document.querySelectorAll('#tarefas-section .funcionario-view');
    const listaTarefasFuncionario = document.getElementById('lista-tarefas-funcionario');

    if (!adminViews.length && !funcionarioViews.length) return;

    const perfil = localStorage.getItem('perfilUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    if (perfil === 'admin') {
        adminViews.forEach(el => el.style.display = 'block');
        await carregarTabelaTarefasAdmin();

        // Listeners do Admin
        if (btnAbrirModalTarefa) {
            btnAbrirModalTarefa.addEventListener('click', () => abrirModalTarefa(null));
        }
        
        if (tabelaBodyAdmin) {
            tabelaBodyAdmin.addEventListener('click', (e) => {
                const editId = e.target.dataset.editId;
                const deleteId = e.target.dataset.deleteId;
                if (editId) abrirModalTarefa(Number(editId));
                if (deleteId) handleExcluirTarefa(Number(deleteId));
            });
        }

    } else {
        // Funcionários e Veterinários veem a lista de tarefas próprias
        funcionarioViews.forEach(el => el.style.display = 'block');
        await carregarListaTarefasFuncionario(nomeUsuario);

        // Listener do Funcionário (Concluir)
        if (listaTarefasFuncionario) {
            listaTarefasFuncionario.addEventListener('click', (e) => {
                const concluirId = e.target.dataset.concluirId;
                if (concluirId) handleConcluirTarefa(Number(concluirId), e.target);
            });
        }
    }

    // --- Listeners Comuns (Modal) ---
    if (formTarefa) formTarefa.addEventListener('submit', handleSalvarTarefa);
    if (btnFecharModalTarefa) btnFecharModalTarefa.addEventListener('click', fecharModalTarefa);
    if (btnCancelarModalTarefa) btnCancelarModalTarefa.addEventListener('click', fecharModalTarefa);
    if (modalTarefa) {
        modalTarefa.addEventListener('click', (e) => {
            if (e.target === modalTarefa) fecharModalTarefa();
        });
    }
}


// === FUNÇÕES DO MÓDULO ===

/**
 * (ADMIN) Carrega e renderiza a tabela de "Todas as Tarefas".
 */
async function carregarTabelaTarefasAdmin() {
    const tabelaBody = document.getElementById('tabela-tarefas-admin');
    if (!tabelaBody) return;
    
    tabelaBody.innerHTML = '<tr><td colspan="5">Carregando tarefas...</td></tr>';
    
    const tarefas = await fetchTarefas();
    
    // Ordena por status (pendentes primeiro) e depois por prioridade
    tarefas.sort((a, b) => {
        if (a.status === 'pendente' && b.status !== 'pendente') return -1;
        if (a.status !== 'pendente' && b.status === 'pendente') return 1;
        // Mapeia prioridade texto para número para ordenar
        const pMap = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return (pMap[b.prioridade] || 0) - (pMap[a.prioridade] || 0);
    });

    tabelaBody.innerHTML = '';
    if (tarefas.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma tarefa criada.</td></tr>';
        return;
    }

    tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');
        if(tarefa.status === 'concluida') {
            tr.style.opacity = '0.6';
            tr.style.textDecoration = 'line-through';
        }
        
        tr.innerHTML = `
            <td>${tarefa.titulo}</td>
            <td>${tarefa.atribuidoA || '-'}</td>
            <td><span class="status-badge prioridade-${tarefa.prioridade}">${tarefa.prioridade}</span></td>
            <td><span class="status-badge status-${tarefa.status}">${tarefa.status}</span></td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${tarefa.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${tarefa.id}">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

/**
 * (FUNCIONÁRIO) Carrega e renderiza a lista de "Minhas Tarefas".
 */
async function carregarListaTarefasFuncionario(nomeUsuario) {
    const listaDiv = document.getElementById('lista-tarefas-funcionario');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>Carregando suas tarefas...</p>';
    
    // Usa a rota otimizada do servidor que já filtra pelo usuário
    const minhasTarefas = await fetchMinhasTarefas(nomeUsuario);
    
    // Filtra visualmente apenas pendentes (caso a procedure traga concluídas)
    const pendentes = minhasTarefas.filter(t => t.status === 'pendente');
    
    pendentes.sort((a, b) => {
        const prioridades = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return (prioridades[b.prioridade] || 0) - (prioridades[a.prioridade] || 0);
    });

    listaDiv.innerHTML = '';
    if (pendentes.length === 0) {
        listaDiv.innerHTML = '<p style="text-align: center; color: #666;">Você não tem tarefas pendentes. Bom trabalho!</p>';
        return;
    }

    pendentes.forEach(tarefa => {
        const item = document.createElement('div');
        item.className = `tarefa-item prioridade-${tarefa.prioridade}`; 
        item.innerHTML = `
            <div class="tarefa-info">
                <strong>${tarefa.titulo}</strong>
                <p>${tarefa.descricao || 'Sem descrição.'}</p>
            </div>
            <button class="btn btn-primary btn-small" data-concluir-id="${tarefa.id}">Concluir</button>
        `;
        listaDiv.appendChild(item);
    });
}

/**
 * (ADMIN) Abre o modal para criar ou editar uma tarefa.
 */
async function abrirModalTarefa(id) {
    const form = document.getElementById('form-tarefa');
    tarefaEditando = null;
    form.reset();
    document.getElementById('tarefa-prioridade').value = 'media'; 
    
    // Popula o dropdown de funcionários
    await popularDropdownUsuarios();

    if (id) {
        // Modo Edição
        const tarefas = await fetchTarefas(); 
        tarefaEditando = tarefas.find(t => t.id === id);
        if (tarefaEditando) {
            document.getElementById('titulo-modal-tarefa').textContent = 'Editar Tarefa';
            document.getElementById('tarefa-id-original').value = tarefaEditando.id;
            document.getElementById('tarefa-titulo').value = tarefaEditando.titulo;
            document.getElementById('tarefa-descricao').value = tarefaEditando.descricao;
            document.getElementById('tarefa-atribuido-a').value = tarefaEditando.atribuidoA;
            document.getElementById('tarefa-prioridade').value = tarefaEditando.prioridade;
        }
    } else {
        // Modo Criação
        document.getElementById('titulo-modal-tarefa').textContent = 'Nova Tarefa';
        document.getElementById('tarefa-id-original').value = '';
    }

    const modal = document.getElementById('modal-tarefa');
    if(modal) modal.style.display = 'block';
}

function fecharModalTarefa() {
    const modal = document.getElementById('modal-tarefa');
    if(modal) modal.style.display = 'none';
    tarefaEditando = null;
}

/**
 * (HELPER) Popula o <select> de funcionários no modal de tarefas.
 * Reutiliza a função fetchUsuarios() do módulo usuarios.js.
 */
async function popularDropdownUsuarios() {
    const select = document.getElementById('tarefa-atribuido-a');
    if (!select) return;
    
    select.innerHTML = '<option value="">Carregando...</option>';

    try {
        if (typeof fetchUsuarios !== 'function') {
            console.warn("Módulo de usuários não disponível. Tentando carregar lista básica.");
            select.innerHTML = '<option value="">Erro: Módulo Usuários ausente</option>';
            return;
        }
        
        const usuarios = await fetchUsuarios(); 
        // Filtra para incluir apenas quem pode receber tarefas (não admin)
        // Ajuste conforme regra de negócio: talvez Admin também possa receber?
        const funcionarios = usuarios; 

        select.innerHTML = '<option value="">Selecione um funcionário...</option>';
        
        funcionarios.forEach(u => {
            // O value é o NOME porque o server.js salva o nome na procedure 'novoregistrotarefa'
            select.innerHTML += `<option value="${u.nome}">${u.nome} (${u.perfil})</option>`;
        });

    } catch (error) {
        console.error("Erro dropdown usuários:", error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

/**
 * (ADMIN) Lida com o submit do formulário de Criar/Editar Tarefa.
 */
async function handleSalvarTarefa(e) {
    e.preventDefault();
    
    const idOriginal = document.getElementById('tarefa-id-original').value;

    const dados = {
        id: idOriginal ? Number(idOriginal) : null,
        titulo: document.getElementById('tarefa-titulo').value,
        descricao: document.getElementById('tarefa-descricao').value,
        atribuidoA: document.getElementById('tarefa-atribuido-a').value,
        prioridade: document.getElementById('tarefa-prioridade').value,
        status: 'pendente' // Edição não muda status aqui, só detalhes
    };

    if (!dados.titulo || !dados.atribuidoA) {
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', 'Preencha os campos obrigatórios.');
        return;
    }

    try {
        await saveTarefa(dados);
        await carregarTabelaTarefasAdmin(); 
        fecharModalTarefa();
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', `Tarefa salva.`);
    } catch (error) {
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro ao Salvar', error.message);
    }
}

/**
 * (ADMIN) Lida com o clique no botão "Excluir".
 */
function handleExcluirTarefa(id) {
    const onConfirm = async () => {
        try {
            await deleteTarefa(id);
            await carregarTabelaTarefasAdmin(); 
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', 'Tarefa excluída.');
        } catch (error) {
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('tarefa', id, 'esta tarefa', onConfirm);
    } else {
        if(confirm(`Excluir tarefa ID ${id}?`)) onConfirm();
    }
}

/**
 * (FUNCIONÁRIO) Lida com o clique no botão "Concluir".
 */
async function handleConcluirTarefa(id, botao) {
    botao.disabled = true;
    botao.textContent = '...';

    try {
        await concluirTarefaAPI(id);
        
        // Efeito visual de remoção
        const itemTarefa = botao.closest('.tarefa-item');
        if (itemTarefa) {
            itemTarefa.style.opacity = '0';
            setTimeout(() => {
                itemTarefa.remove();
                const lista = document.getElementById('lista-tarefas-funcionario');
                if (lista && lista.children.length === 0) {
                     lista.innerHTML = '<p style="text-align: center; color: #666;">Você não tem tarefas pendentes. Bom trabalho!</p>';
                }
            }, 300);
        }
        
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', 'Tarefa concluída!');
    } catch (error) {
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', 'Não foi possível concluir a tarefa.');
        botao.disabled = false;
        botao.textContent = 'Concluir';
    }
}