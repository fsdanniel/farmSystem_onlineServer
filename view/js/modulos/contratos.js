// Arquivo: js/modulos/contratos.js
// Módulo para gerenciar o CRUD de Contratos (Admin) e
// a visualização de Contratos (Vet, Funcionario).

"use strict";

// --- DADOS MOCADOS (Simulação de BD de Contratos) ---
let mockContratos = [
    {
        id: 1,
        fornecedor: "AgroCereais S.A.",
        objeto: "Fornecimento de 10T de milho/mês",
        dataInicio: "2024-01-01",
        dataVencimento: "2025-01-01"
    },
    {
        id: 2,
        fornecedor: "GenetiPorc Ltda.",
        objeto: "Aquisição de material genético (Sêmen Duroc)",
        dataInicio: "2024-06-01",
        dataVencimento: "2024-12-31"
    },
    {
        id: 3,
        fornecedor: "TransGrãos Cargas",
        objeto: "Transporte de grãos (Silo -> Granja)",
        dataInicio: "2023-03-01",
        dataVencimento: "2024-03-01" // Vencido
    }
];
let proximoContratoId = 4;
let contratoEditando = null;

// --- API SIMULADA (async/await) ---
const SIMULATED_DELAY_CONTRATOS = 200;

async function fetchContratos() {
    console.log("BACKEND (SIM): Buscando contratos...");
    return new Promise(resolve => {
        setTimeout(() => resolve([...mockContratos]), SIMULATED_DELAY_CONTRATOS);
    });
}

async function saveContrato(dadosContrato) {
    console.log("BACKEND (SIM): Salvando contrato...", dadosContrato);
    return new Promise((resolve) => {
        setTimeout(() => {
            // ATUALIZAÇÃO
            if (dadosContrato.id) {
                const index = mockContratos.findIndex(c => c.id === dadosContrato.id);
                if (index !== -1) {
                    mockContratos[index] = { ...mockContratos[index], ...dadosContrato };
                    resolve({ success: true, data: mockContratos[index] });
                }
            } 
            // CRIAÇÃO
            else {
                const novoContrato = { ...dadosContrato, id: proximoContratoId++ };
                mockContratos.push(novoContrato);
                resolve({ success: true, data: novoContrato });
            }
        }, SIMULATED_DELAY_CONTRATOS);
    });
}

async function deleteContrato(id) {
    console.log("BACKEND (SIM): Excluindo contrato ID:", id);
    return new Promise(resolve => {
        setTimeout(() => {
            mockContratos = mockContratos.filter(c => c.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY_CONTRATOS);
    });
}


// === INICIALIZAÇÃO DO MÓDULO ===

async function inicializarModuloContratos() {
    // Seletores (Modal)
    const modalContrato = document.getElementById('modal-contrato');
    const formContrato = document.getElementById('form-contrato');
    const btnAbrirModalContrato = document.getElementById('btn-abrir-modal-contrato');
    const btnFecharModalContrato = document.getElementById('btn-x-fechar-modal-contrato');
    const btnCancelarModalContrato = document.getElementById('btn-cancelar-modal-contrato');
    
    // Seletores (Admin View)
    // Usamos querySelectorAll para pegar todos os elementos que só o admin vê
    const adminViews = document.querySelectorAll('#contratos-section .admin-view');
    const tabelaBodyContratos = document.getElementById('tabela-contratos');

    // Se a tabela não estiver na página, não faz nada
    if (!tabelaBodyContratos) return;

    // --- Lógica de Permissão Visual ---
    const perfil = localStorage.getItem('perfilUsuario');
    
    // Carrega a tabela (passando o perfil para a função decidir se mostra os botões)
    await carregarContratos(perfil);

    // Mostra/Esconde elementos de Admin
    if (perfil === 'admin') {
        // Itera para mostrar o botão "Novo" e a coluna "Ações"
        adminViews.forEach(el => {
            if (el.tagName === 'TH') {
                el.style.display = 'table-cell'; // TH precisa de 'table-cell'
            } else {
                el.style.display = 'block'; // Botão usa 'block'
            }
        });

        // Listeners do Admin
        btnAbrirModalContrato.addEventListener('click', () => abrirModalContrato(null));
        
        tabelaBodyContratos.addEventListener('click', (e) => {
            const editId = e.target.dataset.editId;
            const deleteId = e.target.dataset.deleteId;
            if (editId) abrirModalContrato(Number(editId));
            if (deleteId) handleExcluirContrato(Number(deleteId));
        });
    }

    // --- Listeners Comuns (Modal) ---
    formContrato.addEventListener('submit', handleSalvarContrato);
    btnFecharModalContrato.addEventListener('click', fecharModalContrato);
    btnCancelarModalContrato.addEventListener('click', fecharModalContrato);
    modalContrato.addEventListener('click', (e) => {
        if (e.target === modalContrato) fecharModalContrato();
    });
}


// === FUNÇÕES DO MÓDULO ===

/**
 * Carrega e renderiza a tabela de contratos.
 * @param {string} perfil - O perfil do usuário logado (para decidir se mostra os botões)
 */
async function carregarContratos(perfil) {
    const tabelaBody = document.getElementById('tabela-contratos');
    if (!tabelaBody) return;
    
    tabelaBody.innerHTML = '<tr><td colspan="6">Carregando contratos...</td></tr>';
    const contratos = await fetchContratos();
    const hoje = new Date();
    
    // Ordena por data de vencimento (mais próximos primeiro)
    contratos.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));

    tabelaBody.innerHTML = '';
    if (contratos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum contrato cadastrado.</td></tr>';
        return;
    }

    contratos.forEach(contrato => {
        const tr = document.createElement('tr');
        const dataVenc = new Date(contrato.dataVencimento + 'T00:00:00'); // Trata como data local
        
        let statusBadge = '<span class="status-badge status-ativo">Vigente</span>';
        // Verifica se está vencido
        if (dataVenc < hoje) {
            statusBadge = '<span class="status-badge status-inativo">Vencido</span>';
        }

        tr.innerHTML = `
            <td>${contrato.fornecedor}</td>
            <td>${contrato.objeto}</td>
            <td>${formatarData(contrato.dataInicio)}</td>
            <td>${formatarData(contrato.dataVencimento)}</td>
            <td>${statusBadge}</td>
        `;

        // Adiciona a célula de Ações APENAS se for Admin
        if (perfil === 'admin') {
            tr.innerHTML += `
                <td>
                    <button class="btn btn-info btn-small" data-edit-id="${contrato.id}">Editar</button>
                    <button class="btn btn-danger btn-small" data-delete-id="${contrato.id}">Excluir</button>
                </td>
            `;
        }
        
        tabelaBody.appendChild(tr);
    });
}


/**
 * (ADMIN) Abre o modal para criar ou editar um contrato.
 * @param {number|null} id - O ID do contrato a ser editado, or null para criar.
 */
async function abrirModalContrato(id) {
    const form = document.getElementById('form-contrato');
    contratoEditando = null;
    form.reset();
    
    if (id) {
        // Modo Edição
        const contratos = await fetchContratos(); // Busca os dados mais recentes
        contratoEditando = contratos.find(c => c.id === id);
        if (contratoEditando) {
            document.getElementById('titulo-modal-contrato').textContent = 'Editar Contrato';
            document.getElementById('contrato-id-original').value = contratoEditando.id;
            document.getElementById('contrato-fornecedor').value = contratoEditando.fornecedor;
            document.getElementById('contrato-objeto').value = contratoEditando.objeto;
            document.getElementById('contrato-data-inicio').value = contratoEditando.dataInicio;
            document.getElementById('contrato-data-vencimento').value = contratoEditando.dataVencimento;
        }
    } else {
        // Modo Criação
        document.getElementById('titulo-modal-contrato').textContent = 'Novo Contrato';
        document.getElementById('contrato-id-original').value = '';
    }

    document.getElementById('modal-contrato').style.display = 'block';
}

function fecharModalContrato() {
    document.getElementById('modal-contrato').style.display = 'none';
    contratoEditando = null;
}

/**
 * (ADMIN) Lida com o submit do formulário de Criar/Editar Contrato.
 */
async function handleSalvarContrato(e) {
    e.preventDefault();
    
    const dados = {
        id: document.getElementById('contrato-id-original').value ? Number(document.getElementById('contrato-id-original').value) : null,
        fornecedor: document.getElementById('contrato-fornecedor').value,
        objeto: document.getElementById('contrato-objeto').value,
        dataInicio: document.getElementById('contrato-data-inicio').value,
        dataVencimento: document.getElementById('contrato-data-vencimento').value
    };

    if (!dados.fornecedor || !dados.objeto || !dados.dataInicio || !dados.dataVencimento) {
        mostrarNotificacao('Erro', 'Todos os campos são obrigatórios.');
        return;
    }

    try {
        await saveContrato(dados);
        await carregarContratos(localStorage.getItem('perfilUsuario')); // Recarrega a tabela
        fecharModalContrato();
        mostrarNotificacao('Sucesso!', `Contrato com "${dados.fornecedor}" salvo.`);
    } catch (error) {
        mostrarNotificacao('Erro ao Salvar', error.message);
    }
}

/**
 * (ADMIN) Lida com o clique no botão "Excluir".
 * @param {number} id - O ID do contrato a ser excluído.
 */
async function handleExcluirContrato(id) {
    const contratos = await fetchContratos();
    const item = contratos.find(c => c.id === id);
    if (!item) return;

    const onConfirm = async () => {
        try {
            await deleteContrato(id);
            await carregarContratos(localStorage.getItem('perfilUsuario')); // Recarrega a tabela
            mostrarNotificacao('Sucesso!', `Contrato "${item.objeto}" foi excluído.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    // Chama o modal de confirmação global (definido no app.js)
    mostrarConfirmacao('contrato', id, item.objeto, onConfirm);
}