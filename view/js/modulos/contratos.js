// Módulo para gerenciar o CRUD de Contratos (Admin) e
// a visualização de Contratos (Vet, Funcionario).

"use strict";

// CONFIGURAÇÃO DA API
// Ajustado para uso relativo (mesmo domínio do servidor web)
const API_URL = 'http://undeluded-filmier-eusebio.ngrok-free.dev/api';

// Variáveis de Estado
let contratoEditando = null;

// --- API REAL (Integração com Back-end) ---

/**
 * Busca a lista de contratos do servidor.
 */
async function fetchContratos() {
    console.log("BACKEND (REAL): Buscando contratos...");
    try {
        const response = await fetch(`${API_URL}/contratos`);
        const data = await response.json();

        if (data.sucesso) {
            return data.dados;
        } else {
            console.error("Erro ao buscar contratos:", data.erro);
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
 * Salva (cria ou atualiza) um contrato.
 */
async function saveContrato(dadosContrato) {
    console.log("BACKEND (REAL): Salvando contrato...", dadosContrato);

    const { id, fornecedor, objeto, dataInicio, dataVencimento } = dadosContrato;

    // Define se é criação (POST) ou edição (PUT)
    const metodo = id ? 'PUT' : 'POST';
    
    // Constrói a URL correta
    let url = `${API_URL}/contratos`;
    if (id) {
        url = `${API_URL}/contratos/${id}`;
    }

    // O servidor espera exatamente estas chaves no JSON
    const body = {
        fornecedor,
        objeto,
        dataInicio,
        dataVencimento
    };

    const response = await fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao salvar contrato.");
    }

    return resultado;
}

/**
 * Exclui um contrato pelo ID.
 */
async function deleteContrato(id) {
    console.log("BACKEND (REAL): Excluindo contrato ID:", id);
    
    const response = await fetch(`${API_URL}/contratos/${id}`, {
        method: 'DELETE'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao excluir contrato.");
    }

    return resultado;
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
        if (btnAbrirModalContrato) {
            btnAbrirModalContrato.addEventListener('click', () => abrirModalContrato(null));
        }
        
        tabelaBodyContratos.addEventListener('click', (e) => {
            const editId = e.target.dataset.editId;
            const deleteId = e.target.dataset.deleteId;
            if (editId) abrirModalContrato(Number(editId));
            if (deleteId) handleExcluirContrato(Number(deleteId));
        });
    }

    // --- Listeners Comuns (Modal) ---
    if (formContrato) formContrato.addEventListener('submit', handleSalvarContrato);
    if (btnFecharModalContrato) btnFecharModalContrato.addEventListener('click', fecharModalContrato);
    if (btnCancelarModalContrato) btnCancelarModalContrato.addEventListener('click', fecharModalContrato);
    if (modalContrato) {
        modalContrato.addEventListener('click', (e) => {
            if (e.target === modalContrato) fecharModalContrato();
        });
    }
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
    
    // Busca dados reais
    const contratos = await fetchContratos();
    const hoje = new Date();
    
    // Ordena por data de vencimento (mais próximos primeiro)
    // OBS: O Postgres pode retornar dataVencimento ou datavencimento (case sensitive no JS)
    // Vamos garantir que acessamos a propriedade correta.
    if (contratos && contratos.length > 0) {
        contratos.sort((a, b) => {
            const dataA = new Date(a.dataVencimento || a.datavencimento);
            const dataB = new Date(b.dataVencimento || b.datavencimento);
            return dataA - dataB;
        });
    }

    tabelaBody.innerHTML = '';
    if (!contratos || contratos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum contrato cadastrado.</td></tr>';
        return;
    }

    contratos.forEach(contrato => {
        // Adaptação para garantir leitura independente de como o banco retorna (camelCase ou snake_case)
        const id = contrato.id;
        const fornecedor = contrato.fornecedor;
        const objeto = contrato.objeto;
        // O banco retorna strings ISO (ex: 2024-01-01T00:00:00.000Z) ou strings simples
        const dtInicio = contrato.dataInicio || contrato.datainicio;
        const dtVenc = contrato.dataVencimento || contrato.datavencimento;

        const tr = document.createElement('tr');
        
        // Verifica se a data é válida antes de criar o objeto Date
        const dataVencObj = new Date(dtVenc);
        
        let statusBadge = '<span class="status-badge status-ativo">Vigente</span>';
        // Compara timestamps
        if (dataVencObj.getTime() < hoje.getTime()) {
            statusBadge = '<span class="status-badge status-inativo">Vencido</span>';
        }

        tr.innerHTML = `
            <td>${fornecedor}</td>
            <td>${objeto}</td>
            <td>${formatarData(dtInicio)}</td>
            <td>${formatarData(dtVenc)}</td>
            <td>${statusBadge}</td>
        `;

        // Adiciona a célula de Ações APENAS se for Admin
        if (perfil === 'admin') {
            tr.innerHTML += `
                <td>
                    <button class="btn btn-info btn-small" data-edit-id="${id}">Editar</button>
                    <button class="btn btn-danger btn-small" data-delete-id="${id}">Excluir</button>
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
        // Modo Edição: Buscamos o contrato atualizado do servidor ou da lista em memória
        const contratos = await fetchContratos(); 
        contratoEditando = contratos.find(c => c.id == id); // == para pegar string vs number
        
        if (contratoEditando) {
            document.getElementById('titulo-modal-contrato').textContent = 'Editar Contrato';
            document.getElementById('contrato-id-original').value = contratoEditando.id;
            document.getElementById('contrato-fornecedor').value = contratoEditando.fornecedor;
            document.getElementById('contrato-objeto').value = contratoEditando.objeto;
            
            // Ajuste de data para o input type="date" (YYYY-MM-DD)
            const dtInicio = contratoEditando.dataInicio || contratoEditando.datainicio;
            const dtVenc = contratoEditando.dataVencimento || contratoEditando.datavencimento;

            document.getElementById('contrato-data-inicio').value = dtInicio ? dtInicio.split('T')[0] : '';
            document.getElementById('contrato-data-vencimento').value = dtVenc ? dtVenc.split('T')[0] : '';
        }
    } else {
        // Modo Criação
        document.getElementById('titulo-modal-contrato').textContent = 'Novo Contrato';
        document.getElementById('contrato-id-original').value = '';
    }

    const modal = document.getElementById('modal-contrato');
    if(modal) modal.style.display = 'block';
}

function fecharModalContrato() {
    const modal = document.getElementById('modal-contrato');
    if(modal) modal.style.display = 'none';
    contratoEditando = null;
}

/**
 * (ADMIN) Lida com o submit do formulário de Criar/Editar Contrato.
 */
async function handleSalvarContrato(e) {
    e.preventDefault();
    
    const idOriginal = document.getElementById('contrato-id-original').value;

    const dados = {
        id: idOriginal ? Number(idOriginal) : null,
        fornecedor: document.getElementById('contrato-fornecedor').value,
        objeto: document.getElementById('contrato-objeto').value,
        dataInicio: document.getElementById('contrato-data-inicio').value,
        dataVencimento: document.getElementById('contrato-data-vencimento').value
    };

    if (!dados.fornecedor || !dados.objeto || !dados.dataInicio || !dados.dataVencimento) {
        mostrarNotificacao('Erro', 'Todos os campos são obrigatórios.');
        return;
    }

    const btnSalvar = document.querySelector('#form-contrato button[type="submit"]');
    if(btnSalvar) {
        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Salvando...';
    }

    try {
        await saveContrato(dados);
        await carregarContratos(localStorage.getItem('perfilUsuario')); // Recarrega a tabela
        fecharModalContrato();
        mostrarNotificacao('Sucesso!', `Contrato com "${dados.fornecedor}" salvo.`);
    } catch (error) {
        mostrarNotificacao('Erro ao Salvar', error.message);
    } finally {
        if(btnSalvar) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar';
        }
    }
}

/**
 * (ADMIN) Lida com o clique no botão "Excluir".
 * @param {number} id - O ID do contrato a ser excluído.
 */
function handleExcluirContrato(id) {
    const onConfirm = async () => {
        try {
            await deleteContrato(id);
            await carregarContratos(localStorage.getItem('perfilUsuario')); 
            mostrarNotificacao('Sucesso!', 'Contrato excluído.');
        } catch (error) {
            mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('contrato', id, 'este item', onConfirm);
    } else {
        if(confirm(`Tem certeza que deseja excluir o contrato ID ${id}?`)) {
            onConfirm();
        }
    }
}