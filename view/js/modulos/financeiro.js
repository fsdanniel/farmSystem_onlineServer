// Arquivo: js/modulos/financeiro.js
// Módulo para gerenciar o CRUD de Lançamentos Financeiros (Admin)

"use strict";

// CONFIGURAÇÃO DA API
// Ajustado para uso relativo (mesmo domínio do servidor web)
const API_URL = 'https://undeluded-filmier-eusebio.ngrok-free.dev/api';

// --- API REAL (Integração com Back-end) ---

/**
 * Busca a lista de lançamentos financeiros do servidor.
 */
async function fetchLancamentos() {
    console.log("BACKEND (REAL): Buscando lançamentos financeiros...");
    try {
        const response = await fetch(`${API_URL}/financeiro`);
        const data = await response.json();

        if (data.sucesso) {
            return data.dados;
        } else {
            console.error("Erro ao buscar lançamentos:", data.erro);
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
 * Salva um novo lançamento financeiro.
 * (Neste módulo, por enquanto, temos apenas criação, sem edição)
 */
async function saveLancamento(dadosLancamento) {
    console.log("BACKEND (REAL): Salvando lançamento...", dadosLancamento);
    
    // O servidor espera: { data, descricao, valor, tipo, categoria }
    // O objeto dadosLancamento já deve estar nesse formato.
    
    const response = await fetch(`${API_URL}/financeiro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLancamento)
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao salvar lançamento.");
    }

    return resultado;
}

/**
 * Exclui um lançamento pelo ID.
 */
async function deleteLancamento(id) {
    console.log("BACKEND (REAL): Excluindo lançamento ID:", id);
    
    const response = await fetch(`${API_URL}/financeiro/${id}`, {
        method: 'DELETE'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao excluir lançamento.");
    }

    return resultado;
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

    // Define a data de hoje como padrão no formulário ao carregar
    const hoje = new Date().toISOString().split('T')[0];
    const inputData = document.getElementById('lancamento-data');
    if (inputData) inputData.value = hoje;

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
             if (typeof mostrarNotificacao === 'function') {
                 mostrarNotificacao('Erro', 'Por favor, preencha todos os campos corretamente.');
             } else {
                 alert('Por favor, preencha todos os campos corretamente.');
             }
             return;
        }

        btnSalvarNovoLancamento.disabled = true;
        btnSalvarNovoLancamento.textContent = 'Salvando...';

        try {
            await saveLancamento(dados);
            await carregarLancamentos(); // Recarrega a tabela
            
            formNovoLancamento.reset();
            // Restaura a data de hoje após o reset
            document.getElementById('lancamento-data').value = new Date().toISOString().split('T')[0];
            
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Sucesso!', `Lançamento de ${formatarMoeda(dados.valor)} salvo.`);
            }
        } catch (error) {
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Erro ao Salvar', error.message);
            } else {
                console.error(error);
                alert('Erro ao salvar: ' + error.message);
            }
        } finally {
            btnSalvarNovoLancamento.disabled = false;
            btnSalvarNovoLancamento.textContent = 'Salvar Lançamento';
        }
    });

    // Listener para os botões na TABELA (Excluir)
    if (tabelaBody) {
        tabelaBody.addEventListener('click', (e) => {
            const deleteId = e.target.dataset.deleteId;
            if (deleteId) {
                handleExcluirLancamento(Number(deleteId));
            }
        });
    }
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
    // Adaptação para garantir que ordena independente se vier data ISO ou timestamp
    if (lancamentos && lancamentos.length > 0) {
        lancamentos.sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return dataB - dataA;
        });
    }

    tabelaBody.innerHTML = ''; // Limpa o "Carregando"
    
    if (!lancamentos || lancamentos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum lançamento financeiro registrado.</td></tr>';
        return;
    }

    lancamentos.forEach(item => {
        const tr = document.createElement('tr');
        // Adiciona classe 'entrada' ou 'saida' para estilização visual (verde/vermelho)
        tr.className = item.tipo === 'entrada' ? 'linha-entrada' : 'linha-saida';
        
        // Formata a data (cortando o T se vier ISO)
        const dataFormatada = formatarData(item.data ? item.data.toString().split('T')[0] : '');

        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td><span class="status-badge status-${item.tipo}">${item.tipo}</span></td>
            <td><span class="status-badge status-categoria">${item.categoria}</span></td>
            <td>
                <!-- Apenas exclusão implementada neste módulo -->
                <button class="btn btn-danger btn-small" data-delete-id="${item.id}">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

/**
 * Lida com o clique no botão "Excluir".
 * @param {number} id - O ID do lançamento a ser excluído.
 */
async function handleExcluirLancamento(id) {
    // Para confirmar o nome, precisamos buscar o item.
    // Como não temos os dados locais persistidos globalmente, buscamos novamente.
    // Em um app maior, usaríamos um State Manager.
    let nomeItem = `ID ${id}`;
    
    try {
        const lancamentos = await fetchLancamentos();
        const item = lancamentos.find(l => l.id == id);
        if (item) {
            nomeItem = `${item.descricao} (${formatarMoeda(item.valor)})`;
        }
    } catch (e) {
        console.warn("Não foi possível buscar detalhes para confirmação.");
    }

    // Define a função de callback que será executada na confirmação
    const onConfirm = async () => {
        try {
            await deleteLancamento(id);
            await carregarLancamentos(); // Recarrega a tabela
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Sucesso!', 'Lançamento excluído com sucesso.');
            }
        } catch (error) {
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Erro ao Excluir', error.message);
            } else {
                alert(error.message);
            }
        }
    };

    // Chama o modal de confirmação global
    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('lançamento', id, nomeItem, onConfirm);
    } else {
        if (confirm(`Tem certeza que deseja excluir o lançamento: ${nomeItem}?`)) {
            onConfirm();
        }
    }
}