// Arquivo: js/modulos/insumos.js
// Módulo responsável pela lógica da seção "Gestão de Insumos"
// VERSÃO 3.0 (Integrado com API Real)

"use strict";

// CONFIGURAÇÃO DA API
const API_URL = 'http://localhost:3000';

// === CONFIGURAÇÃO (Front-end) ===
// Mantemos essa lista aqui para popular o Select, já que o banco 
// armazena o nome/texto do insumo nas procedures atuais.
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
    console.log("BACKEND (REAL): Buscando histórico de compras...");
    try {
        const response = await fetch(`${API_URL}/insumos/historico`);
        const data = await response.json();

        if (data.sucesso) {
            // O servidor retorna colunas em minúsculo (padrão Postgres)
            // Vamos garantir que os nomes batam com o que o renderizador espera
            // ou adaptar o renderizador. Aqui, retornamos os dados crus do banco.
            return data.dados; 
        } else {
            console.error("Erro ao buscar histórico:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        mostrarNotificacao('Erro', 'Erro ao buscar histórico.');
        return [];
    }
}

/**
 * Busca o estoque consolidado direto do servidor.
 */
async function fetchEstoque() {
    console.log("BACKEND (REAL): Buscando estoque atual...");
    try {
        const response = await fetch(`${API_URL}/insumos/estoque`);
        const data = await response.json();
        
        if (data.sucesso) {
            return data.dados;
        } else {
            console.error("Erro ao buscar estoque:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        return [];
    }
}

async function saveCompra(novaCompra) {
    console.log("BACKEND (REAL): Salvando nova compra...", novaCompra);
    
    // O backend espera: { nome, dataCompra, quantidade, nomeFornecedor, custoTotal, statusRegistro }
    // Precisamos mapear os campos do formulário para o formato da API
    
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
    console.log("BACKEND (REAL): Excluindo compra ID:", compraId);
    
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
    if (!formCompra) return;
    
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
    await atualizarTabelasInsumos();

    // 3. Listeners
    formCompra.addEventListener('submit', handleRegistrarCompra);
    tbodyHistoricoCompras.addEventListener('click', handleExcluirCompra);
    
    // Data de hoje como padrão
    if(inputData) inputData.value = new Date().toISOString().split('T')[0];
}

function popularSelectInsumos() {
    if (!selectInsumo) return;
    selectInsumo.innerHTML = '<option value="">Selecione o insumo...</option>'; 
    TIPOS_INSUMO.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id; // Mantemos o ID no value para controle interno
        option.textContent = `${tipo.nome} (${tipo.unidade})`;
        selectInsumo.appendChild(option);
    });
}

/**
 * Renderiza o histórico vindo do banco.
 * O banco retorna colunas como: id, nome, datacompra, quantidade, nomefornecedor, custototal
 */
function renderizarHistoricoInsumos(compras) {
    if (!tbodyHistoricoCompras) return;
    tbodyHistoricoCompras.innerHTML = ''; 

    if (!compras || compras.length === 0) {
        tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum registro de compra encontrado.</td></tr>';
        return;
    }
    
    // O backend já deve retornar ordenado ou ordenamos aqui
    // Adaptação para campos minúsculos do Postgres
    compras.sort((a, b) => {
        const dateA = new Date(a.datacompra || a.dataCompra);
        const dateB = new Date(b.datacompra || b.dataCompra);
        return dateB - dateA;
    });

    compras.forEach(compra => {
        const id = compra.id; // ID vindo do banco
        const nome = compra.nome;
        const data = formatarData((compra.datacompra || compra.dataCompra).split('T')[0]);
        const qtd = compra.quantidade;
        const fornecedor = compra.nomefornecedor || compra.nomeFornecedor || 'N/D';
        const custo = compra.custototal || compra.custoTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data}</td>
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
 * Não calculamos mais no front!
 */
function renderizarEstoqueAtual(dadosEstoque) {
    if (!tbodyEstoqueAtual) return;
    tbodyEstoqueAtual.innerHTML = '';

    if (!dadosEstoque || dadosEstoque.length === 0) {
        tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3" style="text-align: center;">Estoque vazio ou não calculado.</td></tr>';
        return;
    }

    dadosEstoque.forEach(item => {
        // O banco deve retornar: nome, total (quantidade somada)
        // Tentamos deduzir a unidade pelo nome na nossa lista estática para exibir bonitinho
        const tipoLocal = TIPOS_INSUMO.find(t => t.nome === item.nome);
        const unidade = tipoLocal ? tipoLocal.unidade : 'un';
        
        // Se o banco retornar string numérico, converte para float
        const total = parseFloat(item.total || item.quantidade || 0);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${total.toFixed(2)}</td>
            <td>${unidade}</td>
        `;
        tbodyEstoqueAtual.appendChild(tr);
    });
}

async function handleRegistrarCompra(e) {
    e.preventDefault();
    
    const novaCompra = {
        // Não geramos ID no front, o banco gera
        insumoId: selectInsumo.value, // ID local (ex: milho_kg)
        data: inputData.value,
        quantidade: parseFloat(inputQuantidade.value),
        fornecedor: inputFornecedor.value.trim(),
        custo: parseFloat(inputCusto.value)
    };

    if (!novaCompra.insumoId || !novaCompra.data || isNaN(novaCompra.quantidade) || novaCompra.quantidade <= 0) {
        mostrarNotificacao('Erro!', 'Preencha os campos corretamente.');
        return;
    }

    botaoRegistrar.disabled = true;
    botaoRegistrar.textContent = 'Salvando...';

    try {
        await saveCompra(novaCompra);
        await atualizarTabelasInsumos(); 
        
        formCompra.reset();
        if(inputData) inputData.value = new Date().toISOString().split('T')[0];
        
        mostrarNotificacao('Sucesso!', 'Compra registrada.');
    } catch (error) {
        mostrarNotificacao('Erro!', error.message);
    } finally {
        botaoRegistrar.disabled = false;
        botaoRegistrar.textContent = 'Registrar Compra';
    }
}

async function handleExcluirCompra(e) {
    const botao = e.target.closest('[data-delete-compra-id]');
    if (!botao) return; 

    const compraId = botao.dataset.deleteCompraId; // ID pode ser string ou number vindo do banco
    
    const onConfirm = async () => {
        try {
            await deleteCompra(compraId);
            await atualizarTabelasInsumos();
            mostrarNotificacao('Excluído!', 'Registro excluído.');
        } catch (error) {
            mostrarNotificacao('Erro!', error.message);
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
    // Busca Histórico e Estoque em paralelo
    const [historico, estoque] = await Promise.all([
        fetchHistoricoCompras(),
        fetchEstoque()
    ]);
    
    renderizarHistoricoInsumos(historico);
    renderizarEstoqueAtual(estoque);
}