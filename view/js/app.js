// Arquivo: js/app.js
// VERSÃO 1.3 (Integrado Vet + Insumos + Registros + Relatórios + Modais Globais)

// === DADOS MOCADOS (Simulação de BD) ===
let geneticas = [
    { id: 1, nome: "Duroc", descricao: "Raça conhecida pela qualidade da carne", caracteristicas: "Excelente conversão alimentar, carne marmorizada", status: "ativa" },
    { id: 2, nome: "Landrace", descricao: "Raça de alta prolificidade", caracteristicas: "Boa produção de leite, leitegadas grandes", status: "ativa" },
    { id: 3, nome: "Yorkshire", descricao: "Raça versátil e produtiva", caracteristicas: "Boa conformação, alta fertilidade", status: "inativa" }
];
let lotes = [
    { id: 1, nome: "Lote A-2024-001", geneticaId: 1, geneticaNome: "Duroc", quantidadeAnimais: 25, dataCriacao: "2024-01-15", status: "ativo" },
    { id: 2, nome: "Lote B-2024-002", geneticaId: 2, geneticaNome: "Landrace", quantidadeAnimais: 30, dataCriacao: "2024-02-10", status: "ativo" },
    { id: 3, nome: "Lote C-2024-003", geneticaId: 1, geneticaNome: "Duroc", quantidadeAnimais: 15, dataCriacao: "2024-03-05", status: "quarentena" }
];
let bercarios = [
    { id: 1, loteId: 1, loteNome: "Lote A-2024-001", quantidadeLeitoes: 12, dataNascimento: "2024-09-15", pesoMedio: 8.5, status: "ativo", dataDesmame: null },
    { id: 2, loteId: 2, loteNome: "Lote B-2024-002", quantidadeLeitoes: 15, dataNascimento: "2024-08-20", pesoMedio: 15.2, status: "desmamado", dataDesmame: "2024-10-10" }
];
let maternidades = [
    { id: 1, brincoPorca: "F001", geneticaId: 2, geneticaNome: "Landrace", dataCobertura: "2024-06-15", dataPartoPrevisao: "2024-10-28", quantidadeLeitoes: 0, status: "gestante" },
    { id: 2, brincoPorca: "F002", geneticaId: 1, geneticaNome: "Duroc", dataCobertura: "2024-05-10", dataPartoPrevisao: "2024-09-15", quantidadeLeitoes: 12, status: "lactante" }
];
let inseminacoes = [
    { id: 1, brincoFemea: "F003", geneticaMachoId: 1, geneticaMachoNome: "Duroc", dataInseminacao: "2024-10-01", tecnica: "ia-convencional", resultado: "aguardando", dataVerificacao: null },
    { id: 2, brincoFemea: "F004", geneticaMachoId: 2, geneticaMachoNome: "Landrace", dataInseminacao: "2024-09-20", tecnica: "ia-cervical", resultado: "positivo", dataVerificacao: "2024-10-05" }
];
let ocorrencias = [
    { id: 1, dataHora: "2024-10-16T08:30", loteId: 3, loteNome: "Lote C-2024-003", tipo: "sanitaria", prioridade: "alta", titulo: "Suspeita de doença respiratória", descricao: "Observados sintomas de tosse e espirros em 3 animais do lote. Temperatura elevada detectada.", animaisAfetados: 3, medicamentoAplicado: "Enrofloxacina", dosagem: "2.5ml por animal", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Monitorar temperatura por 48h. Reavaliar se sintomas persistirem.", status: "em-andamento" },
    { id: 2, dataHora: "2024-10-15T14:15", loteId: 1, loteNome: "Lote A-2024-001", tipo: "vacina", prioridade: "media", titulo: "Aplicação de vacina contra parvovirose", descricao: "Vacinação preventiva realizada conforme protocolo sanitário da granja.", animaisAfetados: 25, medicamentoAplicado: "Vacina Parvovirose", dosagem: "1ml por animal", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Observar reações adversas nas próximas 24h.", status: "resolvida" },
    { id: 3, dataHora: "2024-10-16T16:45", loteId: 2, loteNome: "Lote B-2024-002", tipo: "morte", prioridade: "critica", titulo: "Morte de animal - investigação necessária", descricao: "Animal encontrado morto durante ronda matinal. Sem sinais evidentes de trauma externo.", animaisAfetados: 1, medicamentoAplicado: "", dosagem: "", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Solicitar necropsia. Isolar demais animais para observação. Revisar protocolo sanitário.", status: "pendente" }
];
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
const mockDadosPartos = [
    { data: '2025-10-01', lote: 'Matriz F002', qtd: 12, obs: 'Parto normal' },
    { data: '2025-10-03', lote: 'Matriz F005', qtd: 14, obs: 'Parto assistido' }
];
const mockDadosDesmames = [
    { data: '2025-10-22', lote: 'Lote A-001', qtd: 11, obs: 'Peso médio 7.5kg' },
    { data: '2025-10-24', lote: 'Lote B-002', qtd: 13, obs: 'Transferidos para creche' }
];


// === VARIÁVEIS GLOBAIS ===
let geneticaEditando = null;
let loteEditando = null;
let bercarioEditando = null;
let maternidadeEditando = null;
let inseminacaoEditando = null;
let ocorrenciaEditando = null;
let veterinarioLogado = { id: null, nome: null, email: null, crmv: null };
let acaoParaConfirmar = { tipo: null, id: null };

// === SELETORES GLOBAIS (para Modais) ===
let modalConfirmacao, btnConfirmarAcao, btnCancelarAcao, confirmacaoMensagem;
let modalNotificacao, btnOkNotificacao, notificacaoMensagem, notificacaoTitulo;


// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    // Capturar seletores dos modais globais
    modalConfirmacao = document.getElementById('modal-confirmacao');
    btnConfirmarAcao = document.getElementById('btn-confirmar-acao');
    btnCancelarAcao = document.getElementById('btn-cancelar-acao');
    confirmacaoMensagem = document.getElementById('confirmacao-mensagem');
    modalNotificacao = document.getElementById('modal-notificacao');
    btnOkNotificacao = document.getElementById('btn-ok-notificacao');
    notificacaoMensagem = document.getElementById('notificacao-mensagem');
    notificacaoTitulo = document.getElementById('notificacao-titulo');

    // Funções de inicialização
    carregarDadosVeterinario();
    inicializarNavegacao();
    
    // Carregar dados das seções do Vet
    carregarGeneticas();
    carregarLotes();
    carregarOcorrencias();
    carregarBercarios();
    carregarMaternidades();
    carregarInseminacoes();
    atualizarRelatorios();
    
    // Inicializar módulos integrados
    inicializarModuloInsumos();
    inicializarModuloRegistros();
    inicializarModuloRelatorios();
    
    // Configurar listeners
    configurarFiltros();
    configurarFormularios();
    atualizarNomeVeterinarioInterface();
    configurarListenersDeBotoes();
    configurarListenersDeTabelas();
    
    // Listeners dos modais globais
    btnConfirmarAcao.addEventListener('click', handleConfirmarAcao);
    btnCancelarAcao.addEventListener('click', fecharModalConfirmacao);
    btnOkNotificacao.addEventListener('click', fecharModalNotificacao);
    modalConfirmacao.addEventListener('click', (e) => { if (e.target === modalConfirmacao) fecharModalConfirmacao() });
    modalNotificacao.addEventListener('click', (e) => { if (e.target === modalNotificacao) fecharModalNotificacao() });
});


// === NAVEGAÇÃO E SISTEMA ===
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection + '-section').classList.add('active');
        });
    });
}
function carregarDadosVeterinario() {
    veterinarioLogado = { id: 1, nome: 'Dr. João Silva', email: 'joao.silva@veterinaria.com', crmv: 'CRMV-PR 12345' };
}
function atualizarNomeVeterinarioInterface() {
    const nomeVeterinario = obterVeterinarioLogado();
    const nomeHeader = document.getElementById('nome-veterinario-header');
    if (nomeHeader) nomeHeader.textContent = nomeVeterinario;
    const campoVeterinario = document.getElementById('veterinario-responsavel');
    if (campoVeterinario) campoVeterinario.value = nomeVeterinario;
    atualizarDadosExistentesVeterinario(nomeVeterinario);
}
function atualizarDadosExistentesVeterinario(nomeVeterinario) {
    ocorrencias.forEach(o => { if (o.veterinarioResponsavel === 'Dr. Veterinário') o.veterinarioResponsavel = nomeVeterinario; });
    carregarOcorrencias();
}
function obterVeterinarioLogado() { return veterinarioLogado.nome || 'Dr(a). [Nome do Veterinário]'; }
function trocarVeterinario(nome, email = '', crmv = '') {
    veterinarioLogado = { id: veterinarioLogado.id || 1, nome: nome, email: email || veterinarioLogado.email, crmv: crmv || veterinarioLogado.crmv };
    atualizarNomeVeterinarioInterface();
}


// === FUNÇÕES DE MODAIS GLOBAIS ===
function fecharTodosModais() {
    fecharModalGenetica(); fecharModalLote(); fecharModalOcorrencia();
    fecharModalBercario(); fecharModalMaternidade(); fecharModalInseminacao();
    fecharModalConfirmacao(); fecharModalNotificacao();
}
function fecharModalConfirmacao() {
    acaoParaConfirmar = { tipo: null, id: null };
    modalConfirmacao.classList.add('hidden');
}
function fecharModalNotificacao() {
    modalNotificacao.classList.add('hidden');
}
function mostrarNotificacao(titulo, mensagem) {
    notificacaoTitulo.textContent = titulo;
    notificacaoMensagem.textContent = mensagem;
    modalNotificacao.classList.remove('hidden');
}
function mostrarConfirmacao(tipo, id, nome) {
    acaoParaConfirmar = { tipo, id };
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir ${tipo} "${nome || id}"? Esta ação não pode ser desfeita.`;
    modalConfirmacao.classList.remove('hidden');
}
function handleConfirmarAcao() {
    const { tipo, id } = acaoParaConfirmar;
    if (!tipo || !id) return;
    let nomeExcluido = id;
    let item;
    
    switch (tipo) {
        case 'genetica':
            item = geneticas.find(g => g.id === id); nomeExcluido = item ? item.nome : id;
            geneticas = geneticas.filter(g => g.id !== id);
            carregarGeneticas(); atualizarRelatorios();
            break;
        case 'lote':
            item = lotes.find(l => l.id === id); nomeExcluido = item ? item.nome : id;
            lotes = lotes.filter(l => l.id !== id);
            carregarLotes(); atualizarRelatorios();
            break;
        case 'insumo':
            executarExclusaoInsumo(id); // Função async separada
            return; // Retorna para esperar a resposta async
        case 'ocorrencia':
            item = ocorrencias.find(o => o.id === id); nomeExcluido = item ? item.titulo : id;
            ocorrencias = ocorrencias.filter(o => o.id !== id);
            carregarOcorrencias(); atualizarRelatorios();
            break;
        case 'bercario':
            item = bercarios.find(b => b.id === id); nomeExcluido = item ? `Registro #${id} (Lote ${item.loteNome})` : id;
            bercarios = bercarios.filter(b => b.id !== id);
            carregarBercarios(); atualizarRelatorios();
            break;
        case 'maternidade':
            item = maternidades.find(m => m.id === id); nomeExcluido = item ? `Registro #${id} (Porca ${item.brincoPorca})` : id;
            maternidades = maternidades.filter(m => m.id !== id);
            carregarMaternidades(); atualizarRelatorios();
            break;
        case 'inseminacao':
            item = inseminacoes.find(i => i.id === id); nomeExcluido = item ? `Registro #${id} (Fêmea ${item.brincoFemea})` : id;
            inseminacoes = inseminacoes.filter(i => i.id !== id);
            carregarInseminacoes(); atualizarRelatorios();
            break;
    }
    fecharModalConfirmacao();
    mostrarNotificacao('Excluído!', `O item "${nomeExcluido}" foi excluído com sucesso.`);
}

// === FUNÇÕES AUXILIARES GLOBAIS ===
function formatarData(dataString) {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    if (dia && mes && ano) return `${dia}/${mes}/${ano}`;
    return dataString;
}
function formatarMoeda(valor) {
    if (isNaN(valor) || valor === null) return 'N/D';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// ==================================================
// === MÓDULO RELATÓRIOS (Integrado) ===
// ==================================================
function inicializarModuloRelatorios() {
    const btnFiltrar = document.getElementById("btnFiltrar");
    const tabelaBody = document.getElementById("tbody-relatorios");

    if (!btnFiltrar) return; 

    btnFiltrar.addEventListener("click", () => {
        const tipo = document.getElementById("tipoRelatorio").value;
        tabelaBody.innerHTML = ""; 

        if (!tipo) {
            mostrarNotificacao('Atenção!', 'Selecione o tipo de relatório.');
            return;
        }

        let dados = [];
        if (tipo === "partos") dados = mockDadosPartos;
        else if (tipo === "desmames") dados = mockDadosDesmames;
        
        if (dados.length === 0) {
             tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum dado encontrado para este relatório.</td></tr>`;
             return;
        }

        dados.forEach((item) => {
            const row = `<tr>
                <td>${formatarData(item.data)}</td>
                <td>${item.lote}</td>
                <td>${item.qtd}</td>
                <td>${item.obs}</td>
                </tr>`;
            tabelaBody.insertAdjacentHTML("beforeend", row);
        });
    });
}


// ==================================================
// === MÓDULO REGISTRO DE EVENTOS (Integrado) ===
// ==================================================
function inicializarModuloRegistros() {
    const select = document.getElementById("tipoEvento");
    const sections = document.querySelectorAll("#registros-section .form-section");

    if (!select) return; 

    select.addEventListener("change", () => {
        sections.forEach((form) => (form.style.display = "none"));
        const tipo = select.value;
        if (tipo) {
            const formId = `form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
            const formParaMostrar = document.getElementById(formId);
            if (formParaMostrar) formParaMostrar.style.display = "block";
        }
    });
}


// ==================================================
// === MÓDULO INSUMOS: API SIMULADA (Integrado) ===
// ==================================================
async function fetchTiposDeInsumo() {
    console.log("BACKEND (SIM): Buscando tipos de insumo...");
    return new Promise(resolve => { setTimeout(() => { resolve(mockTiposDeInsumo); }, 200); });
}
async function fetchHistoricoCompras() {
    console.log("BACKEND (SIM): Buscando histórico de compras...");
    return new Promise(resolve => { setTimeout(() => { resolve([...mockHistoricoCompras]); }, 300); });
}
async function saveCompra(novaCompra) {
    console.log("BACKEND (SIM): Salvando nova compra...", novaCompra);
    return new Promise(resolve => {
        setTimeout(() => {
            mockHistoricoCompras.push(novaCompra);
            resolve({ success: true, data: novaCompra });
        }, 500); 
    });
}
async function deleteCompra(compraId) {
    console.log("BACKEND (SIM): Excluindo compra ID:", compraId);
    return new Promise(resolve => {
        setTimeout(() => {
            mockHistoricoCompras = mockHistoricoCompras.filter(compra => compra.compraId !== compraId);
            resolve({ success: true });
        }, 500);
    });
}
async function executarExclusaoInsumo(id) { // Função helper para o handleConfirmarAcao
    const response = await deleteCompra(id);
    if (response.success) {
        await atualizarTabelasInsumos();
        fecharModalConfirmacao();
        mostrarNotificacao('Excluído!', `O registro de compra foi excluído com sucesso.`);
    } else {
        fecharModalConfirmacao();
        mostrarNotificacao('Erro!', `Não foi possível excluir o registro.`);
    }
}

// ==================================================
// === MÓDULO INSUMOS: Funções de Renderização ===
// ==================================================
let formCompra, selectInsumo, inputData, inputQuantidade, inputFornecedor, inputCusto, botaoRegistrar;
let tbodyEstoqueAtual, tbodyHistoricoCompras;

async function inicializarModuloInsumos() {
    formCompra = document.getElementById('form-compra');
    if (!formCompra) return; // Seção não existe, não faz nada
    
    selectInsumo = document.getElementById('compra-insumo');
    inputData = document.getElementById('compra-data');
    inputQuantidade = document.getElementById('compra-quantidade');
    inputFornecedor = document.getElementById('compra-fornecedor');
    inputCusto = document.getElementById('compra-custo');
    botaoRegistrar = document.getElementById('botao-registrar');
    tbodyEstoqueAtual = document.getElementById('tbody-estoque-atual');
    tbodyHistoricoCompras = document.getElementById('tbody-historico-compras');

    const tipos = await fetchTiposDeInsumo();
    popularSelectInsumos(tipos);
    await atualizarTabelasInsumos();
    formCompra.addEventListener('submit', handleRegistrarCompra);
    tbodyHistoricoCompras.addEventListener('click', handleExcluirCompra);
}
function popularSelectInsumos(tipos) {
    if (!selectInsumo) return;
    selectInsumo.innerHTML = '<option value="">Selecione o insumo...</option>';
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
        tbodyHistoricoCompras.innerHTML = '<tr><td colspan="6">Nenhum registro de compra encontrado.</td></tr>';
        return;
    }
    compras.sort((a, b) => new Date(b.data) - new Date(a.data)); 
    compras.forEach(compra => {
        const tipoInsumo = mockTiposDeInsumo.find(t => t.id === compra.insumoId) || { nome: 'Desconhecido' };
        const tr = document.createElement('tr');
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
        estoque.get(tipo.id).total += compra.quantidade;
    });
    if (estoque.size === 0) {
        tbodyEstoqueAtual.innerHTML = '<tr><td colspan="3">Estoque vazio.</td></tr>';
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
        compraId: Date.now(), insumoId: selectInsumo.value, data: inputData.value,
        quantidade: parseFloat(inputQuantidade.value), fornecedor: inputFornecedor.value.trim(),
        custo: parseFloat(inputCusto.value)
    };
    if (!novaCompra.insumoId || !novaCompra.data || isNaN(novaCompra.quantidade) || novaCompra.quantidade <= 0) {
        mostrarNotificacao('Erro!', 'Por favor, preencha o Insumo, Data e Quantidade corretamente.');
        return;
    }
    botaoRegistrar.disabled = true; botaoRegistrar.textContent = 'Salvando...';
    const response = await saveCompra(novaCompra);
    if (response.success) {
        await atualizarTabelasInsumos(); 
        formCompra.reset();
        mostrarNotificacao('Sucesso!', 'Compra registrada com sucesso.');
    } else {
        mostrarNotificacao('Erro!', 'Erro ao salvar a compra.');
    }
    botaoRegistrar.disabled = false; botaoRegistrar.textContent = 'Registrar Compra';
}
async function handleExcluirCompra(e) {
    const botao = e.target.closest('[data-delete-compra-id]');
    if (!botao) return; 
    const compraId = parseInt(botao.dataset.deleteCompraId);
    
    // Chama o modal global
    acaoParaConfirmar = { tipo: 'insumo', id: compraId };
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir este registro de compra? (ID: ${compraId})`;
    modalConfirmacao.classList.remove('hidden');
}
async function atualizarTabelasInsumos() {
    const compras = await fetchHistoricoCompras();
    renderizarHistoricoInsumos(compras);
    renderizarEstoqueAtual(compras);
}


// ==================================================
// === MÓDULO VETERINÁRIO (CRUD e Funções) ===
// ==================================================
// (Estas são as funções originais do dashboard-veterinario,
//  refatoradas para usar os modais globais)
// ==================================================

// --- Funções de Carregamento (Render) ---
function carregarGeneticas() {
    const tbody = document.getElementById('tabela-geneticas');
    tbody.innerHTML = '';
    geneticas.forEach(genetica => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${genetica.id}</td>
            <td>${genetica.nome}</td>
            <td>${genetica.descricao}</td>
            <td>${genetica.caracteristicas}</td>
            <td><span class="status-badge status-${genetica.status}">${genetica.status}</span></td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${genetica.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${genetica.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    atualizarSelectGeneticas();
}
function carregarLotes() {
    const tbody = document.getElementById('tabela-lotes');
    tbody.innerHTML = '';
    lotes.forEach(lote => {
        const row = document.createElement('tr');
        const dataFormatada = formatarData(lote.dataCriacao);
        row.innerHTML = `
            <td>${lote.id}</td>
            <td>${lote.nome}</td>
            <td>${lote.geneticaNome}</td>
            <td>${lote.quantidadeAnimais}</td>
            <td>${dataFormatada}</td>
            <td><span class="status-badge status-${lote.status}">${lote.status}</span></td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${lote.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${lote.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function carregarOcorrencias() {
    const tbody = document.getElementById('tabela-ocorrencias');
    tbody.innerHTML = '';
    const ocorrenciasOrdenadas = [...ocorrencias].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    ocorrenciasOrdenadas.forEach(ocorrencia => {
        const row = document.createElement('tr');
        const dataHoraFormatada = new Date(ocorrencia.dataHora).toLocaleString('pt-BR');
        if (ocorrencia.prioridade === 'critica') row.classList.add('row-critica');
        row.innerHTML = `
            <td>${ocorrencia.id}</td>
            <td>${dataHoraFormatada}</td>
            <td>${ocorrencia.loteNome}</td>
            <td><span class="status-badge tipo-${ocorrencia.tipo}">${ocorrencia.tipo}</span></td>
            <td><span class="status-badge prioridade-${ocorrencia.prioridade}">${ocorrencia.prioridade}</span></td>
            <td>${ocorrencia.titulo}</td>
            <td><span class="status-badge status-${ocorrencia.status.replace('-', '')}">${ocorrencia.status.replace('-', ' ')}</span></td>
            <td>${ocorrencia.veterinarioResponsavel}</td>
            <td>
                <button class="btn btn-secondary btn-small" data-view-id="${ocorrencia.id}" title="Visualizar">👁️</button>
                <button class="btn btn-info btn-small" data-edit-id="${ocorrencia.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${ocorrencia.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    atualizarSelectLotesOcorrencias();
    atualizarResumoOcorrencias();
}
function carregarBercarios() {
    const tbody = document.getElementById('tabela-bercario');
    tbody.innerHTML = '';
    bercarios.forEach(bercario => {
        const row = document.createElement('tr');
        const dataNascFormatada = formatarData(bercario.dataNascimento);
        const dataDesmameFormatada = bercario.dataDesmame ? formatarData(bercario.dataDesmame) : '-';
        row.innerHTML = `
            <td>${bercario.id}</td>
            <td>${bercario.loteNome}</td>
            <td>${bercario.quantidadeLeitoes}</td>
            <td>${dataNascFormatada}</td>
            <td>${bercario.pesoMedio}</td>
            <td><span class="status-badge status-${bercario.status}">${bercario.status}</span></td>
            <td>${dataDesmameFormatada}</td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${bercario.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${bercario.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    atualizarSelectLotes();
}
function carregarMaternidades() {
    const tbody = document.getElementById('tabela-maternidade');
    tbody.innerHTML = '';
    maternidades.forEach(maternidade => {
        const row = document.createElement('tr');
        const dataCoberturaFormatada = formatarData(maternidade.dataCobertura);
        const dataPartoFormatada = formatarData(maternidade.dataPartoPrevisao);
        row.innerHTML = `
            <td>${maternidade.id}</td>
            <td>${maternidade.brincoPorca}</td>
            <td>${maternidade.geneticaNome}</td>
            <td>${dataCoberturaFormatada}</td>
            <td>${dataPartoFormatada}</td>
            <td>${maternidade.quantidadeLeitoes}</td>
            <td><span class="status-badge status-${maternidade.status}">${maternidade.status}</span></td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${maternidade.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${maternidade.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function carregarInseminacoes() {
    const tbody = document.getElementById('tabela-inseminacao');
    tbody.innerHTML = '';
    inseminacoes.forEach(inseminacao => {
        const row = document.createElement('tr');
        const dataInseminacaoFormatada = formatarData(inseminacao.dataInseminacao);
        const dataVerificacaoFormatada = inseminacao.dataVerificacao ? formatarData(inseminacao.dataVerificacao) : '-';
        row.innerHTML = `
            <td>${inseminacao.id}</td>
            <td>${inseminacao.brincoFemea}</td>
            <td>${inseminacao.geneticaMachoNome}</td>
            <td>${dataInseminacaoFormatada}</td>
            <td>${inseminacao.tecnica}</td>
            <td><span class="status-badge status-${inseminacao.resultado}">${inseminacao.resultado}</span></td>
            <td>${dataVerificacaoFormatada}</td>
            <td>
                <button class="btn btn-info btn-small" data-edit-id="${inseminacao.id}">Editar</button>
                <button class="btn btn-danger btn-small" data-delete-id="${inseminacao.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// --- Funções de Abrir/Editar/Excluir (CRUD) ---
function abrirModalGenetica() {
    geneticaEditando = null;
    document.getElementById('titulo-modal-genetica').textContent = 'Nova Genética';
    document.getElementById('form-genetica').reset();
    document.getElementById('modal-genetica').style.display = 'block';
}
function editarGenetica(id) {
    geneticaEditando = geneticas.find(g => g.id === id);
    if (geneticaEditando) {
        document.getElementById('titulo-modal-genetica').textContent = 'Editar Genética';
        document.getElementById('nome-genetica').value = geneticaEditando.nome;
        document.getElementById('descricao-genetica').value = geneticaEditando.descricao;
        document.getElementById('caracteristicas-genetica').value = geneticaEditando.caracteristicas;
        document.getElementById('status-genetica').value = geneticaEditando.status;
        document.getElementById('modal-genetica').style.display = 'block';
    }
}
function excluirGenetica(id) {
    const item = geneticas.find(g => g.id === id); if (!item) return;
    const lotesVinculados = lotes.filter(lote => lote.geneticaId === id);
    if (lotesVinculados.length > 0) {
        mostrarNotificacao('Erro!', `Não é possível excluir esta genética pois ela está vinculada aos lotes: ${lotesVinculados.map(l => l.nome).join(', ')}.`);
        return;
    }
    mostrarConfirmacao('genetica', id, item.nome);
}
function fecharModalGenetica() { document.getElementById('modal-genetica').style.display = 'none'; geneticaEditando = null; }

function abrirModalLote() {
    loteEditando = null;
    document.getElementById('titulo-modal-lote').textContent = 'Novo Lote';
    document.getElementById('form-lote').reset();
    document.getElementById('data-criacao').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-lote').style.display = 'block';
}
function editarLote(id) {
    loteEditando = lotes.find(l => l.id === id);
    if (loteEditando) {
        document.getElementById('titulo-modal-lote').textContent = 'Editar Lote';
        document.getElementById('nome-lote').value = loteEditando.nome;
        document.getElementById('genetica-lote').value = loteEditando.geneticaId;
        document.getElementById('quantidade-animais').value = loteEditando.quantidadeAnimais;
        document.getElementById('data-criacao').value = loteEditando.dataCriacao;
        document.getElementById('status-lote').value = loteEditando.status;
        document.getElementById('modal-lote').style.display = 'block';
    }
}
function excluirLote(id) { const item = lotes.find(l => l.id === id); if (item) mostrarConfirmacao('lote', id, item.nome); }
function fecharModalLote() { document.getElementById('modal-lote').style.display = 'none'; loteEditando = null; }

function abrirModalOcorrencia() {
    ocorrenciaEditando = null;
    document.getElementById('titulo-modal-ocorrencia').textContent = 'Nova Ocorrência';
    document.getElementById('form-ocorrencia').reset();
    const agora = new Date();
    const dataHoraAtual = agora.toISOString().slice(0, 16);
    document.getElementById('data-hora-ocorrencia').value = dataHoraAtual;
    const campoVeterinario = document.getElementById('veterinario-responsavel');
    if (campoVeterinario) campoVeterinario.value = obterVeterinarioLogado();
    document.getElementById('modal-ocorrencia').style.display = 'block';
}
function editarOcorrencia(id) {
    ocorrenciaEditando = ocorrencias.find(o => o.id === id);
    if (ocorrenciaEditando) {
        document.getElementById('titulo-modal-ocorrencia').textContent = 'Editar Ocorrência';
        document.getElementById('lote-ocorrencia').value = ocorrenciaEditando.loteId;
        document.getElementById('tipo-ocorrencia').value = ocorrenciaEditando.tipo;
        document.getElementById('prioridade-ocorrencia').value = ocorrenciaEditando.prioridade;
        document.getElementById('data-hora-ocorrencia').value = ocorrenciaEditando.dataHora;
        document.getElementById('titulo-ocorrencia').value = ocorrenciaEditando.titulo;
        document.getElementById('descricao-ocorrencia').value = ocorrenciaEditando.descricao;
        document.getElementById('animais-afetados').value = ocorrenciaEditando.animaisAfetados;
        document.getElementById('medicamento-aplicado').value = ocorrenciaEditando.medicamentoAplicado;
        document.getElementById('dosagem').value = ocorrenciaEditando.dosagem;
        document.getElementById('veterinario-responsavel').value = ocorrenciaEditando.veterinarioResponsavel;
        document.getElementById('proximas-acoes').value = ocorrenciaEditando.proximasAcoes;
        document.getElementById('status-ocorrencia').value = ocorrenciaEditando.status;
        document.getElementById('modal-ocorrencia').style.display = 'block';
    }
}
function visualizarOcorrencia(id) {
    const ocorrencia = ocorrencias.find(o => o.id === id);
    if (ocorrencia) {
        const dataHoraFormatada = new Date(ocorrencia.dataHora).toLocaleString('pt-BR');
        let medicamentoInfo = '';
        if (ocorrencia.medicamentoAplicado) {
            medicamentoInfo = `\n\n💊 Medicamento: ${ocorrencia.medicamentoAplicado}`;
            if (ocorrencia.dosagem) medicamentoInfo += `\n📏 Dosagem: ${ocorrencia.dosagem}`;
        }
        let proximasAcoesInfo = '';
        if (ocorrencia.proximasAcoes) {
            proximasAcoesInfo = `\n\n📋 Próximas Ações:\n${ocorrencia.proximasAcoes}`;
        }
        // Usamos alert() aqui pois é só visualização, não uma ação
        alert(`🔍 DETALHES DA OCORRÊNCIA #${ocorrencia.id}\n\n📅 Data/Hora: ${dataHoraFormatada}\n🐷 Lote: ${ocorrencia.loteNome}\n🏷️ Tipo: ${ocorrencia.tipo.toUpperCase()}\n⚠️ Prioridade: ${ocorrencia.prioridade.toUpperCase()}\n📊 Status: ${ocorrencia.status.replace('-', ' ').toUpperCase()}\n\n📝 Título: ${ocorrencia.titulo}\n\n📄 Descrição:\n${ocorrencia.descricao}\n\n🐖 Animais Afetados: ${ocorrencia.animaisAfetados || 'Não especificado'}${medicamentoInfo}\n\n👨‍⚕️ Veterinário: ${ocorrencia.veterinarioResponsavel}${proximasAcoesInfo}`);
    }
}
function excluirOcorrencia(id) { const item = ocorrencias.find(o => o.id === id); if (item) mostrarConfirmacao('ocorrencia', id, item.titulo); }
function fecharModalOcorrencia() { document.getElementById('modal-ocorrencia').style.display = 'none'; ocorrenciaEditando = null; }

function abrirModalBercario() {
    bercarioEditando = null;
    document.getElementById('titulo-modal-bercario').textContent = 'Novo Registro de Berçário';
    document.getElementById('form-bercario').reset();
    document.getElementById('data-nascimento').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-bercario').style.display = 'block';
}
function editarBercario(id) {
    bercarioEditando = bercarios.find(b => b.id === id);
    if (bercarioEditando) {
        document.getElementById('titulo-modal-bercario').textContent = 'Editar Registro de Berçário';
        document.getElementById('lote-bercario').value = bercarioEditando.loteId;
        document.getElementById('quantidade-leitoes').value = bercarioEditando.quantidadeLeitoes;
        document.getElementById('data-nascimento').value = bercarioEditando.dataNascimento;
        document.getElementById('peso-medio').value = bercarioEditando.pesoMedio;
        document.getElementById('status-bercario').value = bercarioEditando.status;
        document.getElementById('data-desmame').value = bercarioEditando.dataDesmame || '';
        document.getElementById('modal-bercario').style.display = 'block';
    }
}
function excluirBercario(id) { const item = bercarios.find(b => b.id === id); if (item) mostrarConfirmacao('bercario', id, `Registro #${id}`); }
function fecharModalBercario() { document.getElementById('modal-bercario').style.display = 'none'; bercarioEditando = null; }

function abrirModalMaternidade() {
    maternidadeEditando = null;
    document.getElementById('titulo-modal-maternidade').textContent = 'Nova Porca na Maternidade';
    document.getElementById('form-maternidade').reset();
    const dataCobertura = document.getElementById('data-cobertura');
    const dataPartoPrevisao = document.getElementById('data-parto-prevista');
    dataCobertura.addEventListener('change', function() {
        if (this.value) {
            const cobertura = new Date(this.value);
            cobertura.setDate(cobertura.getDate() + 114);
            dataPartoPrevisao.value = cobertura.toISOString().split('T')[0];
        }
    });
    document.getElementById('modal-maternidade').style.display = 'block';
}
function editarMaternidade(id) {
    maternidadeEditando = maternidades.find(m => m.id === id);
    if (maternidadeEditando) {
        document.getElementById('titulo-modal-maternidade').textContent = 'Editar Porca na Maternidade';
        document.getElementById('brinco-porca').value = maternidadeEditando.brincoPorca;
        document.getElementById('genetica-porca').value = maternidadeEditando.geneticaId;
        document.getElementById('data-cobertura').value = maternidadeEditando.dataCobertura;
        document.getElementById('data-parto-prevista').value = maternidadeEditando.dataPartoPrevisao;
        document.getElementById('quantidade-leitoes-nascidos').value = maternidadeEditando.quantidadeLeitoes;
        document.getElementById('status-maternidade').value = maternidadeEditando.status;
        document.getElementById('modal-maternidade').style.display = 'block';
    }
}
function excluirMaternidade(id) { const item = maternidades.find(m => m.id === id); if (item) mostrarConfirmacao('maternidade', id, `Registro #${id}`); }
function fecharModalMaternidade() { document.getElementById('modal-maternidade').style.display = 'none'; maternidadeEditando = null; }

function abrirModalInseminacao() {
    inseminacaoEditando = null;
    document.getElementById('titulo-modal-inseminacao').textContent = 'Nova Inseminação';
    document.getElementById('form-inseminacao').reset();
    document.getElementById('data-inseminacao').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-inseminacao').style.display = 'block';
}
function editarInseminacao(id) {
    inseminacaoEditando = inseminacoes.find(i => i.id === id);
    if (inseminacaoEditando) {
        document.getElementById('titulo-modal-inseminacao').textContent = 'Editar Inseminação';
        document.getElementById('brinco-femea').value = inseminacaoEditando.brincoFemea;
        document.getElementById('genetica-macho').value = inseminacaoEditando.geneticaMachoId;
        document.getElementById('data-inseminacao').value = inseminacaoEditando.dataInseminacao;
        document.getElementById('tecnica-inseminacao').value = inseminacaoEditando.tecnica;
        document.getElementById('resultado-inseminacao').value = inseminacaoEditando.resultado;
        document.getElementById('data-verificacao').value = inseminacaoEditando.dataVerificacao || '';
        document.getElementById('modal-inseminacao').style.display = 'block';
    }
}
function excluirInseminacao(id) { const item = inseminacoes.find(i => i.id === id); if (item) mostrarConfirmacao('inseminacao', id, `Registro #${id}`); }
function fecharModalInseminacao() { document.getElementById('modal-inseminacao').style.display = 'none'; inseminacaoEditando = null; }


// --- Funções de Atualização de UI (Selects, Relatórios, etc.) ---
function atualizarSelectGeneticas() {
    const selects = [ document.getElementById('genetica-lote'), document.getElementById('filtro-lote-genetica'), document.getElementById('genetica-porca'), document.getElementById('genetica-macho'), document.getElementById('filtro-maternidade-genetica') ];
    const optionsHtml = geneticas.filter(g => g.status === 'ativa').map(g => `<option value="${g.id}">${g.nome}</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0 || index === 2 || index === 3) select.options[0].textContent = "Selecione uma genética";
    });
}
function atualizarSelectLotes() {
    const selects = [ document.getElementById('lote-bercario'), document.getElementById('filtro-bercario-lote') ];
    const optionsHtml = lotes.filter(l => l.status === 'ativo').map(l => `<option value="${l.id}">${l.nome}</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0) firstOption.textContent = "Selecione um lote";
    });
}
function atualizarSelectLotesOcorrencias() {
    const selects = [ document.getElementById('lote-ocorrencia'), document.getElementById('filtro-ocorrencia-lote') ];
    const optionsHtml = lotes.map(lote => `<option value="${lote.id}">${lote.nome} (${lote.status})</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0) firstOption.textContent = "Selecione um lote";
    });
}
function atualizarResumoOcorrencias() {
    const ocorrenciasCriticas = ocorrencias.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length;
    const ocorrenciasPendentes = ocorrencias.filter(o => o.status === 'pendente' || o.status === 'em-andamento').length;
    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
    const ocorrenciasResolvidasHoje = ocorrencias.filter(o => o.status === 'resolvida' && new Date(o.dataHora) > ontem).length;
    document.getElementById('ocorrencias-criticas').textContent = ocorrenciasCriticas;
    document.getElementById('ocorrencias-pendentes').textContent = ocorrenciasPendentes;
    document.getElementById('ocorrencias-resolvidas-hoje').textContent = ocorrenciasResolvidasHoje;
}
function atualizarRelatorios() {
    document.getElementById('total-geneticas').textContent = geneticas.filter(g => g.status === 'ativa').length;
    document.getElementById('total-lotes').textContent = lotes.filter(l => l.status === 'ativo').length;
    document.getElementById('total-animais').textContent = lotes.reduce((sum, lote) => sum + lote.quantidadeAnimais, 0);
    document.getElementById('lotes-quarentena').textContent = lotes.filter(l => l.status === 'quarentena').length;
    document.getElementById('total-leitoes-bercario').textContent = bercarios.filter(b => b.status === 'ativo').reduce((sum, bercario) => sum + bercario.quantidadeLeitoes, 0);
    document.getElementById('total-porcas-gestantes').textContent = maternidades.filter(m => m.status === 'gestante').length;
    document.getElementById('total-porcas-lactantes').textContent = maternidades.filter(m => m.status === 'lactante').length;
    document.getElementById('total-inseminacoes-pendentes').textContent = inseminacoes.filter(i => i.resultado === 'aguardando').length;
}

// --- Funções de Configuração (Listeners) ---
function configurarFiltros() {
    const filtroGenetica = document.getElementById('filtro-genetica');
    if(filtroGenetica) filtroGenetica.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        document.querySelectorAll('#tabela-geneticas tr').forEach(row => { row.style.display = (row.cells[1]?.textContent.toLowerCase() || '').includes(filtro) ? '' : 'none'; });
    });
    
    const filtroLoteGen = document.getElementById('filtro-lote-genetica');
    if(filtroLoteGen) filtroLoteGen.addEventListener('change', aplicarFiltrosLotes);
    
    const filtroLoteStatus = document.getElementById('filtro-lote-status');
    if(filtroLoteStatus) filtroLoteStatus.addEventListener('change', aplicarFiltrosLotes);
    
    const filtroOcorLote = document.getElementById('filtro-ocorrencia-lote');
    if(filtroOcorLote) filtroOcorLote.addEventListener('change', aplicarFiltrosOcorrencias);
    
    const filtroOcorTipo = document.getElementById('filtro-ocorrencia-tipo');
    if(filtroOcorTipo) filtroOcorTipo.addEventListener('change', aplicarFiltrosOcorrencias);
    
    const filtroOcorPrio = document.getElementById('filtro-ocorrencia-prioridade');
    if(filtroOcorPrio) filtroOcorPrio.addEventListener('change', aplicarFiltrosOcorrencias);
    
    const filtroBercLote = document.getElementById('filtro-bercario-lote');
    if(filtroBercLote) filtroBercLote.addEventListener('change', aplicarFiltrosBercario);
    
    const filtroBercStatus = document.getElementById('filtro-bercario-status');
    if(filtroBercStatus) filtroBercStatus.addEventListener('change', aplicarFiltrosBercario);
    
    const filtroMatGen = document.getElementById('filtro-maternidade-genetica');
    if(filtroMatGen) filtroMatGen.addEventListener('change', aplicarFiltrosMaternidade);
    
    const filtroMatStatus = document.getElementById('filtro-maternidade-status');
    if(filtroMatStatus) filtroMatStatus.addEventListener('change', aplicarFiltrosMaternidade);
    
    const filtroInsPeriodo = document.getElementById('filtro-inseminacao-periodo');
    if(filtroInsPeriodo) filtroInsPeriodo.addEventListener('change', aplicarFiltrosInseminacao);
    
    const filtroInsRes = document.getElementById('filtro-inseminacao-resultado');
    if(filtroInsRes) filtroInsRes.addEventListener('change', aplicarFiltrosInseminacao);
}
function aplicarFiltrosLotes() {
    const filtroGenetica = document.getElementById('filtro-lote-genetica').value; const filtroStatus = document.getElementById('filtro-lote-status').value;
    document.querySelectorAll('#tabela-lotes tr').forEach(row => {
        const geneticaCell = row.cells[2]?.textContent || ''; const statusCell = row.cells[5]?.textContent.toLowerCase() || ''; let mostrar = true;
        if (filtroGenetica) { const geneticaSelecionada = geneticas.find(g => g.id == filtroGenetica); if (geneticaSelecionada && geneticaCell !== geneticaSelecionada.nome) mostrar = false; }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
function aplicarFiltrosOcorrencias() {
    const filtroLote = document.getElementById('filtro-ocorrencia-lote').value; const filtroTipo = document.getElementById('filtro-ocorrencia-tipo').value; const filtroPrioridade = document.getElementById('filtro-ocorrencia-prioridade').value;
    document.querySelectorAll('#tabela-ocorrencias tr').forEach(row => {
        const loteCell = row.cells[2]?.textContent || ''; const tipoCell = row.cells[3]?.textContent.toLowerCase() || ''; const prioridadeCell = row.cells[4]?.textContent.toLowerCase() || ''; let mostrar = true;
        if (filtroLote) { const loteSelecionado = lotes.find(l => l.id == filtroLote); if (loteSelecionado && !loteCell.includes(loteSelecionado.nome)) mostrar = false; }
        if (filtroTipo && !tipoCell.includes(filtroTipo)) mostrar = false;
        if (filtroPrioridade && !prioridadeCell.includes(filtroPrioridade)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
function aplicarFiltrosBercario() {
    const filtroLote = document.getElementById('filtro-bercario-lote').value; const filtroStatus = document.getElementById('filtro-bercario-status').value;
    document.querySelectorAll('#tabela-bercario tr').forEach(row => {
        const loteCell = row.cells[1]?.textContent || ''; const statusCell = row.cells[5]?.textContent.toLowerCase() || ''; let mostrar = true;
        if (filtroLote) { const loteSelecionado = lotes.find(l => l.id == filtroLote); if (loteSelecionado && loteCell !== loteSelecionado.nome) mostrar = false; }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
function aplicarFiltrosMaternidade() {
    const filtroGenetica = document.getElementById('filtro-maternidade-genetica').value; const filtroStatus = document.getElementById('filtro-maternidade-status').value;
    document.querySelectorAll('#tabela-maternidade tr').forEach(row => {
        const geneticaCell = row.cells[2]?.textContent || ''; const statusCell = row.cells[6]?.textContent.toLowerCase() || ''; let mostrar = true;
        if (filtroGenetica) { const geneticaSelecionada = geneticas.find(g => g.id == filtroGenetica); if (geneticaSelecionada && geneticaCell !== geneticaSelecionada.nome) mostrar = false; }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
function aplicarFiltrosInseminacao() {
    const filtroPeriodo = document.getElementById('filtro-inseminacao-periodo').value; const filtroResultado = document.getElementById('filtro-inseminacao-resultado').value;
    document.querySelectorAll('#tabela-inseminacao tr').forEach(row => {
        const dataCell = row.cells[3]?.textContent || ''; const resultadoCell = row.cells[5]?.textContent.toLowerCase() || ''; let mostrar = true;
        if (filtroPeriodo && dataCell) {
            const dataInseminacao = new Date(dataCell.split('/').reverse().join('-')); const hoje = new Date(); const diasAtras = new Date(); diasAtras.setDate(hoje.getDate() - parseInt(filtroPeriodo));
            if (dataInseminacao < diasAtras) mostrar = false;
        }
        if (filtroResultado && !resultadoCell.includes(filtroResultado)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}

function configurarFormularios() {
    const formGenetica = document.getElementById('form-genetica');
    if(formGenetica) formGenetica.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaData = { nome: formData.get('nome-genetica'), descricao: formData.get('descricao-genetica'), caracteristicas: formData.get('caracteristicas-genetica'), status: formData.get('status-genetica') };
        if (geneticaEditando && geneticaData.status === 'inativa' && geneticaEditando.status === 'ativa') {
            const lotesAtivos = lotes.filter(lote => lote.geneticaId === geneticaEditando.id && (lote.status === 'ativo' || lote.status === 'quarentena'));
            if (lotesAtivos.length > 0) {
                mostrarNotificacao('Erro!', `Não é possível inativar esta genética pois ela possui lotes ativos: ${lotesAtivos.map(l => l.nome).join(', ')}.`);
                return;
            }
        }
        if (geneticaEditando) Object.assign(geneticaEditando, geneticaData);
        else { geneticaData.id = Math.max(...geneticas.map(g => g.id), 0) + 1; geneticas.push(geneticaData); }
        carregarGeneticas(); atualizarRelatorios(); fecharModalGenetica();
        mostrarNotificacao('Sucesso!', `Genética "${geneticaData.nome}" salva com sucesso.`);
    });
    
    const formLote = document.getElementById('form-lote');
    if(formLote) formLote.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaId = parseInt(formData.get('genetica-lote'));
        const genetica = geneticas.find(g => g.id === geneticaId);
        if (!genetica) { mostrarNotificacao('Erro!', 'Selecione uma genética válida'); return; }
        const loteData = { nome: formData.get('nome-lote'), geneticaId: geneticaId, geneticaNome: genetica.nome, quantidadeAnimais: parseInt(formData.get('quantidade-animais')), dataCriacao: formData.get('data-criacao'), status: formData.get('status-lote') };
        if (loteEditando) Object.assign(loteEditando, loteData);
        else { loteData.id = Math.max(...lotes.map(l => l.id), 0) + 1; lotes.push(loteData); }
        carregarLotes(); atualizarRelatorios(); fecharModalLote();
        mostrarNotificacao('Sucesso!', `Lote "${loteData.nome}" salvo com sucesso.`);
    });
    
    const formOcorrencia = document.getElementById('form-ocorrencia');
    if(formOcorrencia) formOcorrencia.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loteId = parseInt(formData.get('lote-ocorrencia'));
        const lote = lotes.find(l => l.id === loteId);
        if (!lote) { mostrarNotificacao('Erro!', 'Selecione um lote válido'); return; }
        const ocorrenciaData = { dataHora: formData.get('data-hora-ocorrencia'), loteId: loteId, loteNome: lote.nome, tipo: formData.get('tipo-ocorrencia'), prioridade: formData.get('prioridade-ocorrencia'), titulo: formData.get('titulo-ocorrencia'), descricao: formData.get('descricao-ocorrencia'), animaisAfetados: parseInt(formData.get('animais-afetados')) || 0, medicamentoAplicado: formData.get('medicamento-aplicado') || '', dosagem: formData.get('dosagem') || '', veterinarioResponsavel: formData.get('veterinario-responsavel'), proximasAcoes: formData.get('proximas-acoes') || '', status: formData.get('status-ocorrencia') };
        if (ocorrenciaEditando) Object.assign(ocorrenciaEditando, ocorrenciaData);
        else { ocorrenciaData.id = Math.max(...ocorrencias.map(o => o.id), 0) + 1; ocorrencias.push(ocorrenciaData); }
        carregarOcorrencias(); atualizarRelatorios(); fecharModalOcorrencia();
        mostrarNotificacao('Sucesso!', `Ocorrência "${ocorrenciaData.titulo}" salva.`);
        if (ocorrenciaData.prioridade === 'critica') {
            mostrarNotificacao('Atenção!', 'Ocorrência CRÍTICA registrada. Requer atenção imediata.');
        }
    });
    
    const formBercario = document.getElementById('form-bercario');
    if(formBercario) formBercario.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loteId = parseInt(formData.get('lote-bercario'));
        const lote = lotes.find(l => l.id === loteId);
        if (!lote) { mostrarNotificacao('Erro!', 'Selecione um lote válido'); return; }
        const bercarioData = { loteId: loteId, loteNome: lote.nome, quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes')), dataNascimento: formData.get('data-nascimento'), pesoMedio: parseFloat(formData.get('peso-medio')), status: formData.get('status-bercario'), dataDesmame: formData.get('data-desmame') || null };
        if (bercarioEditando) Object.assign(bercarioEditando, bercarioData);
        else { bercarioData.id = Math.max(...bercarios.map(b => b.id), 0) + 1; bercarios.push(bercarioData); }
        carregarBercarios(); atualizarRelatorios(); fecharModalBercario();
        mostrarNotificacao('Sucesso!', `Registro do berçário (Lote ${lote.nome}) salvo com sucesso.`);
    });
    
    const formMaternidade = document.getElementById('form-maternidade');
    if(formMaternidade) formMaternidade.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaId = parseInt(formData.get('genetica-porca'));
        const genetica = geneticas.find(g => g.id === geneticaId);
        if (!genetica) { mostrarNotificacao('Erro!', 'Selecione uma genética válida'); return; }
        const maternidadeData = { brincoPorca: formData.get('brinco-porca'), geneticaId: geneticaId, geneticaNome: genetica.nome, dataCobertura: formData.get('data-cobertura'), dataPartoPrevisao: formData.get('data-parto-prevista'), quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes-nascidos')) || 0, status: formData.get('status-maternidade') };
        if (maternidadeEditando) Object.assign(maternidadeEditando, maternidadeData);
        else { maternidadeData.id = Math.max(...maternidades.map(m => m.id), 0) + 1; maternidades.push(maternidadeData); }
        carregarMaternidades(); atualizarRelatorios(); fecharModalMaternidade();
        mostrarNotificacao('Sucesso!', `Registro da porca "${maternidadeData.brincoPorca}" salvo com sucesso.`);
    });
    
    const formInseminacao = document.getElementById('form-inseminacao');
    if(formInseminacao) formInseminacao.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaMachoId = parseInt(formData.get('genetica-macho'));
        const geneticaMacho = geneticas.find(g => g.id === geneticaMachoId);
        if (!geneticaMacho) { mostrarNotificacao('Erro!', 'Selecione uma genética válida para o macho'); return; }
        const inseminacaoData = { brincoFemea: formData.get('brinco-femea'), geneticaMachoId: geneticaMachoId, geneticaMachoNome: geneticaMacho.nome, dataInseminacao: formData.get('data-inseminacao'), tecnica: formData.get('tecnica-inseminacao'), resultado: formData.get('resultado-inseminacao'), dataVerificacao: formData.get('data-verificacao') || null };
        if (inseminacaoEditando) Object.assign(inseminacaoEditando, inseminacaoData);
        else { inseminacaoData.id = Math.max(...inseminacoes.map(i => i.id), 0) + 1; inseminacoes.push(inseminacaoData); }
        carregarInseminacoes(); atualizarRelatorios(); fecharModalInseminacao();
        mostrarNotificacao('Sucesso!', `Registro de inseminação (Fêmea "${inseminacaoData.brincoFemea}") salvo com sucesso.`);
    });
}
function configurarListenersDeBotoes() {
    document.getElementById('btn-logout').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja sair?')) { 
            window.location.href = 'index.html'; 
        }
    });
    // Botões "Novo"
    document.getElementById('btn-abrir-modal-genetica')?.addEventListener('click', abrirModalGenetica);
    document.getElementById('btn-abrir-modal-lote')?.addEventListener('click', abrirModalLote);
    document.getElementById('btn-abrir-modal-ocorrencia')?.addEventListener('click', abrirModalOcorrencia);
    document.getElementById('btn-abrir-modal-bercario')?.addEventListener('click', abrirModalBercario);
    document.getElementById('btn-abrir-modal-maternidade')?.addEventListener('click', abrirModalMaternidade);
    document.getElementById('btn-abrir-modal-inseminacao')?.addEventListener('click', abrirModalInseminacao);

    // Botões de fechar modais (X e Cancelar)
    configurarFechamentoModal('modal-genetica', fecharModalGenetica);
    configurarFechamentoModal('modal-lote', fecharModalLote);
    configurarFechamentoModal('modal-ocorrencia', fecharModalOcorrencia);
    configurarFechamentoModal('modal-bercario', fecharModalBercario);
    configurarFechamentoModal('modal-maternidade', fecharModalMaternidade);
    configurarFechamentoModal('modal-inseminacao', fecharModalInseminacao);

    // Tecla ESC para fechar modais
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') { fecharTodosModais(); }
    });
}
function configurarFechamentoModal(modalId, funcaoFechar) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const btnX = document.getElementById(`btn-x-fechar-${modalId}`);
    if (btnX) btnX.addEventListener('click', funcaoFechar);
    const btnCancelar = document.getElementById(`btn-cancelar-${modalId}`);
    if (btnCancelar) btnCancelar.addEventListener('click', funcaoFechar);
    modal.addEventListener('click', function(event) { if (event.target === modal) funcaoFechar(); });
}
function configurarListenersDeTabelas() {
    document.getElementById('tabela-geneticas')?.addEventListener('click', function(e) {
        const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (editId) editarGenetica(Number(editId)); if (deleteId) excluirGenetica(Number(deleteId));
    });
    document.getElementById('tabela-lotes')?.addEventListener('click', function(e) {
        const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (editId) editarLote(Number(editId)); if (deleteId) excluirLote(Number(deleteId));
    });
    document.getElementById('tabela-ocorrencias')?.addEventListener('click', function(e) {
        const viewId = e.target.dataset.viewId; const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (viewId) visualizarOcorrencia(Number(viewId)); if (editId) editarOcorrencia(Number(editId)); if (deleteId) excluirOcorrencia(Number(deleteId));
    });
    document.getElementById('tabela-bercario')?.addEventListener('click', function(e) {
        const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (editId) editarBercario(Number(editId)); if (deleteId) excluirBercario(Number(deleteId));
    });
    document.getElementById('tabela-maternidade')?.addEventListener('click', function(e) {
        const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (editId) editarMaternidade(Number(editId)); if (deleteId) excluirMaternidade(Number(deleteId));
    });
    document.getElementById('tabela-inseminacao')?.addEventListener('click', function(e) {
        const editId = e.target.dataset.editId; const deleteId = e.target.dataset.deleteId;
        if (editId) editarInseminacao(Number(editId)); if (deleteId) excluirInseminacao(Number(deleteId));
    });
}