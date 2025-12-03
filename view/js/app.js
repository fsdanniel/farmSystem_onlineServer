"use strict";

// CONFIGURAÇÃO GLOBAL DA API
// Como o site é servido pelo próprio Node.js, a base é a raiz relativa.
// Outros arquivos .js podem usar essa variável global.
window.API_URL = ''; 

// VARIÁVEIS GLOBAIS DE CONTROLE
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
            // Limpa sessão local
            localStorage.removeItem('perfilUsuario');
            localStorage.removeItem('nomeUsuario');
            // Redireciona para a raiz (login)
            window.location.href = '/'; 
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
        window.location.href = '/'; // Redireciona para raiz
        return;
    }

    // Funções de inicialização de UI
    inicializarNavegacao();

    // PASSO 2 - APLICAR PERMISSÕES (Modo Liberado para Integração)
    aplicarPermissoes(perfilLogado, nomeUsuario);

    // PASSO 3 - INICIALIZAR MÓDULOS
    // A ordem importa: primeiro dados base, depois dependentes
    try {
        // --- Carregamento de Dados Iniciais (Funções globais de outros arquivos) ---
        // Verificamos se a função existe antes de chamar para evitar erros se o arquivo não carregou
        if(typeof carregarGeneticas === 'function') await carregarGeneticas();
        if(typeof carregarLotes === 'function') await carregarLotes();
        if(typeof carregarOcorrencias === 'function') await carregarOcorrencias();
        if(typeof carregarBercarios === 'function') await carregarBercarios();
        if(typeof carregarMaternidades === 'function') await carregarMaternidades();
        if(typeof carregarInseminacoes === 'function') await carregarInseminacoes();
        
        // --- Dashboard / KPIs ---
        // Agora podemos usar a nova rota otimizada do servidor se disponível
        if(typeof atualizarRelatorios === 'function') {
            await atualizarRelatorios();
        }

        // --- Inicialização dos Módulos Específicos ---
        if(typeof inicializarModuloInsumos === 'function') await inicializarModuloInsumos();
        if(typeof inicializarModuloRegistros === 'function') inicializarModuloRegistros();
        if(typeof inicializarModuloRelatorios === 'function') inicializarModuloRelatorios();
        if(typeof inicializarModuloUsuarios === 'function') await inicializarModuloUsuarios();
        if(typeof inicializarModuloFinanceiro === 'function') await inicializarModuloFinanceiro();
        if(typeof inicializarModuloTarefas === 'function') await inicializarModuloTarefas();
        if(typeof inicializarModuloContratos === 'function') await inicializarModuloContratos();

        // --- Listeners Específicos ---
        if(typeof configurarFiltros === 'function') configurarFiltros();
        if(typeof configurarFormularios === 'function') configurarFormularios();
        if(typeof configurarListenersDeBotoes === 'function') configurarListenersDeBotoes();
        if(typeof configurarListenersDeTabelas === 'function') configurarListenersDeTabelas();

    } catch (error) {
        console.error("Erro ao inicializar módulos:", error);
        mostrarNotificacao("Aviso", "Houve um problema ao carregar alguns dados. Verifique a conexão com o servidor.");
    }
}


// NAVEGAÇÃO E PERMISSÕES
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Lógica de navegação por abas
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
    console.log(`Aplicando permissões (MODO INTEGRAÇÃO - TUDO LIBERADO) para: ${nome} (${perfil})`);

    // Atualiza o nome do usuário no cabeçalho
    const nomeHeader = document.getElementById('nome-usuario-header');
    if (nomeHeader) {
        nomeHeader.textContent = nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : 'Usuário';
    }

    // Se for veterinário, carrega dados específicos se necessário
    if (perfil === 'veterinario') {
        if (typeof carregarDadosVeterinario === 'function') {
            carregarDadosVeterinario();
            if(typeof atualizarNomeVeterinarioInterface === 'function') atualizarNomeVeterinarioInterface();
        }
    }

    // --- MODO LIBERADO: Garante que tudo esteja visível ---
    
    // 1. Menu Lateral
    const linksMenu = document.querySelectorAll('.sidebar .nav-menu li');
    linksMenu.forEach(li => li.style.display = 'block');

    // 2. Seções de Conteúdo
    const secoes = document.querySelectorAll('.section');
    secoes.forEach(section => section.style.display = '');

    // 3. Ativa a primeira aba automaticamente (geralmente Dashboard/Relatórios)
    const primeiroLink = document.querySelector('.sidebar .nav-menu li .nav-link');
    if (primeiroLink) {
        // Reseta estados anteriores
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // Ativa
        primeiroLink.classList.add('active');
        const targetSection = primeiroLink.dataset.section;
        const sectionEl = document.getElementById(targetSection + '-section');
        if (sectionEl) sectionEl.classList.add('active');
    }
}


// FUNÇÕES DE MODAIS GLOBAIS
function fecharTodosModais() {
    // Tenta fechar todos os modais conhecidos, verificando se a função existe
    const funcoesFechar = [
        'fecharModalGenetica', 'fecharModalLote', 'fecharModalOcorrencia',
        'fecharModalBercario', 'fecharModalMaternidade', 'fecharModalInseminacao',
        'fecharModalUsuario', 'fecharModalFinanceiro', 'fecharModalTarefa', 'fecharModalContrato'
    ];

    funcoesFechar.forEach(nomeFunc => {
        if (typeof window[nomeFunc] === 'function') window[nomeFunc]();
    });

    fecharModalConfirmacao();
    fecharModalNotificacao();
}

function fecharModalConfirmacao() {
    acaoParaConfirmar = { callback: null };
    if (modalConfirmacao) {
        modalConfirmacao.classList.add('hidden');
        modalConfirmacao.style.display = 'none'; // Reforço visual
    }
}

function fecharModalNotificacao() {
    if (modalNotificacao) {
        modalNotificacao.classList.add('hidden');
        modalNotificacao.style.display = 'none'; // Reforço visual
    }
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
    modalNotificacao.style.display = 'block'; 
}

function mostrarConfirmacao(tipo, id, nome, callback) {
    if (!modalConfirmacao || !confirmacaoMensagem) {
        if (confirm(`Tem certeza que deseja excluir ${tipo} "${nome || id}"?`)) {
            callback();
        }
        return;
    }
    acaoParaConfirmar = { callback };
    confirmacaoMensagem.textContent = `Tem certeza que deseja excluir ${tipo} "${nome || id}"? Esta ação não pode ser desfeita.`;
    
    modalConfirmacao.classList.remove('hidden');
    modalConfirmacao.style.display = 'block';
}

function handleConfirmarAcao() {
    if (acaoParaConfirmar.callback) {
        acaoParaConfirmar.callback();
    }
    fecharModalConfirmacao();
}

// FUNÇÕES AUXILIARES GLOBAIS DE FORMATAÇÃO
function formatarData(dataString) {
    if (!dataString) return '—';
    // Se já vier no formato BR ou simples, retorna
    if (dataString.includes('/') || dataString.length < 10) return dataString;

    // Tenta tratar formato ISO YYYY-MM-DD
    if (dataString.includes('-')) {
        const datePart = dataString.split('T')[0];
        const [ano, mes, dia] = datePart.split('-');
        if (ano.length === 4) return `${dia}/${mes}/${ano}`;
    }
    
    return dataString;
}

function formatarMoeda(valor) {
    let val = parseFloat(valor);
    if (isNaN(val)) return 'R$ 0,00';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}