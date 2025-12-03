// Arquivo: js/modulos/veterinario.js
// Módulo principal que gerencia as seções do Veterinário e Produção
// VERSÃO 3.0 (Integrado com API Real e Mapeamento de Dados)

"use strict";

// CONFIGURAÇÃO DA API
// Ajustado para uso relativo (mesmo domínio do servidor web)
const API_URL = '';

// === VARIÁVEIS DE ESTADO DO MÓDULO ===
let geneticaEditando = null;
let loteEditando = null;
let bercarioEditando = null;
let maternidadeEditando = null;
let inseminacaoEditando = null;
let ocorrenciaEditando = null;

// =================================================================
// === API REAL (FETCH + MAPEAMENTO) ===
// =================================================================

// --- GENÉTICAS ---
async function fetchGeneticas() {
    try {
        const response = await fetch(`${API_URL}/geneticas`);
        const json = await response.json();
        // Backend retorna: { id, nome, descricao, caracteristicas, status }
        // Front espera: mesmo formato.
        return json.dados || [];
    } catch (e) {
        console.error("Erro ao buscar genéticas:", e);
        return [];
    }
}

async function saveGenetica(dados) {
    // Server usa POST único com verificação de ID interno
    const response = await fetch(`${API_URL}/geneticas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados) // { id (se edição), nome, descricao... }
    });
    return await response.json();
}

async function deleteGenetica(id) {
    const response = await fetch(`${API_URL}/geneticas/${id}`, { method: 'DELETE' });
    return await response.json();
}

// --- LOTES ---
async function fetchLotes() {
    try {
        const response = await fetch(`${API_URL}/lotes`);
        const json = await response.json();
        // Mapeamento: Backend (snake/lower) -> Frontend (camelCase)
        return (json.dados || []).map(l => ({
            id: l.id,
            nome: l.nome,
            geneticaId: l.genetica, // O banco retorna o ID ou Nome dependendo da query, ajustaremos no select
            geneticaNome: l.geneticanome || l.genetica, // Tenta pegar nome se vier join
            quantidadeAnimais: parseInt(l.quantidade),
            dataCriacao: l.datacriacao ? l.datacriacao.split('T')[0] : '',
            status: l.status
        }));
    } catch (e) {
        console.error("Erro lotes:", e);
        return [];
    }
}

async function saveLote(dados) {
    const method = dados.id ? 'PUT' : 'POST';
    const url = dados.id ? `${API_URL}/lotes/${dados.id}` : `${API_URL}/lotes`;
    
    // Server espera: { nome, genetica (ID), quantidade, dataCriacao, status }
    const body = {
        nome: dados.nome,
        genetica: dados.geneticaId, // Enviamos o ID da genética
        quantidade: dados.quantidadeAnimais,
        dataCriacao: dados.dataCriacao,
        status: dados.status
    };

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function deleteLote(id) {
    const response = await fetch(`${API_URL}/lotes/${id}`, { method: 'DELETE' });
    return await response.json();
}

// --- OCORRÊNCIAS ---
async function fetchOcorrencias() {
    try {
        const response = await fetch(`${API_URL}/ocorrencias`);
        const json = await response.json();
        // Mapeamento
        return (json.dados || []).map(o => ({
            id: o.id,
            loteId: o.loteid || null, // Se vier do banco
            loteNome: o.lote || o.lotenome,
            tipo: o.tipo,
            prioridade: o.prioridade,
            dataHora: o.data || o.datahora, // Banco pode retornar 'data' ou 'datahora'
            titulo: o.titulo,
            descricao: o.descricao,
            animaisAfetados: o.quantidadeanimaisafetados || o.animaisafetados,
            medicamentoAplicado: o.medicamentoaplicado,
            dosagem: o.dosagem,
            veterinarioResponsavel: o.responsavel || o.veterinarioresponsavel,
            proximasAcoes: o.proximasacoes,
            status: o.status
        }));
    } catch (e) {
        console.error("Erro ocorrencias:", e);
        return [];
    }
}

async function saveOcorrencia(dados) {
    // Server usa POST único. Espera chaves específicas.
    // { id, lote (nome/id?), tipo... }
    
    const body = {
        id: dados.id, // Se tiver ID, é edição
        lote: dados.loteNome, // Enviando NOME conforme backend parece esperar na procedure
        loteNome: dados.loteNome, // Redundância para garantir
        tipo: dados.tipo,
        prioridade: dados.prioridade,
        data: dados.dataHora,
        hora: dados.dataHora ? dados.dataHora.split('T')[1] : '00:00', // Se backend pedir hora separada
        titulo: dados.titulo,
        descricao: dados.descricao,
        quantidadeAnimaisAfetados: dados.animaisAfetados,
        medicamentoAplicado: dados.medicamentoAplicado,
        dosagem: dados.dosagem,
        responsavel: dados.veterinarioResponsavel,
        proximasAcoes: dados.proximasAcoes,
        status: dados.status
    };

    const response = await fetch(`${API_URL}/ocorrencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function deleteOcorrencia(id) {
    const response = await fetch(`${API_URL}/ocorrencias/${id}`, { method: 'DELETE' });
    return await response.json();
}

// --- BERÇÁRIO ---
async function fetchBercarios() {
    try {
        const response = await fetch(`${API_URL}/bercario`);
        const json = await response.json();
        return (json.dados || []).map(b => ({
            id: b.id,
            loteId: null, 
            loteNome: b.lotenome,
            quantidadeLeitoes: b.quantidadeleitoes,
            dataNascimento: b.datanascimento ? b.datanascimento.split('T')[0] : '',
            pesoMedio: b.pesomedio,
            dataDesmame: b.datadesmame ? b.datadesmame.split('T')[0] : null,
            status: b.status
        }));
    } catch (e) { return []; }
}

async function saveBercario(dados) {
    // Server espera POST. Body: { id, loteNome, quantidadeLeitoes... }
    const body = {
        id: dados.id,
        loteNome: dados.loteNome, // Backend pede Nome
        quantidadeLeitoes: dados.quantidadeLeitoes,
        dataNascimento: dados.dataNascimento,
        pesoMedio: dados.pesoMedio,
        dataDesmame: dados.dataDesmame,
        status: dados.status
    };
    
    const response = await fetch(`${API_URL}/bercario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function deleteBercario(id) {
    const response = await fetch(`${API_URL}/bercario/${id}`, { method: 'DELETE' });
    return await response.json();
}

// --- MATERNIDADE ---
async function fetchMaternidades() {
    try {
        const response = await fetch(`${API_URL}/maternidades`);
        const json = await response.json();
        return (json.dados || []).map(m => ({
            id: m.id,
            brincoPorca: m.brincofemea || m.brincoPorca,
            geneticaId: m.genetica, // ID
            geneticaNome: m.geneticanome || m.genetica, // Nome se vier do join
            dataCobertura: m.datacobertura ? m.datacobertura.split('T')[0] : '',
            dataPartoPrevisao: m.datapartoprevisto ? m.datapartoprevisto.split('T')[0] : '',
            quantidadeLeitoes: m.qtdeleitoes,
            status: m.status
        }));
    } catch (e) { return []; }
}

async function saveMaternidade(dados) {
    // Server espera POST. Body: { id, brincoFemea, genetica (ID)... }
    const body = {
        id: dados.id,
        brincoFemea: dados.brincoPorca,
        genetica: dados.geneticaId, // ID
        dataCobertura: dados.dataCobertura,
        dataPartoPrevisto: dados.dataPartoPrevisao,
        qtdeLeitoes: dados.quantidadeLeitoes,
        status: dados.status
    };

    const response = await fetch(`${API_URL}/maternidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function deleteMaternidade(id) {
    const response = await fetch(`${API_URL}/maternidades/${id}`, { method: 'DELETE' });
    return await response.json();
}

// --- INSEMINAÇÃO ---
async function fetchInseminacoes() {
    try {
        const response = await fetch(`${API_URL}/inseminacoes`);
        const json = await response.json();
        return (json.dados || []).map(i => ({
            id: i.id,
            brincoFemea: i.brincofemea,
            geneticaMachoId: i.geneticamacho,
            geneticaMachoNome: i.geneticamachonome || i.geneticamacho,
            dataInseminacao: i.datainseminacao ? i.datainseminacao.split('T')[0] : '',
            tecnica: i.tecnica,
            resultado: i.resultado,
            dataVerificacao: i.dataverificacao ? i.dataverificacao.split('T')[0] : null
        }));
    } catch (e) { return []; }
}

async function saveInseminacao(dados) {
    // Server espera POST.
    const body = {
        id: dados.id,
        brincoFemea: dados.brincoFemea,
        geneticaMacho: dados.geneticaMachoId,
        dataInseminacao: dados.dataInseminacao,
        tecnica: dados.tecnica,
        resultado: dados.resultado,
        dataVerificacao: dados.dataVerificacao
    };

    const response = await fetch(`${API_URL}/inseminacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function deleteInseminacao(id) {
    const response = await fetch(`${API_URL}/inseminacoes/${id}`, { method: 'DELETE' });
    return await response.json();
}


// =================================================================
// === FUNÇÕES DE INICIALIZAÇÃO E UI (Mantidas e adaptadas) ===
// =================================================================

function carregarDadosVeterinario() {
    // Pega do localStorage, que foi setado no login
    const nome = localStorage.getItem('nomeUsuario') || 'Veterinário';
    // veterinarioLogado agora é apenas visual
    document.getElementById('nome-veterinario-header').textContent = nome;
}

async function atualizarNomeVeterinarioInterface() {
    const nomeVeterinario = localStorage.getItem('nomeUsuario');
    const campoVeterinario = document.getElementById('veterinario-responsavel');
    if (campoVeterinario && nomeVeterinario) campoVeterinario.value = nomeVeterinario;
}

// === FUNÇÕES DE RENDERIZAÇÃO (Grid / Tabela) ===

async function carregarGeneticas() {
    const tbody = document.getElementById('tabela-geneticas');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>';
    
    const data = await fetchGeneticas();
    tbody.innerHTML = '';
    
    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma genética encontrada.</td></tr>';
        return;
    }
    
    data.forEach(genetica => {
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
    atualizarSelectGeneticas(data); 
}

async function carregarLotes() {
    const tbody = document.getElementById('tabela-lotes');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Carregando...</td></tr>';

    const data = await fetchLotes();
    tbody.innerHTML = '';
    
    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum lote encontrado.</td></tr>';
        return;
    }

    // Para exibir o nome da genética, precisamos cruzar os dados ou confiar no view
    // Se o backend mandar apenas ID, buscamos as genéticas para mapear o nome
    const geneticas = await fetchGeneticas();

    data.forEach(lote => {
        // Tenta achar o nome da genética se o backend retornou ID
        let nomeGen = lote.geneticaNome;
        if(!nomeGen && lote.geneticaId) {
            const g = geneticas.find(x => x.id == lote.geneticaId);
            nomeGen = g ? g.nome : 'ID: ' + lote.geneticaId;
        }

        const row = document.createElement('tr');
        const dataFormatada = formatarData(lote.dataCriacao); 
        row.innerHTML = `
            <td>${lote.id}</td>
            <td>${lote.nome}</td>
            <td>${nomeGen || '-'}</td>
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

async function carregarOcorrencias() {
    const tbody = document.getElementById('tabela-ocorrencias');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Carregando...</td></tr>';

    const data = await fetchOcorrencias();
    // Ordenação no front
    data.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Nenhuma ocorrência encontrada.</td></tr>';
        return;
    }

    data.forEach(ocorrencia => {
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
    
    const lotes = await fetchLotes();
    atualizarSelectLotesOcorrencias(lotes);
    atualizarResumoOcorrencias(data);
}

async function carregarBercarios() {
    const tbody = document.getElementById('tabela-bercario');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Carregando...</td></tr>';

    const data = await fetchBercarios();
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro de berçário encontrado.</td></tr>';
        return;
    }

    data.forEach(bercario => {
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
    
    const lotes = await fetchLotes();
    atualizarSelectLotes(lotes);
}

async function carregarMaternidades() {
    const tbody = document.getElementById('tabela-maternidade');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Carregando...</td></tr>';

    const data = await fetchMaternidades();
    const geneticas = await fetchGeneticas(); // Para mapear nomes

    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    data.forEach(maternidade => {
        // Resolve nome da genética
        let nomeGen = maternidade.geneticaNome;
        if(!nomeGen && maternidade.geneticaId) {
            const g = geneticas.find(x => x.id == maternidade.geneticaId);
            nomeGen = g ? g.nome : '-';
        }

        const row = document.createElement('tr');
        const dataCoberturaFormatada = formatarData(maternidade.dataCobertura);
        const dataPartoFormatada = formatarData(maternidade.dataPartoPrevisao);
        row.innerHTML = `
            <td>${maternidade.id}</td>
            <td>${maternidade.brincoPorca}</td>
            <td>${nomeGen}</td>
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

async function carregarInseminacoes() {
    const tbody = document.getElementById('tabela-inseminacao');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Carregando...</td></tr>';
    
    const data = await fetchInseminacoes();
    const geneticas = await fetchGeneticas();

    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    data.forEach(inseminacao => {
        let nomeGen = inseminacao.geneticaMachoNome;
        if(!nomeGen && inseminacao.geneticaMachoId) {
            const g = geneticas.find(x => x.id == inseminacao.geneticaMachoId);
            nomeGen = g ? g.nome : '-';
        }

        const row = document.createElement('tr');
        const dataInseminacaoFormatada = formatarData(inseminacao.dataInseminacao);
        const dataVerificacaoFormatada = inseminacao.dataVerificacao ? formatarData(inseminacao.dataVerificacao) : '-';
        row.innerHTML = `
            <td>${inseminacao.id}</td>
            <td>${inseminacao.brincoFemea}</td>
            <td>${nomeGen}</td>
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

// =================================================================
// === MODAIS (Lógica de UI + Chamada para API) ===
// =================================================================

// --- Genética ---
function abrirModalGenetica() {
    geneticaEditando = null;
    document.getElementById('titulo-modal-genetica').textContent = 'Nova Genética';
    document.getElementById('form-genetica').reset();
    document.getElementById('modal-genetica').style.display = 'block';
}
async function editarGenetica(id) {
    const geneticas = await fetchGeneticas();
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
async function excluirGenetica(id) {
    // Busca rápida para pegar o nome
    const geneticas = await fetchGeneticas();
    const item = geneticas.find(g => g.id === id); 
    const nome = item ? item.nome : 'Item';

    const onConfirm = async () => {
        try {
            await deleteGenetica(id);
            await carregarGeneticas(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Genética excluída com sucesso.');
        } catch (e) {
            mostrarNotificacao('Erro', 'Não foi possível excluir (verifique se há lotes vinculados).');
        }
    };
    mostrarConfirmacao('genética', id, nome, onConfirm);
}
function fecharModalGenetica() { 
    const modal = document.getElementById('modal-genetica');
    if (modal) modal.style.display = 'none'; 
    geneticaEditando = null; 
}

// --- Lote ---
function abrirModalLote() {
    loteEditando = null;
    document.getElementById('titulo-modal-lote').textContent = 'Novo Lote';
    document.getElementById('form-lote').reset();
    document.getElementById('data-criacao').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-lote').style.display = 'block';
}
async function editarLote(id) {
    const lotes = await fetchLotes();
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
async function excluirLote(id) { 
    const onConfirm = async () => {
        try {
            await deleteLote(id);
            await carregarLotes(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Lote excluído.');
        } catch (e) {
            mostrarNotificacao('Erro', 'Erro ao excluir lote.');
        }
    };
    mostrarConfirmacao('lote', id, 'este lote', onConfirm); 
}
function fecharModalLote() { 
    const modal = document.getElementById('modal-lote');
    if (modal) modal.style.display = 'none'; 
    loteEditando = null; 
}

// --- Ocorrência ---
function abrirModalOcorrencia() {
    ocorrenciaEditando = null;
    document.getElementById('titulo-modal-ocorrencia').textContent = 'Nova Ocorrência';
    document.getElementById('form-ocorrencia').reset();
    
    // Ajuste fuso horário para input datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('data-hora-ocorrencia').value = now.toISOString().slice(0,16);

    const nomeVet = localStorage.getItem('nomeUsuario');
    if (nomeVet) document.getElementById('veterinario-responsavel').value = nomeVet;
    
    document.getElementById('modal-ocorrencia').style.display = 'block';
}
async function editarOcorrencia(id) {
    const ocorrencias = await fetchOcorrencias();
    ocorrenciaEditando = ocorrencias.find(o => o.id === id);
    if (ocorrenciaEditando) {
        document.getElementById('titulo-modal-ocorrencia').textContent = 'Editar Ocorrência';
        
        // Precisamos encontrar o ID do lote baseado no nome, pois o select usa ID
        const lotes = await fetchLotes();
        const loteObj = lotes.find(l => l.nome === ocorrenciaEditando.loteNome);
        if (loteObj) document.getElementById('lote-ocorrencia').value = loteObj.id;

        document.getElementById('tipo-ocorrencia').value = ocorrenciaEditando.tipo;
        document.getElementById('prioridade-ocorrencia').value = ocorrenciaEditando.prioridade;
        
        // Ajuste data para datetime-local
        if (ocorrenciaEditando.dataHora) {
             // O banco traz ISO. O input quer YYYY-MM-DDTHH:mm
             document.getElementById('data-hora-ocorrencia').value = ocorrenciaEditando.dataHora.slice(0,16);
        }

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
async function visualizarOcorrencia(id) {
    // (Mantido igual, mas buscando dados reais)
    const ocorrencias = await fetchOcorrencias();
    const ocorrencia = ocorrencias.find(o => o.id === id);
    if (ocorrencia) {
        alert(`🔍 ID #${ocorrencia.id}\n${ocorrencia.titulo}\n\n${ocorrencia.descricao}`);
    }
}
async function excluirOcorrencia(id) { 
    const onConfirm = async () => {
        await deleteOcorrencia(id);
        await carregarOcorrencias(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', 'Ocorrência excluída.');
    };
    mostrarConfirmacao('ocorrência', id, 'este item', onConfirm);
}
function fecharModalOcorrencia() { 
    const modal = document.getElementById('modal-ocorrencia');
    if (modal) modal.style.display = 'none'; 
    ocorrenciaEditando = null; 
}

// --- Berçário ---
function abrirModalBercario() {
    bercarioEditando = null;
    document.getElementById('titulo-modal-bercario').textContent = 'Novo Registro';
    document.getElementById('form-bercario').reset();
    document.getElementById('data-nascimento').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-bercario').style.display = 'block';
}
async function editarBercario(id) {
    const bercarios = await fetchBercarios();
    bercarioEditando = bercarios.find(b => b.id === id);
    if (bercarioEditando) {
        document.getElementById('titulo-modal-bercario').textContent = 'Editar Registro';
        
        // Mapear nome p/ ID do select
        const lotes = await fetchLotes();
        const loteObj = lotes.find(l => l.nome === bercarioEditando.loteNome);
        if(loteObj) document.getElementById('lote-bercario').value = loteObj.id;

        document.getElementById('quantidade-leitoes').value = bercarioEditando.quantidadeLeitoes;
        document.getElementById('data-nascimento').value = bercarioEditando.dataNascimento;
        document.getElementById('peso-medio').value = bercarioEditando.pesoMedio;
        document.getElementById('status-bercario').value = bercarioEditando.status;
        document.getElementById('data-desmame').value = bercarioEditando.dataDesmame || '';
        document.getElementById('modal-bercario').style.display = 'block';
    }
}
async function excluirBercario(id) { 
    const onConfirm = async () => {
        await deleteBercario(id);
        await carregarBercarios(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', 'Registro excluído.');
    };
    mostrarConfirmacao('registro', id, `ID ${id}`, onConfirm);
}
function fecharModalBercario() { 
    const modal = document.getElementById('modal-bercario');
    if (modal) modal.style.display = 'none'; 
    bercarioEditando = null; 
}

// --- Maternidade ---
function abrirModalMaternidade() {
    maternidadeEditando = null;
    document.getElementById('titulo-modal-maternidade').textContent = 'Nova Porca';
    document.getElementById('form-maternidade').reset();
    document.getElementById('modal-maternidade').style.display = 'block';
    
    // Listener de data (mantido)
    const dtCob = document.getElementById('data-cobertura');
    const dtParto = document.getElementById('data-parto-prevista');
    dtCob.onchange = function() {
        if(this.value) {
            const d = new Date(this.value);
            d.setDate(d.getDate() + 114);
            dtParto.value = d.toISOString().split('T')[0];
        }
    };
}
async function editarMaternidade(id) {
    const maternidades = await fetchMaternidades();
    maternidadeEditando = maternidades.find(m => m.id === id);
    if (maternidadeEditando) {
        document.getElementById('titulo-modal-maternidade').textContent = 'Editar Porca';
        document.getElementById('brinco-porca').value = maternidadeEditando.brincoPorca;
        document.getElementById('genetica-porca').value = maternidadeEditando.geneticaId;
        document.getElementById('data-cobertura').value = maternidadeEditando.dataCobertura;
        document.getElementById('data-parto-prevista').value = maternidadeEditando.dataPartoPrevisao;
        document.getElementById('quantidade-leitoes-nascidos').value = maternidadeEditando.quantidadeLeitoes;
        document.getElementById('status-maternidade').value = maternidadeEditando.status;
        document.getElementById('modal-maternidade').style.display = 'block';
    }
}
async function excluirMaternidade(id) { 
    const onConfirm = async () => {
        await deleteMaternidade(id);
        await carregarMaternidades(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', 'Registro excluído.');
    };
    mostrarConfirmacao('maternidade', id, 'este item', onConfirm);
}
function fecharModalMaternidade() { 
    const modal = document.getElementById('modal-maternidade');
    if (modal) modal.style.display = 'none'; 
    maternidadeEditando = null; 
}

// --- Inseminação ---
function abrirModalInseminacao() {
    inseminacaoEditando = null;
    document.getElementById('titulo-modal-inseminacao').textContent = 'Nova Inseminação';
    document.getElementById('form-inseminacao').reset();
    document.getElementById('data-inseminacao').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-inseminacao').style.display = 'block';
}
async function editarInseminacao(id) {
    const inseminacoes = await fetchInseminacoes();
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
async function excluirInseminacao(id) { 
    const onConfirm = async () => {
        await deleteInseminacao(id);
        await carregarInseminacoes(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', 'Registro excluído.');
    };
    mostrarConfirmacao('inseminação', id, 'este item', onConfirm);
}
function fecharModalInseminacao() { 
    const modal = document.getElementById('modal-inseminacao');
    if (modal) modal.style.display = 'none'; 
    inseminacaoEditando = null; 
}


// =================================================================
// === ATUALIZADORES DE UI AUXILIARES ===
// =================================================================

function atualizarSelectGeneticas(data) { 
    const selects = [ 
        document.getElementById('genetica-lote'), 
        document.getElementById('filtro-lote-genetica'), 
        document.getElementById('genetica-porca'), 
        document.getElementById('genetica-macho'), 
        document.getElementById('filtro-maternidade-genetica') 
    ];
    // Filtra apenas ativas para novos cadastros? 
    // Por simplicidade, mostramos todas ou filtramos 'ativa'
    const optionsHtml = data.map(g => `<option value="${g.id}">${g.nome}</option>`).join('');
    
    selects.forEach((select) => {
        if (!select) return;
        // Preserva a opção padrão
        const firstOption = select.options[0] ? select.options[0].outerHTML : '<option value="">Selecione</option>';
        select.innerHTML = firstOption + optionsHtml;
    });
}

function atualizarSelectLotes(data) { 
    const selects = [ document.getElementById('lote-bercario'), document.getElementById('filtro-bercario-lote') ];
    const optionsHtml = data.map(l => `<option value="${l.id}">${l.nome}</option>`).join('');
    selects.forEach((select) => {
        if (!select) return;
        const firstOption = select.options[0] ? select.options[0].outerHTML : '<option value="">Selecione</option>';
        select.innerHTML = firstOption + optionsHtml;
    });
}

function atualizarSelectLotesOcorrencias(data) { 
    const selects = [ document.getElementById('lote-ocorrencia'), document.getElementById('filtro-ocorrencia-lote') ];
    const optionsHtml = data.map(lote => `<option value="${lote.id}">${lote.nome} (${lote.status})</option>`).join('');
    selects.forEach((select) => {
        if (!select) return;
        const firstOption = select.options[0] ? select.options[0].outerHTML : '<option value="">Selecione</option>';
        select.innerHTML = firstOption + optionsHtml;
    });
}

async function atualizarResumoOcorrencias(data) { 
    const elCriticas = document.getElementById('ocorrencias-criticas');
    const elPendentes = document.getElementById('ocorrencias-pendentes');
    const elResolvidas = document.getElementById('ocorrencias-resolvidas-hoje');
    
    if(!elCriticas) return;
    if(!data) data = await fetchOcorrencias();

    const ocorrenciasCriticas = data.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length;
    const ocorrenciasPendentes = data.filter(o => o.status === 'pendente' || o.status === 'em-andamento').length;
    // Lógica simples de data
    const hojeStr = new Date().toISOString().split('T')[0];
    const ocorrenciasResolvidasHoje = data.filter(o => o.status === 'resolvida' && o.dataHora.startsWith(hojeStr)).length;
    
    elCriticas.textContent = ocorrenciasCriticas;
    elPendentes.textContent = ocorrenciasPendentes;
    elResolvidas.textContent = ocorrenciasResolvidasHoje;
}

async function atualizarRelatorios() {
    const elGen = document.getElementById('total-geneticas');
    if(!elGen) return;

    try {
        const [geneticas, lotes, bercarios, maternidades, inseminacoes] = await Promise.all([
            fetchGeneticas(), fetchLotes(), fetchBercarios(), fetchMaternidades(), fetchInseminacoes()
        ]);

        document.getElementById('total-geneticas').textContent = geneticas.filter(g => g.status === 'ativa').length;
        document.getElementById('total-lotes').textContent = lotes.filter(l => l.status === 'ativo').length;
        document.getElementById('total-animais').textContent = lotes.reduce((sum, lote) => sum + lote.quantidadeAnimais, 0);
        document.getElementById('lotes-quarentena').textContent = lotes.filter(l => l.status === 'quarentena').length;
        document.getElementById('total-leitoes-bercario').textContent = bercarios.reduce((sum, b) => sum + b.quantidadeLeitoes, 0);
        document.getElementById('total-porcas-gestantes').textContent = maternidades.filter(m => m.status === 'gestante').length;
        document.getElementById('total-porcas-lactantes').textContent = maternidades.filter(m => m.status === 'lactante').length;
        document.getElementById('total-inseminacoes-pendentes').textContent = inseminacoes.filter(i => i.resultado === 'aguardando').length;
    } catch(e) { console.error("Erro KPIs", e); }
}

// =================================================================
// === LISTENERS (Formulários e Botões) ===
// =================================================================

function configuringForms() { /* Compatibilidade nome antigo */ configurarFormularios(); }

function configurarFormularios() {
    // GENÉTICA
    const formGenetica = document.getElementById('form-genetica');
    if(formGenetica) formGenetica.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const dados = {
            id: geneticaEditando ? geneticaEditando.id : null,
            nome: formData.get('nome-genetica'),
            descricao: formData.get('descricao-genetica'),
            caracteristicas: formData.get('caracteristicas-genetica'),
            status: formData.get('status-genetica')
        };
        try {
            await saveGenetica(dados);
            await carregarGeneticas();
            await atualizarRelatorios();
            fecharModalGenetica();
            mostrarNotificacao('Sucesso', 'Genética salva.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar genética'); }
    });

    // LOTE
    const formLote = document.getElementById('form-lote');
    if(formLote) formLote.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const dados = {
            id: loteEditando ? loteEditando.id : null,
            nome: formData.get('nome-lote'),
            geneticaId: parseInt(formData.get('genetica-lote')),
            quantidadeAnimais: parseInt(formData.get('quantidade-animais')),
            dataCriacao: formData.get('data-criacao'),
            status: formData.get('status-lote')
        };
        try {
            await saveLote(dados);
            await carregarLotes();
            await atualizarRelatorios();
            fecharModalLote();
            mostrarNotificacao('Sucesso', 'Lote salvo.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar lote'); }
    });

    // OCORRÊNCIAS
    const formOcorrencia = document.getElementById('form-ocorrencia');
    if(formOcorrencia) formOcorrencia.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Pega o nome do lote para enviar ao backend (que espera nome na procedure antiga)
        const loteSelect = document.getElementById('lote-ocorrencia');
        const loteNome = loteSelect.options[loteSelect.selectedIndex].text.split(' (')[0]; 

        const dados = {
            id: ocorrenciaEditando ? ocorrenciaEditando.id : null,
            loteNome: loteNome,
            tipo: formData.get('tipo-ocorrencia'),
            prioridade: formData.get('prioridade-ocorrencia'),
            dataHora: formData.get('data-hora-ocorrencia'),
            titulo: formData.get('titulo-ocorrencia'),
            descricao: formData.get('descricao-ocorrencia'),
            animaisAfetados: parseInt(formData.get('animais-afetados')),
            medicamentoAplicado: formData.get('medicamento-aplicado'),
            dosagem: formData.get('dosagem'),
            veterinarioResponsavel: formData.get('veterinario-responsavel'),
            proximasAcoes: formData.get('proximas-acoes'),
            status: formData.get('status-ocorrencia')
        };
        
        try {
            await saveOcorrencia(dados);
            await carregarOcorrencias();
            await atualizarRelatorios();
            fecharModalOcorrencia();
            mostrarNotificacao('Sucesso', 'Ocorrência salva.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar ocorrência'); }
    });

    // BERÇÁRIO
    const formBercario = document.getElementById('form-bercario');
    if(formBercario) formBercario.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loteSelect = document.getElementById('lote-bercario');
        const loteNome = loteSelect.options[loteSelect.selectedIndex].text;

        const dados = {
            id: bercarioEditando ? bercarioEditando.id : null,
            loteNome: loteNome,
            quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes')),
            dataNascimento: formData.get('data-nascimento'),
            pesoMedio: parseFloat(formData.get('peso-medio')),
            status: formData.get('status-bercario'),
            dataDesmame: formData.get('data-desmame') || null
        };
        try {
            await saveBercario(dados);
            await carregarBercarios();
            await atualizarRelatorios();
            fecharModalBercario();
            mostrarNotificacao('Sucesso', 'Berçário salvo.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar berçário'); }
    });

    // MATERNIDADE
    const formMaternidade = document.getElementById('form-maternidade');
    if(formMaternidade) formMaternidade.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const dados = {
            id: maternidadeEditando ? maternidadeEditando.id : null,
            brincoPorca: formData.get('brinco-porca'),
            geneticaId: parseInt(formData.get('genetica-porca')),
            dataCobertura: formData.get('data-cobertura'),
            dataPartoPrevisao: formData.get('data-parto-prevista'),
            quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes-nascidos')),
            status: formData.get('status-maternidade')
        };
        try {
            await saveMaternidade(dados);
            await carregarMaternidades();
            await atualizarRelatorios();
            fecharModalMaternidade();
            mostrarNotificacao('Sucesso', 'Maternidade salva.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar maternidade'); }
    });

    // INSEMINAÇÃO
    const formInseminacao = document.getElementById('form-inseminacao');
    if(formInseminacao) formInseminacao.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const dados = {
            id: inseminacaoEditando ? inseminacaoEditando.id : null,
            brincoFemea: formData.get('brinco-femea'),
            geneticaMachoId: parseInt(formData.get('genetica-macho')),
            dataInseminacao: formData.get('data-inseminacao'),
            tecnica: formData.get('tecnica-inseminacao'),
            resultado: formData.get('resultado-inseminacao'),
            dataVerificacao: formData.get('data-verificacao') || null
        };
        try {
            await saveInseminacao(dados);
            await carregarInseminacoes();
            await atualizarRelatorios();
            fecharModalInseminacao();
            mostrarNotificacao('Sucesso', 'Inseminação salva.');
        } catch(err) { mostrarNotificacao('Erro', 'Falha ao salvar inseminação'); }
    });
}

// Configura os botões de abrir modal e fechar
function configurarListenersDeBotoes() {
    // Abrir Modais
    document.getElementById('btn-abrir-modal-genetica')?.addEventListener('click', abrirModalGenetica);
    document.getElementById('btn-abrir-modal-lote')?.addEventListener('click', abrirModalLote);
    document.getElementById('btn-abrir-modal-ocorrencia')?.addEventListener('click', abrirModalOcorrencia);
    document.getElementById('btn-abrir-modal-bercario')?.addEventListener('click', abrirModalBercario);
    document.getElementById('btn-abrir-modal-maternidade')?.addEventListener('click', abrirModalMaternidade);
    document.getElementById('btn-abrir-modal-inseminacao')?.addEventListener('click', abrirModalInseminacao);

    // Fechar Modais (X e Cancelar)
    const mapModais = [
        ['modal-genetica', fecharModalGenetica],
        ['modal-lote', fecharModalLote],
        ['modal-ocorrencia', fecharModalOcorrencia],
        ['modal-bercario', fecharModalBercario],
        ['modal-maternidade', fecharModalMaternidade],
        ['modal-inseminacao', fecharModalInseminacao]
    ];

    mapModais.forEach(([id, func]) => {
        document.getElementById(`btn-x-fechar-${id}`)?.addEventListener('click', func);
        document.getElementById(`btn-cancelar-${id}`)?.addEventListener('click', func);
        const m = document.getElementById(id);
        if(m) m.addEventListener('click', (e) => { if(e.target === m) func(); });
    });
}

function configurarListenersDeTabelas() {
    // Event Delegation
    document.getElementById('tabela-geneticas')?.addEventListener('click', (e) => {
        const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(edit) editarGenetica(parseInt(edit)); if(del) excluirGenetica(parseInt(del));
    });
    document.getElementById('tabela-lotes')?.addEventListener('click', (e) => {
        const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(edit) editarLote(parseInt(edit)); if(del) excluirLote(parseInt(del));
    });
    document.getElementById('tabela-ocorrencias')?.addEventListener('click', (e) => {
        const view = e.target.dataset.viewId; const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(view) visualizarOcorrencia(parseInt(view));
        if(edit) editarOcorrencia(parseInt(edit));
        if(del) excluirOcorrencia(parseInt(del));
    });
    document.getElementById('tabela-bercario')?.addEventListener('click', (e) => {
        const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(edit) editarBercario(parseInt(edit)); if(del) excluirBercario(parseInt(del));
    });
    document.getElementById('tabela-maternidade')?.addEventListener('click', (e) => {
        const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(edit) editarMaternidade(parseInt(edit)); if(del) excluirMaternidade(parseInt(del));
    });
    document.getElementById('tabela-inseminacao')?.addEventListener('click', (e) => {
        const edit = e.target.dataset.editId; const del = e.target.dataset.deleteId;
        if(edit) editarInseminacao(parseInt(edit)); if(del) excluirInseminacao(parseInt(del));
    });
}

// Filtros básicos (Mantidos com lógica visual)
function configurarFiltros() {
    const filtroGenetica = document.getElementById('filtro-genetica');
    if(filtroGenetica) filtroGenetica.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        document.querySelectorAll('#tabela-geneticas tbody tr').forEach(row => { 
            row.style.display = (row.cells[1]?.textContent.toLowerCase() || '').includes(filtro) ? '' : 'none'; 
        });
    });
    // Demais filtros podem ser reativados conforme necessidade
}