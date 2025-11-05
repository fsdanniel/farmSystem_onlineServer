"use strict";

// VARIÁVEIS GLOBAIS 
let acaoParaConfirmar = { callback: null };

// SELETORES GLOBAIS (para Modais)
let modalConfirmacao, btnConfirmarAcao, btnCancelarAcao, confirmacaoMensagem;
let modalNotificacao, btnOkNotificacao, notificacaoMensagem, notificacaoTitulo;


// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function () {
    // Capturar seletores dos modais globais
    modalConfirmacao = document.getElementById('modal-confirmacao');
    btnConfirmarAcao = document.getElementById('btn-confirmar-acao');
    btnCancelarAcao = document.getElementById('btn-cancelar-acao');
    confirmacaoMensagem = document.getElementById('confirmacao-mensagem');
    modalNotificacao = document.getElementById('modal-notificacao');
    btnOkNotificacao = document.getElementById('btn-ok-notificacao');
    notificacaoMensagem = document.getElementById('notificacao-mensagem');
    notificacaoTitulo = document.getElementById('notificacao-titulo');

    // Listeners dos modais globais
    if (btnConfirmarAcao) btnConfirmarAcao.addEventListener('click', handleConfirmarAcao);
    if (btnCancelarAcao) btnCancelarAcao.addEventListener('click', fecharModalConfirmacao);
    if (btnOkNotificacao) btnOkNotificacao.addEventListener('click', fecharModalNotificacao);
    if (modalConfirmacao) modalConfirmacao.addEventListener('click', (e) => { if (e.target === modalConfirmacao) fecharModalConfirmacao() });
    if (modalNotificacao) modalNotificacao.addEventListener('click', (e) => { if (e.target === modalNotificacao) fecharModalNotificacao() });

    // Listener do botão Sair (Logout)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('perfilUsuario');
            localStorage.removeItem('nomeUsuario');
            window.location.href = 'index.html';
        });
    }

    // Inicia a aplicação
    mainApp();
});

/**
 * Função principal assíncrona para carregar e inicializar o app.
 */
async function mainApp() {

    // PASSO 1 - VERIFICAR SEGURANÇA E OBTER PERFIL
    const perfilLogado = localStorage.getItem('perfilUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    if (!perfilLogado) {
        console.warn("Nenhum usuário logado. Redirecionando para login.");
        window.location.href = 'index.html';
        return;
    }

    // Funções de inicialização
    inicializarNavegacao();

    // PASSO 2 - APLICAR PERMISSÕES
    aplicarPermissoes(perfilLogado, nomeUsuario);

    // PASSO 3 - INICIALIZAR MÓDULOS
    try {
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

        await inicializarModuloUsuarios();   // (definido em usuarios.js)
        await inicializarModuloFinanceiro(); // (definido em financeiro.js)
        await inicializarModuloTarefas();    // (definido em tarefas.js)
        await inicializarModuloContratos();   // (definido em contratos.js)

        // Configurar listeners (definidos em veterinario.js)
        configurarFiltros();
        configurarFormularios();
        configurarListenersDeBotoes();
        configurarListenersDeTabelas();

    } catch (error) {
        console.error("Erro ao inicializar módulos:", error);
        mostrarNotificacao("Erro Crítico", "Falha ao carregar dados. Recarregue a página.");
    }
}


// NAVEGAÇÃO E PERMISSÕES
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            if (link.parentElement.style.display === 'none') {
                return;
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection + '-section').classList.add('active');
        });
    });
}

function aplicarPermissoes(perfil, nome) {
    // Atualiza o nome do usuário no cabeçalho
    const nomeHeader = document.getElementById('nome-usuario-header');
    if (nomeHeader) {
        nomeHeader.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
    }

    // Define o nome do Vet no formulário de ocorrência (se for o vet)
    if (perfil === 'veterinario') {
        if (typeof carregarDadosVeterinario === 'function') {
            carregarDadosVeterinario();
            atualizarNomeVeterinarioInterface();
        }
    }

    // Filtra os links do menu lateral
    const linksMenu = document.querySelectorAll('.sidebar .nav-menu li');
    linksMenu.forEach(li => {
        const permissoesAttr = li.dataset.permissao;
        if (permissoesAttr) {
            const permissoes = permissoesAttr.split(',');
            if (!permissoes.includes(perfil)) {
                li.style.display = 'none'; // Esconde o link
            } else {
                li.style.display = 'block'; // Garante que esteja visível
            }
        }
    });

    // Filtra as seções de conteúdo
    const secoes = document.querySelectorAll('.section');
    secoes.forEach(section => {
        const permissoesAttr = section.dataset.permissao;
        if (permissoesAttr) {
            const permissoes = permissoesAttr.split(',');
            if (!permissoes.includes(perfil)) {
                section.style.display = 'none'; // Esconde a seção
            }
        }
    });

    // Ativa a *primeira* seção visível para o usuário
    const primeiroLinkVisivel = document.querySelector('.sidebar .nav-menu li:not([style*="display: none"]) .nav-link');

    if (primeiroLinkVisivel) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        primeiroLinkVisivel.classList.add('active');
        const targetSection = primeiroLinkVisivel.dataset.section;
        document.getElementById(targetSection + '-section').classList.add('active');
    } else {
        document.querySelector('.content').innerHTML = "<h1>Acesso Negado</h1><p>Você não tem permissão para visualizar nenhum módulo.</p>";
    }
}


// FUNÇÕES DE MODAIS GLOBAIS
function fecharTodosModais() {
    if (typeof fecharModalGenetica === 'function') fecharModalGenetica();
    if (typeof fecharModalLote === 'function') fecharModalLote();
    if (typeof fecharModalOcorrencia === 'function') fecharModalOcorrencia();
    if (typeof fecharModalBercario === 'function') fecharModalBercario();
    if (typeof fecharModalMaternidade === 'function') fecharModalMaternidade();
    if (typeof fecharModalInseminacao === 'function') fecharModalInseminacao();
    if (typeof fecharModalUsuario === 'function') fecharModalUsuario();
    if (typeof fecharModalFinanceiro === 'function') fecharModalFinanceiro();
    if (typeof fecharModalTarefa === 'function') fecharModalTarefa();

    fecharModalConfirmacao();
    fecharModalNotificacao();
}

function fecharModalConfirmacao() {
    acaoParaConfirmar = { callback: null };
    if (modalConfirmacao) modalConfirmacao.classList.add('hidden');
}

function fecharModalNotificacao() {
    if (modalNotificacao) modalNotificacao.classList.add('hidden');
}

function mostrarNotificacao(titulo, mensagem) {
    if (!notificacaoTitulo || !notificacaoMensagem || !modalNotificacao) {
        console.warn("Elementos do modal de notificação não encontrados. Usando alert() como fallback.");
        alert(`${titulo}: ${mensagem}`);
        return;
    }
    notificacaoTitulo.textContent = titulo;
    notificacaoMensagem.textContent = mensagem;
    modalNotificacao.classList.remove('hidden');
}

function mostrarConfirmacao(tipo, id, nome, callback) {
    if (!modalConfirmacao || !confirmacaoMensagem) {
        console.warn("Elementos do modal de confirmação não encontrados. Usando confirm() como fallback.");
        if (confirm(`Tem certeza que deseja excluir ${tipo} "${nome || id}"?`)) {
            callback();
        }
        return;
    }
    acaoParaConfirmar = { callback };
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir ${tipo} "${nome || id}"? Esta ação não pode ser desfeita.`;
    modalConfirmacao.classList.remove('hidden');
}

function handleConfirmarAcao() {
    if (acaoParaConfirmar.callback) {
        acaoParaConfirmar.callback();
    }
    fecharModalConfirmacao();
}

// FUNÇÕES AUXILIARES GLOBAIS
function formatarData(dataString) {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    if (dia && mes && ano && ano.length === 4) {
        return `${dia}/${mes}/${ano}`;
    }
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime()) || data.getUTCFullYear() < 1900) return '—';
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (e) {
        return dataString;
    }
}
function formatarMoeda(valor) {
    if (isNaN(valor) || valor === null) return 'N/D';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}