// Arquivo: js/modulos/veterinario.js
// Módulo principal que gerencia as seções do Veterinário e Produção
// VERSÃO FINAL (Mapeamentos idgen, idl e Ocorrências corrigidos)

"use strict";

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
        
        if (!json.dados || json.dados.length === 0) return [];

        return json.dados.map(g => ({
            // CORREÇÃO: Mapeia 'idgen' (do banco) para 'id' (do front)
            id: parseInt(g.idgen || g.id || 0), 
            nome: g.nome,
            descricao: g.descricao,
            caracteristicas: g.caracteristicas,
            status: g.status
        }));
    } catch (e) {
        console.error("Erro ao buscar genéticas:", e);
        return [];
    }
}

async function saveGenetica(dados) {
    const response = await fetch(`${API_URL}/geneticas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    const json = await response.json();
    
    if (!json.sucesso) {
        if (json.erro && json.erro.includes('duplicate key')) {
            throw new Error(`A genética "${dados.nome}" já existe.`);
        }
        throw new Error(json.erro || "Erro desconhecido ao salvar genética.");
    }
    return json;
}

async function deleteGenetica(id) {
    const response = await fetch(`${API_URL}/geneticas/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir.");
    return json;
}

// --- LOTES ---
async function fetchLotes() {
    try {
        const response = await fetch(`${API_URL}/lotes`);
        const json = await response.json();
        
        if (!json.dados || json.dados.length === 0) return [];

        return json.dados.map(l => ({
            // CORREÇÃO: Mapeia 'idl' (do banco) para 'id' (do front)
            id: parseInt(l.idl || l.id || 0),
            nome: l.nome,
            geneticaId: parseInt(l.genetica), 
            // Se o banco não retornar o nome da genética, o renderizador fará o cruzamento.
            geneticaNome: l.geneticanome || l.genetica, 
            quantidadeAnimais: parseInt(l.quantidade || 0),
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
    
    const body = {
        nome: dados.nome,
        genetica: dados.geneticaId,
        quantidade: dados.quantidadeAnimais,
        dataCriacao: dados.dataCriacao,
        status: dados.status
    };

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const json = await response.json();
    
    if (!json.sucesso) {
        if (json.erro && json.erro.includes('foreign key constraint')) {
            throw new Error("Erro: A genética selecionada é inválida ou não existe.");
        }
        throw new Error(json.erro || "Erro ao salvar lote.");
    }
    return json;
}

async function deleteLote(id) {
    const response = await fetch(`${API_URL}/lotes/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir lote.");
    return json;
}

// --- OCORRÊNCIAS ---
async function fetchOcorrencias() {
    try {
        const response = await fetch(`${API_URL}/ocorrencias`);
        const json = await response.json();

        if (!json.dados || json.dados.length === 0) return [];

        return json.dados.map(o => {
            // Tratamento de Data e Hora (separados no banco, juntos no front)
            let dataHoraFormatada = '';
            if (o.data) {
                const dataParte = o.data.split('T')[0]; // YYYY-MM-DD
                const horaParte = o.hora || '00:00';
                dataHoraFormatada = `${dataParte}T${horaParte}`;
            }

            return {
                // Mapeamento baseado no retorno do banco (id, lote, tipo...)
                id: parseInt(o.id || 0),
                loteId: null, // O banco retorna o nome no campo 'lote'
                loteNome: o.lote || 'Desconhecido',
                tipo: o.tipo,
                prioridade: o.prioridade,
                dataHora: dataHoraFormatada,
                titulo: o.titulo,
                status: o.status,
                veterinarioResponsavel: o.responsavel,

                // Campos que o banco NÃO está retornando (fallback para vazio)
                descricao: o.descricao || '',
                animaisAfetados: parseInt(o.quantidadeanimaisafetados || 0),
                medicamentoAplicado: o.medicamentoaplicado || '',
                dosagem: o.dosagem || '',
                proximasAcoes: o.proximasacoes || ''
            };
        });
    } catch (e) {
        console.error("Erro ocorrencias:", e);
        return [];
    }
}

async function saveOcorrencia(dados) {
    const body = {
        id: dados.id,
        lote: dados.loteNome,
        loteNome: dados.loteNome,
        tipo: dados.tipo,
        prioridade: dados.prioridade,
        data: dados.dataHora,
        hora: dados.dataHora ? dados.dataHora.split('T')[1] : '00:00',
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
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao salvar ocorrência.");
    return json;
}

async function deleteOcorrencia(id) {
    const response = await fetch(`${API_URL}/ocorrencias/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir.");
    return json;
}

// --- BERÇÁRIO ---
async function fetchBercarios() {
    try {
        const response = await fetch(`${API_URL}/bercario`);
        const json = await response.json();
        return (json.dados || []).map(b => ({
            id: parseInt(b.idbercario || b.id || 0),
            loteId: null, 
            loteNome: b.lotenome,
            quantidadeLeitoes: parseInt(b.quantidadeleitoes || b.qtdeleitoes || 0),
            dataNascimento: b.datanascimento ? b.datanascimento.split('T')[0] : '',
            pesoMedio: parseFloat(b.pesomedio || 0),
            dataDesmame: b.datadesmame ? b.datadesmame.split('T')[0] : null,
            status: b.status
        }));
    } catch (e) { return []; }
}

async function saveBercario(dados) {
    const body = {
        id: dados.id,
        loteNome: dados.loteNome,
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
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao salvar berçário.");
    return json;
}

async function deleteBercario(id) {
    const response = await fetch(`${API_URL}/bercario/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir.");
    return json;
}

// --- MATERNIDADE ---
async function fetchMaternidades() {
    try {
        const response = await fetch(`${API_URL}/maternidades`);
        const json = await response.json();
        return (json.dados || []).map(m => ({
            id: parseInt(m.idmaternidade || m.id || 0),
            brincoPorca: m.brincofemea || m.brincoPorca,
            geneticaId: parseInt(m.genetica), 
            geneticaNome: m.geneticanome || m.genetica,
            dataCobertura: m.datacobertura ? m.datacobertura.split('T')[0] : '',
            dataPartoPrevisao: m.datapartoprevisto ? m.datapartoprevisto.split('T')[0] : '',
            quantidadeLeitoes: parseInt(m.qtdeleitoes || m.quantidadeleitoes || 0),
            status: m.status
        }));
    } catch (e) { return []; }
}

async function saveMaternidade(dados) {
    const body = {
        id: dados.id,
        brincoFemea: dados.brincoPorca,
        genetica: dados.geneticaId,
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
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao salvar maternidade.");
    return json;
}

async function deleteMaternidade(id) {
    const response = await fetch(`${API_URL}/maternidades/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir.");
    return json;
}

// --- INSEMINAÇÃO ---
async function fetchInseminacoes() {
    try {
        const response = await fetch(`${API_URL}/inseminacoes`);
        const json = await response.json();
        return (json.dados || []).map(i => ({
            id: parseInt(i.idinseminacao || i.id || 0),
            brincoFemea: i.brincofemea,
            geneticaMachoId: parseInt(i.geneticamacho),
            geneticaMachoNome: i.geneticamachonome || i.geneticamacho,
            dataInseminacao: i.datainseminacao ? i.datainseminacao.split('T')[0] : '',
            tecnica: i.tecnica,
            resultado: i.resultado,
            dataVerificacao: i.dataverificacao ? i.dataverificacao.split('T')[0] : null
        }));
    } catch (e) { return []; }
}

async function saveInseminacao(dados) {
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
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao salvar inseminação.");
    return json;
}

async function deleteInseminacao(id) {
    const response = await fetch(`${API_URL}/inseminacoes/${id}`, { method: 'DELETE' });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || "Erro ao excluir.");
    return json;
}


// =================================================================
// === FUNÇÕES DE INICIALIZAÇÃO E UI ===
// =================================================================

function carregarDadosVeterinario() {
    const nome = localStorage.getItem('nomeUsuario') || 'Veterinário';
    const header = document.getElementById('nome-veterinario-header');
    if (header) header.textContent = nome;
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

    const geneticas = await fetchGeneticas();

    data.forEach(lote => {
        let nomeGen = lote.geneticaNome;
        if(!nomeGen && lote.geneticaId) {
            // Com idgen mapeado para id, o find funcionará
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
    const geneticas = await fetchGeneticas(); 

    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro encontrado.</td></tr>';
        return;
    }

    data.forEach(maternidade => {
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
// === MODAIS e LISTENERS (UI) ===
// =================================================================

// --- Genética ---
function abrirModalGenetica() {
    geneticaEditando = null;
    document.getElementById('titulo-modal-genetica').textContent = 'Nova Genética';
    document.getElementById('form-genetica').reset();
    document.getElementById('modal-genetica').style.display = 'block';
}
async function editarGenetica(id) {
    if (!id || isNaN(id)) return;

    const geneticas = await fetchGeneticas();
    geneticaEditando = geneticas.find(g => g.id == id);
    
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
    const geneticas = await fetchGeneticas();
    const item = geneticas.find(g => g.id == id); 
    const nome = item ? item.nome : 'Item';

    const onConfirm = async () => {
        try {
            await deleteGenetica(id);
            await carregarGeneticas(); 
            await atualizarRelatorios();
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Excluído!', 'Genética excluída com sucesso.');
        } catch (e) {
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', e.message || 'Não foi possível excluir.');
        }
    };
    if (typeof mostrarConfirmacao === 'function') {
        mostrarConfirmacao('genética', id, nome, onConfirm);
    } else {
        if(confirm(`Excluir genética ${nome}?`)) onConfirm();
    }
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
    loteEditando = lotes.find(l => l.id == id);
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
            mostrarNotificacao('Erro', e.message);
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
    
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('data-hora-ocorrencia').value = now.toISOString().slice(0,16);

    const nomeVet = localStorage.getItem('nomeUsuario');
    if (nomeVet) document.getElementById('veterinario-responsavel').value = nomeVet;
    
    document.getElementById('modal-ocorrencia').style.display = 'block';
}
async function editarOcorrencia(id) {
    const ocorrencias = await fetchOcorrencias();
    ocorrenciaEditando = ocorrencias.find(o => o.id == id);
    if (ocorrenciaEditando) {
        document.getElementById('titulo-modal-ocorrencia').textContent = 'Editar Ocorrência';
        
        const lotes = await fetchLotes();
        const loteObj = lotes.find(l => l.nome === ocorrenciaEditando.loteNome);
        if (loteObj) document.getElementById('lote-ocorrencia').value = loteObj.id;

        document.getElementById('tipo-ocorrencia').value = ocorrenciaEditando.tipo;
        document.getElementById('prioridade-ocorrencia').value = ocorrenciaEditando.prioridade;
        
        if (ocorrenciaEditando.dataHora) {
             document.getElementById('data-hora-ocorrencia').value = ocorrenciaEditando.dataHora.slice(0,16);
        }

        document.getElementById('titulo-ocorrencia').value = ocorrenciaEditando.titulo;
        // Preenchendo com vazio caso venha do backend como vazio
        document.getElementById('descricao-ocorrencia').value = ocorrenciaEditando.descricao || '';
        document.getElementById('animais-afetados').value = ocorrenciaEditando.animaisAfetados || 0;
        document.getElementById('medicamento-aplicado').value = ocorrenciaEditando.medicamentoAplicado || '';
        document.getElementById('dosagem').value = ocorrenciaEditando.dosagem || '';
        document.getElementById('veterinario-responsavel').value = ocorrenciaEditando.veterinarioResponsavel;
        document.getElementById('proximas-acoes').value = ocorrenciaEditando.proximasAcoes || '';
        document.getElementById('status-ocorrencia').value = ocorrenciaEditando.status;
        document.getElementById('modal-ocorrencia').style.display = 'block';
    }
}
async function visualizarOcorrencia(id) {
    const ocorrencias = await fetchOcorrencias();
    const ocorrencia = ocorrencias.find(o => o.id == id);
    if (ocorrencia) {
        alert(`🔍 ID #${ocorrencia.id}\n${ocorrencia.titulo}\n\n${ocorrencia.descricao}`);
    }
}
async function excluirOcorrencia(id) { 
    const onConfirm = async () => {
        try {
            await deleteOcorrencia(id);
            await carregarOcorrencias(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Ocorrência excluída.');
        } catch(e) {
            mostrarNotificacao('Erro', e.message);
        }
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
    bercarioEditando = bercarios.find(b => b.id == id);
    if (bercarioEditando) {
        document.getElementById('titulo-modal-bercario').textContent = 'Editar Registro';
        
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
        try {
            await deleteBercario(id);
            await carregarBercarios(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Registro excluído.');
        } catch(e) {
            mostrarNotificacao('Erro', e.message);
        }
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
    maternidadeEditando = maternidades.find(m => m.id == id);
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
        try {
            await deleteMaternidade(id);
            await carregarMaternidades(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Registro excluído.');
        } catch(e) {
            mostrarNotificacao('Erro', e.message);
        }
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
    inseminacaoEditando = inseminacoes.find(i => i.id == id);
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
        try {
            await deleteInseminacao(id);
            await carregarInseminacoes(); 
            await atualizarRelatorios();
            mostrarNotificacao('Excluído!', 'Registro excluído.');
        } catch(e) {
            mostrarNotificacao('Erro', e.message);
        }
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
    const optionsHtml = data.map(g => `<option value="${g.id}">${g.nome}</option>`).join('');
    
    selects.forEach((select) => {
        if (!select) return;
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
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Sucesso', 'Genética salva.');
        } catch(err) { 
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', err.message); 
        }
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
        } catch(err) { 
            const msg = err.message || 'Falha ao salvar lote';
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', msg);
        }
    });

    // OCORRÊNCIAS
    const formOcorrencia = document.getElementById('form-ocorrencia');
    if(formOcorrencia) formOcorrencia.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
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
        } catch(err) { 
            const msg = err.message || 'Falha ao salvar ocorrência';
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', msg);
        }
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
        } catch(err) { 
            const msg = err.message || 'Falha ao salvar berçário';
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', msg);
        }
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
        } catch(err) { 
            const msg = err.message || 'Falha ao salvar maternidade';
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', msg);
        }
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
        } catch(err) { 
            const msg = err.message || 'Falha ao salvar inseminação';
            if(typeof mostrarNotificacao === 'function') mostrarNotificacao('Erro', msg);
        }
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