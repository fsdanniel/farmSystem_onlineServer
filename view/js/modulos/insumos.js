// Arquivo: js/modulos/insumos.js
// Módulo responsável pela lógica da seção "Gestão de Insumos"
// VERSÃO 4.0 (Correção de Mapeamento e Blindagem de UI)

"use strict";

// CONFIGURAÇÃO DA API
const API_URL = '';

// === CONFIGURAÇÃO (Front-end) ===
const TIPOS_INSUMO = [
    { id: 'milho_kg', nome: 'Milho (em grão)', unidade: 'kg' },
    { id: 'soja_kg', nome: 'Farelo de Soja', unidade: 'kg' },
    { id: 'nucleo_cresc_kg', nome: 'Núcleo Crescimento', unidade: 'kg' },
    { id: 'vitamina_l', nome: 'Complexo Vitamínico', unidade: 'L' },
    { id: 'medicamento_un', nome: 'Medicamento X', unidade: 'Un' }
];

// === API REAL (Integração) ===

/**
 * Busca o histórico de compras do servidor.
 */
async function fetchHistoricoCompras() {
    try {
        const response = await fetch(`${API_URL}/insumos/historico`);
        const data = await response.json();

        if (data.sucesso && Array.isArray(data.dados)) {
            return data.dados.map(item => ({
                // Tenta variações de nomes que o Postgres pode retornar
                id: item.id || item.idinsumo || item.idcompra || item.compra_id,
                nome: item.nome || item.nomeinsumo || item.insumo,
                // Datas costumam vir em minúsculo do Postgres
                dataCompra: item.datacompra || item.data_compra || item.data,
                quantidade: parseFloat(item.quantidade || item.qtd || 0),
                nomeFornecedor: item.nomefornecedor || item.fornecedor,
                custoTotal: parseFloat(item.custototal || item.custo || 0)
            }));
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
}

/**
 * Busca o estoque consolidado direto do servidor.
 */
async function fetchEstoque() {
    try {
        const response = await fetch(`${API_URL}/insumos/estoque`);
        const data = await response.json();
        
        if (data.sucesso && Array.isArray(data.dados)) {
            return data.dados.map(item => ({
                nome: item.nome || item.insumo,
                total: parseFloat(item.total || item.quantidade || item.qtd || 0)
            }));
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar estoque:", error);
        return [];
    }
}

async function saveCompra(novaCompra) {
    // 1. Descobrir o NOME do insumo baseado no ID selecionado
    const tipoInsumo = TIPOS_INSUMO.find(t => t.id === novaCompra.insumoId);
    const nomeReal = tipoInsumo ? tipoInsumo.nome : novaCompra.insumoId;

    const body = {
        nome: nomeReal,
        dataCompra: novaCompra.data,
        quantidade: novaCompra.quantidade,
        nomeFornecedor: novaCompra.fornecedor,
        custoTotal: novaCompra.custo,
        statusRegistro: 'ativo'
    };

    const response = await fetch(`${API_URL}/insumos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao salvar compra.");
    }

    return resultado;
}

async function deleteCompra(compraId) {
    const response = await fetch(`${API_URL}/insumos/${compraId}`, {
        method: 'DELETE'
    });

    const resultado = await response.json();

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro ao excluir compra.");
    }

    return resultado;
}


// === FUNÇÕES DO MÓDULO ===

// Seletores globais do módulo
let formCompra, selectInsumo, inputData, inputQuantidade, inputFornecedor, inputCusto, botaoRegistrar;
let tbodyEstoqueAtual, tbodyHistoricoCompras;

/**
 * Inicializa o módulo.
 */
async function inicializarModuloInsumos() {
    formCompra = document.getElementById('form-compra');
    if (!formCompra) return; // Se não achou o form, sai (provavelmente usuário sem permissão)
    
    selectInsumo = document.getElementById('compra-insumo');
    inputData = document.getElementById('compra-data');
    inputQuantidade = document.getElementById('compra-quantidade');
    inputFornecedor = document.getElementById('compra-fornecedor');
    inputCusto = document.getElementById('compra-custo');
    botaoRegistrar = document.getElementById('botao-registrar');
    
    tbodyEstoqueAtual = document.getElementById('tbody-estoque-atual');
    tbodyHistoricoCompras = document.getElementById('tbody-historico-compras');

    // 1. Popula o select com a lista estática
    popularSelectInsumos();

    // 2. Busca dados reais do servidor
    // Importante: Mesmo se falhar, as funções de renderização vão limpar o "Carregando..."
    await atualizarTabelasInsumos();

    // 3. Listeners
    formCompra.addEventListener('submit', handleRegistrarCompra);
    if (tbodyHistoricoCompras) {
        tbodyHistoricoCompras.addEventListener('click', handleExcluirCompra);
    }
    
    // Data de hoje como padrão
    if(inputData) inputData.value = new Date().toISOString().split('T')[0];
}

function popularSelectInsumos() {
    if (!selectInsumo) return;
    selectInsumo.innerHTML = '<option value="">Selecione o insumo...</option>'; 
    TIPOS_INSUMO.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id; 
        option.textContent = `${tipo.nome} (${tipo.unidade})`;
        selectInsumo.appendChild(option);
    });
}

/**
 * Renderiza o histórico vindo do banco.
 */
function renderizarHistoricoInsumos(compras) {
    if (!tbodyHistoricoCompras) return;
    tbodyHistoricoCompras.innerHTML = ''; // Limpa o "Carregando..."

    if (!compras || compras.length === 0) {
        tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum registro de compra encontrado.</td></tr>';
        return;
    }
    
    // Ordenação
    compras.sort((a, b) => {
        const dateA = new Date(a.dataCompra || 0);
        const dateB = new Date(b.dataCompra || 0);
        return dateB - dateA;
    });

    compras.forEach(compra => {
        // Tratamento de dados para exibição
        const dataFormatada = formatarData(compra.dataCompra ? compra.dataCompra.toString().split('T')[0] : '');
        const nome = compra.nome || 'Desconhecido';
        const qtd = compra.quantidade || 0;
        const fornecedor = compra.nomeFornecedor || 'N/D';
        const custo = compra.custoTotal || 0;
        const id = compra.id;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${nome}</td>
            <td>${qtd}</td>
            <td>${fornecedor}</td>
            <td>${formatarMoeda(custo)}</td>
            <td>
                <button class="btn btn-danger btn-small" data-delete-compra-id="${id}">Excluir</button>
            </td>
        `;
        tbodyHistoricoCompras.appendChild(tr);
    });
}

/**
 * Renderiza o estoque vindo da API (/insumos/estoque).
 */
function renderizarEstoqueAtual(dadosEstoque) {
    if (!tbodyEstoqueAtual) return;
    tbodyEstoqueAtual.innerHTML = ''; // Limpa o "Carregando..."

    if (!dadosEstoque || dadosEstoque.length === 0) {
        tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3" style="text-align: center;">Estoque vazio.</td></tr>';
        return;
    }

    dadosEstoque.forEach(item => {
        const nomeItem = item.nome || 'Item';
        const total = parseFloat(item.total || 0);

        // Tenta achar a unidade na lista estática pelo nome
        const tipoLocal = TIPOS_INSUMO.find(t => t.nome === nomeItem);
        const unidade = tipoLocal ? tipoLocal.unidade : 'un';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nomeItem}</td>
            <td>${total.toFixed(2)}</td>
            <td>${unidade}</td>
        `;
        tbodyEstoqueAtual.appendChild(tr);
    });
}

async function handleRegistrarCompra(e) {
    e.preventDefault();
    
    const novaCompra = {
        insumoId: selectInsumo.value, // ID local (ex: milho_kg)
        data: inputData.value,
        quantidade: parseFloat(inputQuantidade.value),
        fornecedor: inputFornecedor.value.trim(),
        custo: parseFloat(inputCusto.value)
    };

    if (!novaCompra.insumoId || !novaCompra.data || isNaN(novaCompra.quantidade) || novaCompra.quantidade <= 0) {
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Erro!', 'Preencha os campos corretamente.');
        } else {
            alert('Preencha os campos corretamente.');
        }
        return;
    }

    botaoRegistrar.disabled = true;
    botaoRegistrar.textContent = 'Salvando...';

    try {
        await saveCompra(novaCompra);
        await atualizarTabelasInsumos(); 
        
        formCompra.reset();
        if(inputData) inputData.value = new Date().toISOString().split('T')[0];
        
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Sucesso!', 'Compra registrada.');
        }
    } catch (error) {
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Erro!', error.message);
        } else {
            alert(error.message);
        }
    } finally {
        botaoRegistrar.disabled = false;
        botaoRegistrar.textContent = 'Registrar Compra';
    }
}

async function handleExcluirCompra(e) {
    const botao = e.target.closest('[data-delete-compra-id]');
    if (!botao) return; 

    const compraId = botao.dataset.deleteCompraId;
    
    const onConfirm = async () => {
        try {
            await deleteCompra(compraId);
            await atualizarTabelasInsumos();
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Excluído!', 'Registro excluído.');
            }
        } catch (error) {
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Erro!', error.message);
            } else {
                alert(error.message);
            }
        }
    };
    
    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('registro de insumo', compraId, `ID ${compraId}`, onConfirm);
    } else {
        if(confirm(`Excluir registro ID ${compraId}?`)) onConfirm();
    }
}

/**
 * Função central para buscar dados e atualizar UI.
 */
async function atualizarTabelasInsumos() {
    try {
        const [historico, estoque] = await Promise.all([
            fetchHistoricoCompras(),
            fetchEstoque()
        ]);
        
        renderizarHistoricoInsumos(historico);
        renderizarEstoqueAtual(estoque);
    } catch (error) {
        console.error("Erro fatal na atualização de tabelas:", error);
        // Garante que o loading suma mesmo com erro fatal
        if (tbodyHistoricoCompras) tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6">Erro ao carregar.</td></tr>';
        if (tbodyEstoqueAtual) tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>';
    }
}