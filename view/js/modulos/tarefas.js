// Arquivo: js/modulos/tarefas.js
// Módulo para gerenciar o CRUD de Tarefas (Admin) e
// a visualização/conclusão de tarefas (Funcionário).

"use strict";

// --- DADOS MOCADOS (Simulação de BD de Tarefas) ---
// NOTA: "atribuidoA" deve corresponder ao 'nomeUsuario' salvo no localStorage
// (Ex: "Administrador", "Dr. João", "Carlos (Funcionário)")
let mockTarefas = [
    {
        id: 1,
        titulo: "Verificar Lote B-002 (Quarentena)",
        descricao: "Checar animais do Lote C-2024-003 que entraram em quarentena.",
        atribuidoA: "Dr. João", // Nome do 'vet' do login.js
        prioridade: "alta",
        status: "pendente" // 'pendente' ou 'concluida'
    },
    {
        id: 2,
        titulo: "Aplicar medicação (Lote A-001)",
        descricao: "Aplicar medicação X conforme protocolo.",
        atribuidoA: "Carlos (Funcionário)", // Nome do 'func' do login.js
        prioridade: "media",
        status: "pendente"
    },
    {
        id: 3,
        titulo: "Registar novo insumo (Milho)",
        descricao: "Registar a entrada da última compra de milho no sistema.",
        atribuidoA: "Carlos (Funcionário)",
        prioridade: "baixa",
        status: "concluida"
    },
    {
        id: 4,
        titulo: "Revisar contratos de fornecedores",
        descricao: "Verificar datas de vencimento dos contratos de milho e soja.",
        atribuidoA: "Administrador", // Nome do 'admin' do login.js
        prioridade: "baixa",
        status: "pendente"
    }
];
let proximaTarefaId = 5;
let tarefaEditando = null;

// --- API SIMULADA (async/await) ---
const SIMULATED_DELAY_TAREFAS = 200;

async function fetchTarefas() {
    console.log("BACKEND (SIM): Buscando tarefas...");
    return new Promise(resolve => {
        setTimeout(() => resolve([...mockTarefas]), SIMULATED_DELAY_TAREFAS);
    });
}

async function saveTarefa(dadosTarefa) {
    console.log("BACKEND (SIM): Salvando tarefa...", dadosTarefa);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // ATUALIZAÇÃO
            if (dadosTarefa.id) {
                const index = mockTarefas.findIndex(t => t.id === dadosTarefa.id);
                if (index !== -1) {
                    // Atualiza a tarefa existente
                    mockTarefas[index] = { 
                        ...mockTarefas[index], 
                        titulo: dadosTarefa.titulo,
                        descricao: dadosTarefa.descricao,
                        atribuidoA: dadosTarefa.atribuidoA,
                        prioridade: dadosTarefa.prioridade
                    };
                    resolve({ success: true, data: mockTarefas[index] });
                } else {
                    reject(new Error("Tarefa não encontrada para atualização."));
                }
            } 
            // CRIAÇÃO
            else {
                const novaTarefa = {
                    id: proximaTarefaId++,
                    titulo: dadosTarefa.titulo,
                    descricao: dadosTarefa.descricao,
                    atribuidoA: dadosTarefa.atribuidoA,
                    prioridade: dadosTarefa.prioridade,
                    status: "pendente" // Novas tarefas são sempre pendentes
                };
                mockTarefas.push(novaTarefa);
                resolve({ success: true, data: novaTarefa });
            }
        }, SIMULATED_DELAY_TAREFAS);
    });
}

async function deleteTarefa(id) {
    console.log("BACKEND (SIM): Excluindo tarefa ID:", id);
    return new Promise(resolve => {
        setTimeout(() => {
            mockTarefas = mockTarefas.filter(t => t.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY_TAREFAS);
    });
}

// API específica para "Concluir" (PUT/PATCH)
async function updateTarefaStatus(id, novoStatus) {
    console.log(`BACKEND (SIM): Atualizando status da tarefa ${id} para ${novoStatus}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const index = mockTarefas.findIndex(t => t.id === id);
            if (index !== -1) {
                mockTarefas[index].status = novoStatus;
                resolve({ success: true, data: mockTarefas[index] });
            } else {
                resolve({ success: false, message: "Tarefa não encontrada." });
            }
        }, SIMULATED_DELAY_TAREFAS);
    });
}


// === INICIALIZAÇÃO DO MÓDULO ===

async function inicializarModuloTarefas() {
    // Seletores (Modal)
    const modalTarefa = document.getElementById('modal-tarefa');
    const formTarefa = document.getElementById('form-tarefa');
    const btnAbrirModalTarefa = document.getElementById('btn-abrir-modal-tarefa');
    const btnFecharModalTarefa = document.getElementById('btn-x-fechar-modal-tarefa');
    const btnCancelarModalTarefa = document.getElementById('btn-cancelar-modal-tarefa');
    
    // Seleciona TODOS os elementos da view de Admin (CORREÇÃO DO BUG ANTERIOR)
    const adminViews = document.querySelectorAll('#tarefas-section .admin-view');
    const tabelaBodyAdmin = document.getElementById('tabela-tarefas-admin');

    // Seleciona TODOS os elementos da view de Funcionário (CORREÇÃO DO BUG ANTERIOR)
    const funcionarioViews = document.querySelectorAll('#tarefas-section .funcionario-view');
    const listaTarefasFuncionario = document.getElementById('lista-tarefas-funcionario');

    // Se a seção não estiver na página, não faz nada
    if (adminViews.length === 0 || funcionarioViews.length === 0) return;

    // --- Lógica de Permissão Visual ---
    // (Esta lógica depende da implementação das permissões no app.js)
    const perfil = localStorage.getItem('perfilUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    if (perfil === 'admin') {
        adminViews.forEach(el => el.style.display = 'block');
        await carregarTabelaTarefasAdmin();

        // Listeners do Admin
        btnAbrirModalTarefa.addEventListener('click', () => abrirModalTarefa(null));
        
        tabelaBodyAdmin.addEventListener('click', (e) => {
            const editId = e.target.dataset.editId;
            const deleteId = e.target.dataset.deleteId;
            if (editId) abrirModalTarefa(Number(editId));
            if (deleteId) handleExcluirTarefa(Number(deleteId));
        });

    } else if (perfil === 'funcionario') {
        funcionarioViews.forEach(el => el.style.display = 'block');
        await carregarListaTarefasFuncionario(nomeUsuario);

        // Listener do Funcionário (Concluir)
        listaTarefasFuncionario.addEventListener('click', (e) => {
            const concluirId = e.target.dataset.concluirId;
            if (concluirId) handleConcluirTarefa(Number(concluirId), e.target);
        });
    }

    // --- Listeners Comuns (Modal) ---
    formTarefa.addEventListener('submit', handleSalvarTarefa);
    btnFecharModalTarefa.addEventListener('click', fecharModalTarefa);
    btnCancelarModalTarefa.addEventListener('click', fecharModalTarefa);
    modalTarefa.addEventListener('click', (e) => {
        if (e.target === modalTarefa) fecharModalTarefa();
    });
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
        if (a.prioridade === 'alta' && b.prioridade !== 'alta') return -1;
        if (a.prioridade !== 'alta' && b.prioridade === 'alta') return 1;
        return 0;
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
            <td>${tarefa.atribuidoA}</td>
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
    const todasTarefas = await fetchTarefas();
    
    const minhasTarefas = todasTarefas.filter(t => 
        t.atribuidoA === nomeUsuario && t.status === 'pendente'
    );
    
    minhasTarefas.sort((a, b) => {
        const prioridades = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return (prioridades[b.prioridade] || 0) - (prioridades[a.prioridade] || 0);
    });

    listaDiv.innerHTML = '';
    if (minhasTarefas.length === 0) {
        listaDiv.innerHTML = '<p style="text-align: center; color: #666;">Você não tem tarefas pendentes. Bom trabalho!</p>';
        return;
    }

    minhasTarefas.forEach(tarefa => {
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
 * @param {number|null} id - O ID da tarefa a ser editada, or null para criar.
 */
async function abrirModalTarefa(id) {
    const form = document.getElementById('form-tarefa');
    tarefaEditando = null;
    form.reset();
    document.getElementById('tarefa-prioridade').value = 'media'; // Padrão
    
    // Popula o dropdown de funcionários
    await popularDropdownUsuarios();

    if (id) {
        // Modo Edição
        const tarefas = await fetchTarefas(); // Busca os dados mais recentes
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

    document.getElementById('modal-tarefa').style.display = 'block';
}

function fecharModalTarefa() {
    document.getElementById('modal-tarefa').style.display = 'none';
    tarefaEditando = null;
}

/**
 * (HELPER) Popula o <select> de funcionários no modal de tarefas.
 * Reutiliza a função fetchUsuarios() do módulo usuarios.js.
 */
async function popularDropdownUsuarios() {
    const select = document.getElementById('tarefa-atribuido-a');
    select.innerHTML = '<option value="">Carregando...</option>';

    try {
        // fetchUsuarios() é uma função exposta por usuarios.js
        if (typeof fetchUsuarios !== 'function') {
            throw new Error("Módulo de usuários não foi carregado.");
        }
        
        const usuarios = await fetchUsuarios(); 
        
        // Filtra para incluir apenas funcionários e veterinários
        const funcionarios = usuarios.filter(u => u.perfil === 'funcionario' || u.perfil === 'veterinario');

        select.innerHTML = '<option value="">Selecione um funcionário...</option>';
        
        // Lista consolidada de usuários que podem receber tarefas
        let usuariosParaTarefas = {};
        
        // Adiciona usuários do mock de usuários
        funcionarios.forEach(func => {
            usuariosParaTarefas[func.nome] = func.perfil;
        });
        
        // Adiciona usuários do mock de login (para garantir)
        const nomesLogin = [
            { nome: "Dr. João", perfil: "veterinario" },
            { nome: "Carlos (Funcionário)", perfil: "funcionario" }
        ];
        
        nomesLogin.forEach(u => {
            if (!usuariosParaTarefas[u.nome]) {
                usuariosParaTarefas[u.nome] = u.perfil;
            }
        });

        // Popula o select
        for (const nome in usuariosParaTarefas) {
            const perfil = usuariosParaTarefas[nome];
            select.innerHTML += `<option value="${nome}">${nome} (${perfil})</option>`;
        }

    } catch (error) {
        console.error("Erro ao popular dropdown de usuários:", error.message);
        select.innerHTML = '<option value="">Erro ao carregar usuários</option>';
    }
}

/**
 * (ADMIN) Lida com o submit do formulário de Criar/Editar Tarefa.
 */
async function handleSalvarTarefa(e) {
    e.preventDefault();
    
    const dados = {
        id: document.getElementById('tarefa-id-original').value ? Number(document.getElementById('tarefa-id-original').value) : null,
        titulo: document.getElementById('tarefa-titulo').value,
        descricao: document.getElementById('tarefa-descricao').value,
        atribuidoA: document.getElementById('tarefa-atribuido-a').value,
        prioridade: document.getElementById('tarefa-prioridade').value
    };

    if (!dados.titulo || !dados.atribuidoA) {
        mostrarNotificacao('Erro', 'Título e Funcionário são obrigatórios.');
        return;
    }

    try {
        await saveTarefa(dados);
        await carregarTabelaTarefasAdmin(); // Recarrega a tabela do Admin
        fecharModalTarefa();
        mostrarNotificacao('Sucesso!', `Tarefa "${dados.titulo}" salva.`);
    } catch (error) {
        mostrarNotificacao('Erro ao Salvar', error.message);
    }
}

/**
 * (ADMIN) Lida com o clique no botão "Excluir".
 * @param {number} id - O ID da tarefa a ser excluída.
 */
async function handleExcluirTarefa(id) {
    const tarefas = await fetchTarefas();
    const item = tarefas.find(t => t.id === id);
    if (!item) return;

    const onConfirm = async () => {
        try {
            await deleteTarefa(id);
            await carregarTabelaTarefasAdmin(); // Recarrega a tabela do Admin
            mostrarNotificacao('Sucesso!', `Tarefa "${item.titulo}" foi excluída.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    // Chama o modal de confirmação global (definido no app.js)
    mostrarConfirmacao('tarefa', id, item.titulo, onConfirm);
}

/**
 * (FUNCIONÁRIO) Lida com o clique no botão "Concluir".
 * @param {number} id - O ID da tarefa a ser concluída.
 * @param {HTMLElement} botao - O botão que foi clicado.
 */
async function handleConcluirTarefa(id, botao) {
    botao.disabled = true;
    botao.textContent = '...';

    try {
        await updateTarefaStatus(id, 'concluida');
        
        // Remove o item da lista visualmente
        const itemTarefa = botao.closest('.tarefa-item');
        if (itemTarefa) {
            // Animação de "saída"
            itemTarefa.style.opacity = '0';
            itemTarefa.style.transform = 'translateX(100px)';
            itemTarefa.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
                itemTarefa.remove();
                // Verifica se a lista ficou vazia
                const lista = document.getElementById('lista-tarefas-funcionario');
                if (lista && lista.children.length === 0) {
                     lista.innerHTML = '<p style="text-align: center; color: #666;">Você não tem tarefas pendentes. Bom trabalho!</p>';
                }
            }, 300); // Espera a animação
        }
        
        mostrarNotificacao('Sucesso!', 'Tarefa concluída!');
    } catch (error) {
        mostrarNotificacao('Erro', 'Não foi possível concluir a tarefa.');
        botao.disabled = false;
        botao.textContent = 'Concluir';
    }
}