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

    // PASSO 2 - APLICAR PERMISSÕES (Modificado para liberar tudo)
    aplicarPermissoes(perfilLogado, nomeUsuario);

    // PASSO 3 - INICIALIZAR MÓDULOS
    // Envolvemos em try/catch para que um erro em um módulo não pare os outros
    try {
        // Funções de carregamento de dados (assumindo que existam globalmente ou importadas)
        if(typeof carregarGeneticas === 'function') await carregarGeneticas();
        if(typeof carregarLotes === 'function') await carregarLotes();
        if(typeof carregarOcorrencias === 'function') await carregarOcorrencias();
        if(typeof carregarBercarios === 'function') await carregarBercarios();
        if(typeof carregarMaternidades === 'function') await carregarMaternidades();
        if(typeof carregarInseminacoes === 'function') await carregarInseminacoes();
        if(typeof atualizarRelatorios === 'function') await atualizarRelatorios();

        // Inicialização dos Módulos Integrados (Verificamos se existem antes de chamar)
        if(typeof inicializarModuloInsumos === 'function') await inicializarModuloInsumos();
        if(typeof inicializarModuloRegistros === 'function') inicializarModuloRegistros();
        if(typeof inicializarModuloRelatorios === 'function') inicializarModuloRelatorios();
        if(typeof inicializarModuloUsuarios === 'function') await inicializarModuloUsuarios();
        if(typeof inicializarModuloFinanceiro === 'function') await inicializarModuloFinanceiro();
        if(typeof inicializarModuloTarefas === 'function') await inicializarModuloTarefas();
        if(typeof inicializarModuloContratos === 'function') await inicializarModuloContratos();

        // Configurar listeners específicos (definidos em veterinario.js ou outros arquivos)
        if(typeof configurarFiltros === 'function') configurarFiltros();
        if(typeof configurarFormularios === 'function') configurarFormularios();
        if(typeof configurarListenersDeBotoes === 'function') configurarListenersDeBotoes();
        if(typeof configurarListenersDeTabelas === 'function') configurarListenersDeTabelas();

    } catch (error) {
        console.error("Erro ao inicializar módulos:", error);
        mostrarNotificacao("Aviso", "Alguns módulos não foram carregados corretamente. Verifique o console.");
    }
}


// NAVEGAÇÃO E PERMISSÕES
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Permite clicar mesmo se o pai estiver oculto (embora agora vamos mostrar tudo)
            if (link.parentElement.style.display === 'none') {
                // return; // Removido para permitir navegação forçada se necessário
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            
            const targetSection = this.getAttribute('data-section');
            const sectionEl = document.getElementById(targetSection + '-section');
            if (sectionEl) {
                sectionEl.classList.add('active');
            } else {
                console.warn(`Seção não encontrada: ${targetSection}-section`);
            }
        });
    });
}

function aplicarPermissoes(perfil, nome) {
    console.log(`Aplicando permissões (MODO DESENVOLVEDOR - TUDO LIBERADO) para: ${nome} (${perfil})`);

    // Atualiza o nome do usuário no cabeçalho
    const nomeHeader = document.getElementById('nome-usuario-header');
    if (nomeHeader) {
        nomeHeader.textContent = nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : 'Usuário';
    }

    // Define o nome do Vet no formulário de ocorrência (se for o vet)
    if (perfil === 'veterinario') {
        if (typeof carregarDadosVeterinario === 'function') {
            carregarDadosVeterinario();
            if(typeof atualizarNomeVeterinarioInterface === 'function') atualizarNomeVeterinarioInterface();
        }
    }

    // --- LÓGICA DE PERMISSÃO DESATIVADA PARA TESTES ---
    
    // 1. Força a exibição de TODOS os links do menu lateral
    const linksMenu = document.querySelectorAll('.sidebar .nav-menu li');
    linksMenu.forEach(li => {
        li.style.display = 'block'; // Mostra tudo
    });

    // 2. Garante que as seções não tenham display: none inline
    const secoes = document.querySelectorAll('.section');
    secoes.forEach(section => {
        section.style.display = ''; // Limpa estilos inline que ocultariam a seção
    });

    // 3. Ativa a primeira aba/seção automaticamente
    const primeiroLink = document.querySelector('.sidebar .nav-menu li .nav-link');

    if (primeiroLink) {
        // Reseta ativos
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // Ativa o primeiro
        primeiroLink.classList.add('active');
        const targetSection = primeiroLink.dataset.section;
        const sectionEl = document.getElementById(targetSection + '-section');
        if (sectionEl) sectionEl.classList.add('active');
    }
}


// FUNÇÕES DE MODAIS GLOBAIS
function fecharTodosModais() {
    // Verifica se as funções existem antes de chamar para evitar erros de "undefined"
    if (typeof fecharModalGenetica === 'function') fecharModalGenetica();
    if (typeof fecharModalLote === 'function') fecharModalLote();
    if (typeof fecharModalOcorrencia === 'function') fecharModalOcorrencia();
    if (typeof fecharModalBercario === 'function') fecharModalBercario();
    if (typeof fecharModalMaternidade === 'function') fecharModalMaternidade();
    if (typeof fecharModalInseminacao === 'function') fecharModalInseminacao();
    if (typeof fecharModalUsuario === 'function') fecharModalUsuario();
    if (typeof fecharModalFinanceiro === 'function') fecharModalFinanceiro();
    if (typeof fecharModalTarefa === 'function') fecharModalTarefa();
    
    // Contratos
    if (typeof fecharModalContrato === 'function') fecharModalContrato();

    fecharModalConfirmacao();
    fecharModalNotificacao();
}

function fecharModalConfirmacao() {
    acaoParaConfirmar = { callback: null };
    if (modalConfirmacao) modalConfirmacao.classList.add('hidden');
    // Caso esteja usando display block/none em vez de classe hidden:
    if (modalConfirmacao) modalConfirmacao.style.display = 'none';
}

function fecharModalNotificacao() {
    if (modalNotificacao) modalNotificacao.classList.add('hidden');
    if (modalNotificacao) modalNotificacao.style.display = 'none';
}

function mostrarNotificacao(titulo, mensagem) {
    if (!notificacaoTitulo || !notificacaoMensagem || !modalNotificacao) {
        console.warn("Elementos do modal de notificação não encontrados. Fallback para alert.");
        alert(`${titulo}: ${mensagem}`);
        return;
    }
    notificacaoTitulo.textContent = titulo;
    notificacaoMensagem.textContent = mensagem;
    
    modalNotificacao.classList.remove('hidden');
    modalNotificacao.style.display = 'block'; // Garante display
}

function mostrarConfirmacao(tipo, id, nome, callback) {
    if (!modalConfirmacao || !confirmacaoMensagem) {
        console.warn("Elementos do modal de confirmação não encontrados. Fallback para confirm.");
        if (confirm(`Tem certeza que deseja excluir ${tipo} "${nome || id}"?`)) {
            callback();
        }
        return;
    }
    acaoParaConfirmar = { callback };
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir ${tipo} "${nome || id}"? Esta ação não pode ser desfeita.`;
    
    modalConfirmacao.classList.remove('hidden');
    modalConfirmacao.style.display = 'block'; // Garante display
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
    // Tenta tratar formato YYYY-MM-DD direto
    if (typeof dataString === 'string' && dataString.includes('-')) {
        const partes = dataString.split('T')[0].split('-');
        if (partes.length === 3) {
            const [ano, mes, dia] = partes;
            return `${dia}/${mes}/${ano}`;
        }
    }
    
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return '—';
        return data.toLocaleDateString('pt-BR');
    } catch (e) {
        return dataString;
    }
}

function formatarMoeda(valor) {
    // Converte string numérica para float se necessário
    let val = parseFloat(valor);
    if (isNaN(val)) return 'R$ 0,00';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}