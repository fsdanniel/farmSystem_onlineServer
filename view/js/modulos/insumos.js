// Arquivo: js/modulos/insumos.js
// VERSÃO 3.1 DEBUG EXTREMO (Diagnóstico de DOM e Dados Vazio)

"use strict";

console.log("🚀 Carregando módulo Insumos v3.1...");

const API_URL = 'http://undeluded-filmier-eusebio.ngrok-free.dev/api';

const TIPOS_INSUMO = [
    { id: 'milho_kg', nome: 'Milho (em grão)', unidade: 'kg' },
    { id: 'soja_kg', nome: 'Farelo de Soja', unidade: 'kg' },
    { id: 'nucleo_cresc_kg', nome: 'Núcleo Crescimento', unidade: 'kg' },
    { id: 'vitamina_l', nome: 'Complexo Vitamínico', unidade: 'L' },
    { id: 'medicamento_un', nome: 'Medicamento X', unidade: 'Un' }
];

// === API REAL ===

async function fetchHistoricoCompras() {
    console.log("📡 Buscando histórico...");
    try {
        const response = await fetch(`${API_URL}/insumos/historico`);
        const data = await response.json();

        if (data.sucesso) {
            // DEBUG: Verifica o que chegou
            if (data.dados.length === 0) {
                console.warn("⚠️ Banco de dados retornou LISTA VAZIA para Histórico.");
                // Se estiver vazio, não tem como adivinhar colunas, mas retornamos vazio para limpar o "Carregando"
                return [];
            } else {
                // Se tem dados, mostramos as chaves do primeiro item
                const item = data.dados[0];
                const chaves = Object.keys(item);
                console.log("🔑 Colunas recebidas (Histórico):", chaves);
                
                // ALERTA PARA VOCÊ VER AS COLUNAS
                alert("ESPIÃO INSUMOS (Histórico):\n\nColunas encontradas: " + chaves.join(", "));
            }
            return data.dados; 
        } else {
            console.error("❌ Erro lógico no back:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("❌ Erro de conexão Histórico:", error);
        return [];
    }
}

async function fetchEstoque() {
    console.log("📡 Buscando estoque...");
    try {
        const response = await fetch(`${API_URL}/insumos/estoque`);
        const data = await response.json();
        
        if (data.sucesso) {
             if (data.dados.length > 0) {
                const item = data.dados[0];
                const chaves = Object.keys(item);
                console.log("🔑 Colunas recebidas (Estoque):", chaves);
                // ALERTA PARA VOCÊ VER AS COLUNAS
                alert("ESPIÃO INSUMOS (Estoque):\n\nColunas encontradas: " + chaves.join(", "));
            } else {
                console.warn("⚠️ Banco de dados retornou ESTOQUE VAZIO.");
            }
            return data.dados;
        } else {
            console.error("❌ Erro lógico estoque:", data.erro);
            return [];
        }
    } catch (error) {
        console.error("❌ Erro de conexão Estoque:", error);
        return [];
    }
}

async function saveCompra(novaCompra) {
    // ... (Lógica de salvar mantida igual, focaremos no fetch primeiro)
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
    if (!resultado.sucesso) throw new Error(resultado.erro || "Erro ao salvar.");
    return resultado;
}

async function deleteCompra(compraId) {
    const response = await fetch(`${API_URL}/insumos/${compraId}`, { method: 'DELETE' });
    const resultado = await response.json();
    if (!resultado.sucesso) throw new Error(resultado.erro || "Erro ao excluir.");
    return resultado;
}


// === FUNÇÕES DO MÓDULO ===

let formCompra, selectInsumo, inputData, inputQuantidade, inputFornecedor, inputCusto, botaoRegistrar;
let tbodyEstoqueAtual, tbodyHistoricoCompras;

async function inicializarModuloInsumos() {
    console.log("🏁 inicializarModuloInsumos chamado.");
    
    formCompra = document.getElementById('form-compra');
    if (!formCompra) {
        console.warn("⚠️ Formulário de compra não encontrado. O usuário tem permissão?");
        return;
    }
    
    // Captura e validação dos elementos da tabela
    tbodyEstoqueAtual = document.getElementById('tbody-estoque-atual');
    tbodyHistoricoCompras = document.getElementById('tbody-historico-compras');

    if (!tbodyHistoricoCompras) console.error("❌ ERRO CRÍTICO: Elemento 'tbody-historico-compras' não encontrado no HTML! O 'Carregando...' nunca vai sumir.");
    if (!tbodyEstoqueAtual) console.error("❌ ERRO CRÍTICO: Elemento 'tbody-estoque-atual' não encontrado no HTML!");

    selectInsumo = document.getElementById('compra-insumo');
    inputData = document.getElementById('compra-data');
    inputQuantidade = document.getElementById('compra-quantidade');
    inputFornecedor = document.getElementById('compra-fornecedor');
    inputCusto = document.getElementById('compra-custo');
    botaoRegistrar = document.getElementById('botao-registrar');

    popularSelectInsumos();
    await atualizarTabelasInsumos();

    formCompra.addEventListener('submit', handleRegistrarCompra);
    if (tbodyHistoricoCompras) {
        tbodyHistoricoCompras.addEventListener('click', handleExcluirCompra);
    }
    
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

function renderizarHistoricoInsumos(compras) {
    if (!tbodyHistoricoCompras) {
        console.error("❌ renderizarHistoricoInsumos: tbody não existe.");
        return;
    }
    tbodyHistoricoCompras.innerHTML = ''; 

    if (!compras || compras.length === 0) {
        tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum registro de compra encontrado.</td></tr>';
        return;
    }
    
    // Ordenação segura
    compras.sort((a, b) => {
        // Tenta pegar data de qualquer campo provável
        const d1 = a.datacompra || a.dataCompra || a.data || 0;
        const d2 = b.datacompra || b.dataCompra || b.data || 0;
        return new Date(d2) - new Date(d1);
    });

    compras.forEach(compra => {
        // Tenta mapear qualquer nome que vier
        const id = compra.id || compra.idinsumo || compra.compraid || 0;
        const nome = compra.nome || compra.nomeinsumo || 'N/D';
        const dataRaw = compra.datacompra || compra.dataCompra || compra.data;
        const data = formatarData(dataRaw ? dataRaw.toString().split('T')[0] : '');
        const qtd = compra.quantidade || 0;
        const fornecedor = compra.nomefornecedor || compra.nomeFornecedor || compra.fornecedor || 'N/D';
        const custo = compra.custototal || compra.custoTotal || compra.custo || 0;

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

function renderizarEstoqueAtual(dadosEstoque) {
    if (!tbodyEstoqueAtual) return;
    tbodyEstoqueAtual.innerHTML = '';

    if (!dadosEstoque || dadosEstoque.length === 0) {
        tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3" style="text-align: center;">Estoque vazio.</td></tr>';
        return;
    }

    dadosEstoque.forEach(item => {
        // Tenta mapear
        const nomeItem = item.nome || item.insumo || 'Desconhecido';
        const total = parseFloat(item.total || item.quantidade || item.qtd || 0);

        // Tenta achar unidade
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
    // ... (Lógica de registro mantida, foco no debug de carregamento)
    const novaCompra = {
        insumoId: selectInsumo.value, 
        data: inputData.value,
        quantidade: parseFloat(inputQuantidade.value),
        fornecedor: inputFornecedor.value.trim(),
        custo: parseFloat(inputCusto.value)
    };

    if (!novaCompra.insumoId || !novaCompra.data || isNaN(novaCompra.quantidade)) {
        alert('Preencha os campos corretamente.');
        return;
    }

    botaoRegistrar.disabled = true;
    botaoRegistrar.textContent = 'Salvando...';

    try {
        await saveCompra(novaCompra);
        await atualizarTabelasInsumos(); 
        formCompra.reset();
        if(inputData) inputData.value = new Date().toISOString().split('T')[0];
        if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso!', 'Compra registrada.');
    } catch (error) {
        alert('Erro ao salvar: ' + error.message);
    } finally {
        botaoRegistrar.disabled = false;
        botaoRegistrar.textContent = 'Registrar Compra';
    }
}

async function handleExcluirCompra(e) {
    const botao = e.target.closest('[data-delete-compra-id]');
    if (!botao) return; 
    const compraId = botao.dataset.deleteCompraId;
    if(confirm(`Excluir registro ID ${compraId}?`)) {
        try {
            await deleteCompra(compraId);
            await atualizarTabelasInsumos();
        } catch(err) { alert(err.message); }
    }
}

async function atualizarTabelasInsumos() {
    console.log("🔄 Atualizando tabelas...");
    const [historico, estoque] = await Promise.all([
        fetchHistoricoCompras(),
        fetchEstoque()
    ]);
    renderizarHistoricoInsumos(historico);
    renderizarEstoqueAtual(estoque);
}