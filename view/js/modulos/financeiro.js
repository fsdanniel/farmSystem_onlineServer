// Arquivo: js/modulos/financeiro.js
// Módulo para gerenciar o CRUD de Lançamentos Financeiros (Admin)

"use strict";

// --- DADOS MOCADOS (Simulação de BD de Lançamentos) ---
let mockLancamentos = [
    { 
        id: 1, 
        data: "2025-10-20", 
        descricao: "Compra de ração - Lote A", 
        tipo: "saida", 
        valor: 1500.75,
        categoria: "alimentacao"
    },
    { 
        id: 2, 
        data: "2025-10-22", 
        descricao: "Venda de 50 animais", 
        tipo: "entrada", 
        valor: 25000.00,
        categoria: "venda_animais"
    },
    { 
        id: 3, 
        data: "2025-10-23", 
        descricao: "Pagamento vacinas", 
        tipo: "saida", 
        valor: 350.00,
        categoria: "medicamentos"
    }
];
let proximoLancamentoId = 4;

// --- API SIMULADA (async/await) ---
const SIMULATED_DELAY_FINANCEIRO = 200;

async function fetchLancamentos() {
    console.log("BACKEND (SIM): Buscando lançamentos financeiros...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...mockLancamentos]); 
        }, SIMULATED_DELAY_FINANCEIRO);
    });
}

async function saveLancamento(dadosLancamento) {
    console.log("BACKEND (SIM): Salvando lançamento...", dadosLancamento);
    return new Promise((resolve) => {
        setTimeout(() => {
            // (Não temos edição neste módulo, apenas criação)
            const novoLancamento = {
                id: proximoLancamentoId++,
                data: dadosLancamento.data,
                descricao: dadosLancamento.descricao,
                tipo: dadosLancamento.tipo,
                valor: dadosLancamento.valor,
                categoria: dadosLancamento.categoria
            };
            mockLancamentos.push(novoLancamento);
            resolve({ success: true, data: novoLancamento });
        }, SIMULATED_DELAY_FINANCEIRO);
    });
}

async function deleteLancamento(id) {
    console.log("BACKEND (SIM): Excluindo lançamento ID:", id);
    return new Promise(resolve => {
        setTimeout(() => {
            mockLancamentos = mockLancamentos.filter(l => l.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY_FINANCEIRO);
    });
}


// === INICIALIZAÇÃO DO MÓDULO ===

async function inicializarModuloFinanceiro() {
    // Seletores específicos do módulo
    const tabelaBody = document.getElementById('tabela-financeiro');
    const formNovoLancamento = document.getElementById('form-novo-lancamento');
    const btnSalvarNovoLancamento = document.getElementById('btn-salvar-novo-lancamento');

    // Se o formulário não está na página (ex: usuário sem permissão), encerra
    if (!formNovoLancamento) return;

    // Carrega os dados iniciais
    await carregarLancamentos();

    // Listener para o formulário de NOVO lançamento
    formNovoLancamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            data: document.getElementById('lancamento-data').value,
            descricao: document.getElementById('lancamento-descricao').value,
            tipo: document.getElementById('lancamento-tipo').value,
            valor: parseFloat(document.getElementById('lancamento-valor').value),
            categoria: document.getElementById('lancamento-categoria').value
        };

        // Validação
        if (!dados.data || !dados.descricao || !dados.tipo || isNaN(dados.valor) || dados.valor <= 0) {
             mostrarNotificacao('Erro', 'Por favor, preencha todos os campos corretamente.');
             return;
        }

        btnSalvarNovoLancamento.disabled = true;
        btnSalvarNovoLancamento.textContent = 'Salvando...';

        try {
            await saveLancamento(dados);
            await carregarLancamentos(); // Recarrega a tabela
            formNovoLancamento.reset();
            // Define a data de hoje como padrão após salvar
            document.getElementById('lancamento-data').value = new Date().toISOString().split('T')[0];
            mostrarNotificacao('Sucesso!', `Lançamento de ${formatarMoeda(dados.valor)} salvo.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Salvar', error.message);
        }

        btnSalvarNovoLancamento.disabled = false;
        btnSalvarNovoLancamento.textContent = 'Salvar Lançamento';
    });

    // Listener para os botões na TABELA (Excluir)
    tabelaBody.addEventListener('click', (e) => {
        const deleteId = e.target.dataset.deleteId;

        if (deleteId) {
            handleExcluirLancamento(Number(deleteId));
        }
    });
    
    // Define a data de hoje como padrão no formulário ao carregar
    document.getElementById('lancamento-data').value = new Date().toISOString().split('T')[0];
}


// === FUNÇÕES DO MÓDULO ===

/**
 * Carrega e renderiza a tabela de lançamentos financeiros.
 */
async function carregarLancamentos() {
    const tabelaBody = document.getElementById('tabela-financeiro');
    if (!tabelaBody) return; 
    
    tabelaBody.innerHTML = '<tr><td colspan="6">Carregando lançamentos...</td></tr>';
    const lancamentos = await fetchLancamentos();
    // Ordena por data, mais recentes primeiro
    lancamentos.sort((a, b) => new Date(b.data) - new Date(a.data));

    tabelaBody.innerHTML = ''; // Limpa o "Carregando"
    if (lancamentos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum lançamento financeiro registrado.</td></tr>';
        return;
    }

    lancamentos.forEach(item => {
        const tr = document.createElement('tr');
        // Adiciona classe 'entrada' ou 'saida' para estilização futura
        tr.className = item.tipo === 'entrada' ? 'linha-entrada' : 'linha-saida';
        
        tr.innerHTML = `
            <td>${formatarData(item.data)}</td>
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td><span class="status-badge status-${item.tipo}">${item.tipo}</span></td>
            <td><span class="status-badge status-categoria">${item.categoria}</span></td>
            <td>
                <!-- (Não implementamos edição para lançamentos financeiros, apenas exclusão) -->
                <button class="btn btn-danger btn-small" data-delete-id="${item.id}">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });

    // (Futuramente, podemos adicionar uma função atualizarSaldo() aqui)
}

/**
 * Lida com o clique no botão "Excluir".
 * @param {number} id - O ID do lançamento a ser excluído.
 */
function handleExcluirLancamento(id) {
    // Acha o item para mostrar o nome no popup
    const item = mockLancamentos.find(l => l.id === id);
    const nomeItem = item ? `${item.descricao} (${formatarMoeda(item.valor)})` : `ID ${id}`;

    // Define a função de callback que será executada na confirmação
    const onConfirm = async () => {
        try {
            await deleteLancamento(id);
            await carregarLancamentos(); // Recarrega a tabela
            mostrarNotificacao('Sucesso!', `Lançamento "${nomeItem}" foi excluído.`);
        } catch (error) {
            mostrarNotificacao('Erro ao Excluir', error.message);
        }
    };

    // Chama o modal de confirmação global
    mostrarConfirmacao('lançamento', id, nomeItem, onConfirm);
}