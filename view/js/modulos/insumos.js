// Arquivo: js/modulos/insumos.js
// Módulo responsável pela lógica da seção "Gestão de Insumos"
// VERSÃO 2.0 (Refatorado com API Simulada async/await e Callbacks)

"use strict";

// === DADOS MOCADOS (Simulação de BD) ===
let mockTiposDeInsumo = [
    { id: 'milho_kg', nome: 'Milho (em grão)', unidade: 'kg' },
    { id: 'soja_kg', nome: 'Farelo de Soja', unidade: 'kg' },
    { id: 'nucleo_cresc_kg', nome: 'Núcleo Crescimento', unidade: 'kg' },
    { id: 'vitamina_l', nome: 'Complexo Vitamínico', unidade: 'L' },
    { id: 'medicamento_un', nome: 'Medicamento X', unidade: 'Un' }
];

let mockHistoricoCompras = [
    { compraId: 1678886400000, insumoId: 'milho_kg', data: '2025-10-01', quantidade: 500, fornecedor: 'AgroCereais', custo: 750.00 },
    { compraId: 1678886500000, insumoId: 'soja_kg', data: '2025-10-02', quantidade: 300, fornecedor: 'SojaBrasil', custo: 900.00 },
    { compraId: 1678886600000, insumoId: 'milho_kg', data: '2025-10-15', quantidade: 250, fornecedor: 'AgroCereais', custo: 380.00 }
];


// === API SIMULADA (async/await) ===

const SIMULATED_DELAY_INSUMOS = 200;

async function fetchTiposDeInsumo() {
    console.log("BACKEND (SIM): Buscando tipos de insumo...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockTiposDeInsumo);
        }, SIMULATED_DELAY_INSUMOS); 
    });
}

async function fetchHistoricoCompras() {
    console.log("BACKEND (SIM): Buscando histórico de compras...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...mockHistoricoCompras]);
        }, SIMULATED_DELAY_INSUMOS);
    });
}

async function saveCompra(novaCompra) {
    console.log("BACKEND (SIM): Salvando nova compra...", novaCompra);
    return new Promise(resolve => {
        setTimeout(() => {
            mockHistoricoCompras.push(novaCompra);
            resolve({ success: true, data: novaCompra });
        }, SIMULATED_DELAY_INSUMOS); 
    });
}

async function deleteCompra(compraId) {
    console.log("BACKEND (SIM): Excluindo compra ID:", compraId);
    return new Promise(resolve => {
        setTimeout(() => {
            mockHistoricoCompras = mockHistoricoCompras.filter(compra => compra.compraId !== compraId);
            resolve({ success: true });
        }, SIMULATED_DELAY_INSUMOS);
    });
}


// === FUNÇÕES DO MÓDULO ===

// Seletores do Módulo Insumos (serão capturados no init)
let formCompra, selectInsumo, inputData, inputQuantidade, inputFornecedor, inputCusto, botaoRegistrar;
let tbodyEstoqueAtual, tbodyHistoricoCompras;

/**
 * Função principal de inicialização do módulo de Insumos.
 * É chamada pelo app.js (DOMContentLoaded).
 */
async function inicializarModuloInsumos() {
    // Captura os seletores do DOM
    formCompra = document.getElementById('form-compra');
    
    // Se o formulário não está na página, encerra a inicialização
    if (!formCompra) return;
    
    selectInsumo = document.getElementById('compra-insumo');
    inputData = document.getElementById('compra-data');
    inputQuantidade = document.getElementById('compra-quantidade');
    inputFornecedor = document.getElementById('compra-fornecedor');
    inputCusto = document.getElementById('compra-custo');
    botaoRegistrar = document.getElementById('botao-registrar');
    tbodyEstoqueAtual = document.getElementById('tbody-estoque-atual');
    tbodyHistoricoCompras = document.getElementById('tbody-historico-compras');

    // 1. Busca os tipos de insumo para popular o <select>
    const tipos = await fetchTiposDeInsumo();
    popularSelectInsumos(tipos);

    // 2. Busca o histórico e calcula o estoque inicial
    await atualizarTabelasInsumos();

    // 3. Adiciona os listeners de eventos
    formCompra.addEventListener('submit', handleRegistrarCompra);
    tbodyHistoricoCompras.addEventListener('click', handleExcluirCompra);
}

function popularSelectInsumos(tipos) {
    if (!selectInsumo) return;
    selectInsumo.innerHTML = '<option value="">Selecione o insumo...</option>'; // Limpa
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nome;
        selectInsumo.appendChild(option);
    });
}

function renderizarHistoricoInsumos(compras) {
    if (!tbodyHistoricoCompras) return;
    tbodyHistoricoCompras.innerHTML = ''; 

    if (compras.length === 0) {
        tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum registro de compra encontrado.</td></tr>';
        return;
    }
    compras.sort((a, b) => new Date(b.data) - new Date(a.data)); // Mais recentes primeiro

    compras.forEach(compra => {
        const tipoInsumo = mockTiposDeInsumo.find(t => t.id === compra.insumoId) || { nome: 'Desconhecido' };
        
        const tr = document.createElement('tr');
        // Usamos as classes de botão padronizadas (.btn, .btn-danger, .btn-small)
        tr.innerHTML = `
            <td>${formatarData(compra.data)}</td>
            <td>${tipoInsumo.nome}</td>
            <td>${compra.quantidade}</td>
            <td>${compra.fornecedor || 'N/D'}</td>
            <td>${formatarMoeda(compra.custo)}</td>
            <td>
                <button class="btn btn-danger btn-small" data-delete-compra-id="${compra.compraId}">Excluir</button>
            </td>
        `;
        tbodyHistoricoCompras.appendChild(tr);
    });
}

function renderizarEstoqueAtual(compras) {
    if (!tbodyEstoqueAtual) return;
    tbodyEstoqueAtual.innerHTML = '';

    const estoque = new Map();
    compras.forEach(compra => {
        const tipo = mockTiposDeInsumo.find(t => t.id === compra.insumoId);
        if (!tipo) return;
        if (!estoque.has(tipo.id)) {
            estoque.set(tipo.id, { nome: tipo.nome, unidade: tipo.unidade, total: 0 });
        }
        const itemEmEstoque = estoque.get(tipo.id);
        itemEmEstoque.total += compra.quantidade;
    });

    if (estoque.size === 0) {
        tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3" style="text-align: center;">Estoque vazio.</td></tr>';
        return;
    }
    estoque.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.total.toFixed(2)}</td>
            <td>${item.unidade}</td>
        `;
        tbodyEstoqueAtual.appendChild(tr);
    });
}

async function handleRegistrarCompra(e) {
    e.preventDefault();
    
    const novaCompra = {
        compraId: Date.now(),
        insumoId: selectInsumo.value,
        data: inputData.value,
        quantidade: parseFloat(inputQuantidade.value),
        fornecedor: inputFornecedor.value.trim(),
        custo: parseFloat(inputCusto.value)
    };

    // Validação
    if (!novaCompra.insumoId || !novaCompra.data || isNaN(novaCompra.quantidade) || novaCompra.quantidade <= 0) {
        mostrarNotificacao('Erro!', 'Por favor, preencha o Insumo, Data e Quantidade corretamente.');
        return;
    }

    botaoRegistrar.disabled = true;
    botaoRegistrar.textContent = 'Salvando...';

    // Chama a API simulada
    const response = await saveCompra(novaCompra);

    if (response.success) {
        await atualizarTabelasInsumos(); 
        formCompra.reset();
        mostrarNotificacao('Sucesso!', 'Compra registrada com sucesso.');
    } else {
        mostrarNotificacao('Erro!', 'Erro ao salvar a compra.');
    }

    botaoRegistrar.disabled = false;
    botaoRegistrar.textContent = 'Registrar Compra';
}

async function handleExcluirCompra(e) {
    // Usa event delegation para achar o botão
    const botao = e.target.closest('[data-delete-compra-id]');
    if (!botao) return; 

    const compraId = parseInt(botao.dataset.deleteCompraId);
    
    // Define a função de callback para a confirmação
    const onConfirm = async () => {
        const response = await deleteCompra(compraId);
        if (response.success) {
            await atualizarTabelasInsumos();
            mostrarNotificacao('Excluído!', `O registro de compra (ID: ${compraId}) foi excluído.`);
        } else {
            mostrarNotificacao('Erro!', `Não foi possível excluir o registro.`);
        }
    };
    
    // Chama o modal de confirmação global (definido no app.js)
    mostrarConfirmacao('registro de insumo', compraId, `ID ${compraId}`, onConfirm);
}

/**
 * Função central para buscar dados "do backend" e atualizar a UI de Insumos.
 */
async function atualizarTabelasInsumos() {
    // Busca os dados mais recentes (em paralelo)
    const [compras, tipos] = await Promise.all([
        fetchHistoricoCompras(),
        fetchTiposDeInsumo() // Recarrega os tipos caso tenham mudado
    ]);
    
    popularSelectInsumos(tipos);
    renderizarHistoricoInsumos(compras);
    renderizarEstoqueAtual(compras);
}

