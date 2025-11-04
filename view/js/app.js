// Arquivo: js/app.js
// VERSÃO 2.0 (Refatorado - Modularizado)
// Este arquivo agora atua como o "cérebro" principal,
// mas a lógica específica de cada módulo foi movida 
// para a pasta /js/modulos/

"use strict"; // Ativa o modo estrito para boas práticas

// === VARIÁVEIS GLOBAIS ===
// (Apenas as variáveis globais de estado do app)
let veterinarioLogado = { id: null, nome: null, email: null, crmv: null };
// Armazena a FUNÇÃO que será executada se o usuário clicar em "Confirmar"
let acaoParaConfirmar = { callback: null };

// === SELETORES GLOBAIS (para Modais) ===
// (Capturamos no DOMContentLoaded, mas declaramos aqui)
let modalConfirmacao, btnConfirmarAcao, btnCancelarAcao, confirmacaoMensagem;
let modalNotificacao, btnOkNotificacao, notificacaoMensagem, notificacaoTitulo;


// === INICIALIZAÇÃO (O "CÉREBRO" DO APP) ===
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

    // Listeners dos modais globais (definidos aqui)
    btnConfirmarAcao.addEventListener('click', handleConfirmarAcao);
    btnCancelarAcao.addEventListener('click', fecharModalConfirmacao);
    btnOkNotificacao.addEventListener('click', fecharModalNotificacao);
    modalConfirmacao.addEventListener('click', (e) => { if (e.target === modalConfirmacao) fecharModalConfirmacao() });
    modalNotificacao.addEventListener('click', (e) => { if (e.target === modalNotificacao) fecharModalNotificacao() });

    // Inicia a aplicação
    mainApp();
});

/**
 * Função principal assíncrona para carregar e inicializar o app.
 */
async function mainApp() {
    // Funções de inicialização
    // (Estas funções são DEFINIDAS nos arquivos de módulo, 
    //  mas CHAMADAS aqui)
    
    inicializarNavegacao();
    
    // Módulos do Vet (definidos em veterinario.js)
    carregarDadosVeterinario(); // Define o usuário logado (síncrono)
    
    // Agora esperamos (await) os dados serem "buscados"
    // antes de configurar os listeners
    await carregarGeneticas();
    await carregarLotes();
    await carregarOcorrencias();
    await carregarBercarios();
    await carregarMaternidades();
    await carregarInseminacoes();
    await atualizarRelatorios(); // KPIs
    
    // Módulos Integrados
    await inicializarModuloInsumos();    // (definido em insumos.js)
    inicializarModuloRegistros(); // (definido em registros.js - síncrono)
    inicializarModuloRelatorios();  // (definido em relatorios.js - síncrono)
    
    // Configurar listeners (definidos em veterinario.js)
    configurarFiltros();
    configurarFormularios();
    configurarListenersDeBotoes();
    configurarListenersDeTabelas();
    
    // Atualiza o nome do Vet no Header
    atualizarNomeVeterinarioInterface();
}


// === NAVEGAÇÃO E SISTEMA (Funções Globais) ===
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
function obterVeterinarioLogado() { 
    return veterinarioLogado.nome || 'Dr(a). [Nome do Veterinário]'; 
}


// === FUNÇÕES DE MODAIS GLOBAIS (Devem ficar aqui) ===
function fecharTodosModais() {
    // Estas funções são definidas em veterinario.js
    fecharModalGenetica(); fecharModalLote(); fecharModalOcorrencia();
    fecharModalBercario(); fecharModalMaternidade(); fecharModalInseminacao();
    
    // Estas são definidas aqui
    fecharModalConfirmacao(); fecharModalNotificacao();
}

function fecharModalConfirmacao() {
    acaoParaConfirmar = { callback: null };
    if (modalConfirmacao) modalConfirmacao.classList.add('hidden');
}

function fecharModalNotificacao() {
    if (modalNotificacao) modalNotificacao.classList.add('hidden');
}

function mostrarNotificacao(titulo, mensagem) {
    notificacaoTitulo.textContent = titulo;
    notificacaoMensagem.textContent = mensagem;
    modalNotificacao.classList.remove('hidden');
}

/**
 * Mostra o modal de confirmação.
 * @param {string} tipo - O tipo de item (ex: 'genetica', 'lote')
 * @param {number|string} id - O ID do item
 * @param {string} nome - O nome/identificador do item
 * @param {function} callback - A FUNÇÃO que deve ser executada se o usuário clicar em "Confirmar"
 */
function mostrarConfirmacao(tipo, id, nome, callback) {
    acaoParaConfirmar = { callback }; // Armazena a função de callback
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir ${tipo} "${nome || id}"? Esta ação não pode ser desfeita.`;
    modalConfirmacao.classList.remove('hidden');
}

/**
 * Handler genérico do botão "Confirmar".
 * Apenas executa o callback que foi salvo.
 */
function handleConfirmarAcao() {
    // Se tivermos um callback, execute-o
    if (acaoParaConfirmar.callback) {
        acaoParaConfirmar.callback();
    }
    
    // Limpa a ação e fecha o modal
    fecharModalConfirmacao();
}


// === FUNÇÕES AUXILIARES GLOBAIS (Devem ficar aqui) ===
function formatarData(dataString) {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    if (dia && mes && ano && ano.length === 4) {
        return `${dia}/${mes}/${ano}`;
    }
    // Tenta lidar com datas que já podem estar em formato local (ex: datetime-local)
    try {
        const data = new Date(dataString);
        // Verifica se a data é válida e não é o "ano 0"
        if (isNaN(data.getTime()) || data.getUTCFullYear() < 1900) return '—';
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (e) {
        return dataString; // Retorna o original se tudo falhar
    }
}
function formatarMoeda(valor) {
    if (isNaN(valor) || valor === null) return 'N/D';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
