// Arquivo: js/modulos/veterinario.js
// Módulo principal que gerencia as 7 seções do Veterinário:
// Genéticas, Lotes, Ocorrências, Berçário, Maternidade, Inseminação e Relatórios (KPIs).
// VERSÃO 2.0 (Refatorado com API Simulada async/await)

"use strict";

// === DADOS MOCADOS (Simulação de BD) ===
// (Movidos do app.js)
let dbGeneticas = [
    { id: 1, nome: "Duroc", descricao: "Raça conhecida pela qualidade da carne", caracteristicas: "Excelente conversão alimentar, carne marmorizada", status: "ativa" },
    { id: 2, nome: "Landrace", descricao: "Raça de alta prolificidade", caracteristicas: "Boa produção de leite, leitegadas grandes", status: "ativa" },
    { id: 3, nome: "Yorkshire", descricao: "Raça versátil e produtiva", caracteristicas: "Boa conformação, alta fertilidade", status: "inativa" }
];
let dbLotes = [
    { id: 1, nome: "Lote A-2024-001", geneticaId: 1, geneticaNome: "Duroc", quantidadeAnimais: 25, dataCriacao: "2024-01-15", status: "ativo" },
    { id: 2, nome: "Lote B-2024-002", geneticaId: 2, geneticaNome: "Landrace", quantidadeAnimais: 30, dataCriacao: "2024-02-10", status: "ativo" },
    { id: 3, nome: "Lote C-2024-003", geneticaId: 1, geneticaNome: "Duroc", quantidadeAnimais: 15, dataCriacao: "2024-03-05", status: "quarentena" }
];
let dbBercarios = [
    { id: 1, loteId: 1, loteNome: "Lote A-2024-001", quantidadeLeitoes: 12, dataNascimento: "2024-09-15", pesoMedio: 8.5, status: "ativo", dataDesmame: null },
    { id: 2, loteId: 2, loteNome: "Lote B-2024-002", quantidadeLeitoes: 15, dataNascimento: "2024-08-20", pesoMedio: 15.2, status: "desmamado", dataDesmame: "2024-10-10" }
];
let dbMaternidades = [
    { id: 1, brincoPorca: "F001", geneticaId: 2, geneticaNome: "Landrace", dataCobertura: "2024-06-15", dataPartoPrevisao: "2024-10-28", quantidadeLeitoes: 0, status: "gestante" },
    { id: 2, brincoPorca: "F002", geneticaId: 1, geneticaNome: "Duroc", dataCobertura: "2024-05-10", dataPartoPrevisao: "2024-09-15", quantidadeLeitoes: 12, status: "lactante" }
];
let dbInseminacoes = [
    { id: 1, brincoFemea: "F003", geneticaMachoId: 1, geneticaMachoNome: "Duroc", dataInseminacao: "2024-10-01", tecnica: "ia-convencional", resultado: "aguardando", dataVerificacao: null },
    { id: 2, brincoFemea: "F004", geneticaMachoId: 2, geneticaMachoNome: "Landrace", dataInseminacao: "2024-09-20", tecnica: "ia-cervical", resultado: "positivo", dataVerificacao: "2024-10-05" }
];
let dbOcorrencias = [
    { id: 1, dataHora: "2024-10-16T08:30", loteId: 3, loteNome: "Lote C-2024-003", tipo: "sanitaria", prioridade: "alta", titulo: "Suspeita de doença respiratória", descricao: "Observados sintomas de tosse e espirros...", animaisAfetados: 3, medicamentoAplicado: "Enrofloxacina", dosagem: "2.5ml por animal", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Monitorar...", status: "em-andamento" },
    { id: 2, dataHora: "2024-10-15T14:15", loteId: 1, loteNome: "Lote A-2024-001", tipo: "vacina", prioridade: "media", titulo: "Aplicação de vacina contra parvovirose", descricao: "Vacinação preventiva...", animaisAfetados: 25, medicamentoAplicado: "Vacina Parvovirose", dosagem: "1ml por animal", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Observar reações...", status: "resolvida" },
    { id: 3, dataHora: "2024-10-16T16:45", loteId: 2, loteNome: "Lote B-2024-002", tipo: "morte", prioridade: "critica", titulo: "Morte de animal - investigação necessária", descricao: "Animal encontrado morto...", animaisAfetados: 1, medicamentoAplicado: "", dosagem: "", veterinarioResponsavel: "Dr. Veterinário", proximasAcoes: "Solicitar necropsia...", status: "pendente" }
];


// === VARIÁVEIS DE ESTADO DO MÓDULO ===
let geneticaEditando = null;
let loteEditando = null;
let bercarioEditando = null;
let maternidadeEditando = null;
let inseminacaoEditando = null;
let ocorrenciaEditando = null;


// === API SIMULADA (async/await) ===

const SIMULATED_DELAY = 200; // Simula 200ms de latência da rede

// --- API Genéticas ---
async function fetchGeneticas() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbGeneticas]), SIMULATED_DELAY);
    });
}
async function saveGenetica(geneticaData) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (geneticaEditando) { // Atualização
                const index = dbGeneticas.findIndex(g => g.id === geneticaEditando.id);
                if (index !== -1) {
                    dbGeneticas[index] = { ...geneticaEditando, ...geneticaData };
                    resolve({ success: true, data: dbGeneticas[index] });
                }
            } else { // Criação
                const novaGenetica = { ...geneticaData, id: Math.max(...dbGeneticas.map(g => g.id), 0) + 1 };
                dbGeneticas.push(novaGenetica);
                resolve({ success: true, data: novaGenetica });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteGenetica(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbGeneticas = dbGeneticas.filter(g => g.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// --- API Lotes ---
async function fetchLotes() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbLotes]), SIMULATED_DELAY);
    });
}
async function saveLote(loteData) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (loteEditando) {
                const index = dbLotes.findIndex(l => l.id === loteEditando.id);
                if (index !== -1) {
                    dbLotes[index] = { ...loteEditando, ...loteData };
                    resolve({ success: true, data: dbLotes[index] });
                }
            } else {
                const novoLote = { ...loteData, id: Math.max(...dbLotes.map(l => l.id), 0) + 1 };
                dbLotes.push(novoLote);
                resolve({ success: true, data: novoLote });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteLote(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbLotes = dbLotes.filter(l => l.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// --- API Ocorrências ---
async function fetchOcorrencias() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbOcorrencias]), SIMULATED_DELAY);
    });
}
async function saveOcorrencia(ocorrenciaData) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (ocorrenciaEditando) {
                const index = dbOcorrencias.findIndex(o => o.id === ocorrenciaEditando.id);
                if (index !== -1) {
                    dbOcorrencias[index] = { ...ocorrenciaEditando, ...ocorrenciaData };
                    resolve({ success: true, data: dbOcorrencias[index] });
                }
            } else {
                const novaOcorrencia = { ...ocorrenciaData, id: Math.max(...dbOcorrencias.map(o => o.id), 0) + 1 };
                dbOcorrencias.push(novaOcorrencia);
                resolve({ success: true, data: novaOcorrencia });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteOcorrencia(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbOcorrencias = dbOcorrencias.filter(o => o.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// --- API Berçário ---
async function fetchBercarios() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbBercarios]), SIMULATED_DELAY);
    });
}
async function saveBercario(bercarioData) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (bercarioEditando) {
                const index = dbBercarios.findIndex(b => b.id === bercarioEditando.id);
                if (index !== -1) {
                    dbBercarios[index] = { ...bercarioEditando, ...bercarioData };
                    resolve({ success: true, data: dbBercarios[index] });
                }
            } else {
                const novoBercario = { ...bercarioData, id: Math.max(...dbBercarios.map(b => b.id), 0) + 1 };
                dbBercarios.push(novoBercario);
                resolve({ success: true, data: novoBercario });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteBercario(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbBercarios = dbBercarios.filter(b => b.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// --- API Maternidade ---
async function fetchMaternidades() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbMaternidades]), SIMULATED_DELAY);
    });
}
async function saveMaternidade(maternidadeData) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (maternidadeEditando) {
                const index = dbMaternidades.findIndex(m => m.id === maternidadeEditando.id);
                if (index !== -1) {
                    dbMaternidades[index] = { ...maternidadeEditando, ...maternidadeData };
                    resolve({ success: true, data: dbMaternidades[index] });
                }
            } else {
                const novaMaternidade = { ...maternidadeData, id: Math.max(...dbMaternidades.map(m => m.id), 0) + 1 };
                dbMaternidades.push(novaMaternidade);
                resolve({ success: true, data: novaMaternidade });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteMaternidade(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbMaternidades = dbMaternidades.filter(m => m.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// --- API Inseminação ---
async function fetchInseminacoes() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...dbInseminacoes]), SIMULATED_DELAY);
    });
}
async function saveInseminacao(inseminacaoData) {
     return new Promise(resolve => {
        setTimeout(() => {
            if (inseminacaoEditando) {
                const index = dbInseminacoes.findIndex(i => i.id === inseminacaoEditando.id);
                if (index !== -1) {
                    dbInseminacoes[index] = { ...inseminacaoEditando, ...inseminacaoData };
                    resolve({ success: true, data: dbInseminacoes[index] });
                }
            } else {
                const novaInseminacao = { ...inseminacaoData, id: Math.max(...dbInseminacoes.map(i => i.id), 0) + 1 };
                dbInseminacoes.push(novaInseminacao);
                resolve({ success: true, data: novaInseminacao });
            }
        }, SIMULATED_DELAY);
    });
}
async function deleteInseminacao(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            dbInseminacoes = dbInseminacoes.filter(i => i.id !== id);
            resolve({ success: true });
        }, SIMULATED_DELAY);
    });
}

// === FUNÇÕES DE INICIALIZAÇÃO E DADOS ===
function carregarDadosVeterinario() {
    // Esta função ainda depende da variável global 'veterinarioLogado' no app.js
    veterinarioLogado = { id: 1, nome: 'Dr. João Silva', email: 'joao.silva@veterinaria.com', crmv: 'CRMV-PR 12345' };
}
async function atualizarNomeVeterinarioInterface() {
    const nomeVeterinario = obterVeterinarioLogado(); // Função global do app.js
    const nomeHeader = document.getElementById('nome-veterinario-header');
    if (nomeHeader) nomeHeader.textContent = nomeVeterinario;
    const campoVeterinario = document.getElementById('veterinario-responsavel');
    if (campoVeterinario) campoVeterinario.value = nomeVeterinario;
    await atualizarDadosExistentesVeterinario(nomeVeterinario);
}
async function atualizarDadosExistentesVeterinario(nomeVeterinario) {
    // Atualiza os mocks. Em um sistema real, isso não seria necessário.
    dbOcorrencias.forEach(o => { if (o.veterinarioResponsavel === 'Dr. Veterinário') o.veterinarioResponsavel = nomeVeterinario; });
    await carregarOcorrencias();
}

// === FUNÇÕES DE CARREGAMENTO (RENDER) ===
// (Agora são ASYNC e usam fetch)
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
    atualizarSelectGeneticas(data); // Passa os dados para os selects
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

    data.forEach(lote => {
        const row = document.createElement('tr');
        const dataFormatada = formatarData(lote.dataCriacao); // Função global do app.js
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
async function carregarOcorrencias() {
    const tbody = document.getElementById('tabela-ocorrencias');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Carregando...</td></tr>';

    const data = await fetchOcorrencias();
    const ocorrenciasOrdenadas = [...data].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    tbody.innerHTML = '';

    if(ocorrenciasOrdenadas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Nenhuma ocorrência encontrada.</td></tr>';
        return;
    }

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
    
    // Atualiza os selects e resumos com os dados recém-buscados
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
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro de maternidade encontrado.</td></tr>';
        return;
    }

    data.forEach(maternidade => {
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
async function carregarInseminacoes() {
    const tbody = document.getElementById('tabela-inseminacao');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Carregando...</td></tr>';
    
    const data = await fetchInseminacoes();
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum registro de inseminação encontrado.</td></tr>';
        return;
    }

    data.forEach(inseminacao => {
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

// === FUNÇÕES DE MODAL (Abrir/Editar/Excluir/Fechar) ===

// --- Genética ---
function abrirModalGenetica() {
    geneticaEditando = null;
    document.getElementById('titulo-modal-genetica').textContent = 'Nova Genética';
    document.getElementById('form-genetica').reset();
    document.getElementById('modal-genetica').style.display = 'block';
}
async function editarGenetica(id) {
    const geneticas = await fetchGeneticas(); // Pega dados frescos
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
    const geneticas = await fetchGeneticas();
    const item = geneticas.find(g => g.id === id); 
    if (!item) return;
    
    // Regra de negócio: não pode excluir se estiver em uso
    const lotes = await fetchLotes();
    const lotesVinculados = lotes.filter(lote => lote.geneticaId === id);
    if (lotesVinculados.length > 0) {
        mostrarNotificacao('Erro!', `Não é possível excluir esta genética pois ela está vinculada aos lotes: ${lotesVinculados.map(l => l.nome).join(', ')}.`);
        return;
    }

    // Callback de confirmação (agora é async)
    const onConfirm = async () => {
        await deleteGenetica(id);
        await carregarGeneticas(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Genética "${item.nome}" excluída com sucesso.`);
    };
    
    // Chama o modal global
    mostrarConfirmacao('genética', id, item.nome, onConfirm);
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
    const lotes = await fetchLotes();
    const item = lotes.find(l => l.id === id); 
    if (!item) return;

    const onConfirm = async () => {
        await deleteLote(id);
        await carregarLotes(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Lote "${item.nome}" excluído com sucesso.`);
    };

    mostrarConfirmacao('lote', id, item.nome, onConfirm); 
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
    const agora = new Date();
    const dataHoraAtual = agora.toISOString().slice(0, 16);
    document.getElementById('data-hora-ocorrencia').value = dataHoraAtual;
    const campoVeterinario = document.getElementById('veterinario-responsavel');
    if (campoVeterinario) campoVeterinario.value = obterVeterinarioLogado();
    document.getElementById('modal-ocorrencia').style.display = 'block';
}
async function editarOcorrencia(id) {
    const ocorrencias = await fetchOcorrencias();
    ocorrenciaEditando = ocorrencias.find(o => o.id === id);
    if (ocorrenciaEditando) {
        document.getElementById('titulo-modal-ocorrencia').textContent = 'Editar Ocorrência';
        // (restante do preenchimento do formulário)
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
async function visualizarOcorrencia(id) {
    const ocorrencias = await fetchOcorrencias();
    const ocorrencia = ocorrencias.find(o => o.id === id);
    if (ocorrencia) {
        // (Lógica do alert() mantida, pois é apenas visualização)
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
        alert(`🔍 DETALHES DA OCORRÊNCIA #${ocorrencia.id}\n\n📅 Data/Hora: ${dataHoraFormatada}\n🐷 Lote: ${ocorrencia.loteNome}\n🏷️ Tipo: ${ocorrencia.tipo.toUpperCase()}\n⚠️ Prioridade: ${ocorrencia.prioridade.toUpperCase()}\n📊 Status: ${ocorrencia.status.replace('-', ' ').toUpperCase()}\n\n📝 Título: ${ocorrencia.titulo}\n\n📄 Descrição:\n${ocorrencia.descricao}\n\n🐖 Animais Afetados: ${ocorrencia.animaisAfetados || 'Não especificado'}${medicamentoInfo}\n\n👨‍⚕️ Veterinário: ${ocorrencia.veterinarioResponsavel}${proximasAcoesInfo}`);
    }
}
async function excluirOcorrencia(id) { 
    const ocorrencias = await fetchOcorrencias();
    const item = ocorrencias.find(o => o.id === id); 
    if (!item) return;

    const onConfirm = async () => {
        await deleteOcorrencia(id);
        await carregarOcorrencias(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Ocorrência "${item.titulo}" excluída com sucesso.`);
    };

    mostrarConfirmacao('ocorrência', id, item.titulo, onConfirm);
}
function fecharModalOcorrencia() { 
    const modal = document.getElementById('modal-ocorrencia');
    if (modal) modal.style.display = 'none'; 
    ocorrenciaEditando = null; 
}

// --- Berçário ---
function abrirModalBercario() {
    bercarioEditando = null;
    document.getElementById('titulo-modal-bercario').textContent = 'Novo Registro de Berçário';
    document.getElementById('form-bercario').reset();
    document.getElementById('data-nascimento').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-bercario').style.display = 'block';
}
async function editarBercario(id) {
    const bercarios = await fetchBercarios();
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
async function excluirBercario(id) { 
    const bercarios = await fetchBercarios();
    const item = bercarios.find(b => b.id === id); 
    if (!item) return;

    const onConfirm = async () => {
        await deleteBercario(id);
        await carregarBercarios(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Registro do berçário (ID: ${id}) excluído com sucesso.`);
    };
    
    mostrarConfirmacao('registro de berçário', id, `ID ${id}`, onConfirm);
}
function fecharModalBercario() { 
    const modal = document.getElementById('modal-bercario');
    if (modal) modal.style.display = 'none'; 
    bercarioEditando = null; 
}

// --- Maternidade ---
function abrirModalMaternidade() {
    maternidadeEditando = null;
    document.getElementById('titulo-modal-maternidade').textContent = 'Nova Porca na Maternidade';
    document.getElementById('form-maternidade').reset();
    const dataCobertura = document.getElementById('data-cobertura');
    const dataPartoPrevisao = document.getElementById('data-parto-prevista');
    // Lógica para calcular data prevista
    dataCobertura.addEventListener('change', function() {
        if (this.value) {
            const cobertura = new Date(this.value);
            cobertura.setDate(cobertura.getDate() + 114); // Gestação média de 114 dias
            dataPartoPrevisao.value = cobertura.toISOString().split('T')[0];
        }
    });
    document.getElementById('modal-maternidade').style.display = 'block';
}
async function editarMaternidade(id) {
    const maternidades = await fetchMaternidades();
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
async function excluirMaternidade(id) { 
    const maternidades = await fetchMaternidades();
    const item = maternidades.find(m => m.id === id); 
    if (!item) return;
    
    const onConfirm = async () => {
        await deleteMaternidade(id);
        await carregarMaternidades(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Registro da maternidade (Porca ${item.brincoPorca}) excluído com sucesso.`);
    };

    mostrarConfirmacao('registro de maternidade', id, `Porca ${item.brincoPorca}`, onConfirm);
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
    const inseminacoes = await fetchInseminacoes();
    const item = inseminacoes.find(i => i.id === id); 
    if (!item) return;

    const onConfirm = async () => {
        await deleteInseminacao(id);
        await carregarInseminacoes(); 
        await atualizarRelatorios();
        mostrarNotificacao('Excluído!', `Registro de inseminação (Fêmea ${item.brincoFemea}) excluído com sucesso.`);
    };

    mostrarConfirmacao('registro de inseminação', id, `Fêmea ${item.brincoFemea}`, onConfirm);
}
function fecharModalInseminacao() { 
    const modal = document.getElementById('modal-inseminacao');
    if (modal) modal.style.display = 'none'; 
    inseminacaoEditando = null; 
}


// === FUNÇÕES DE ATUALIZAÇÃO DE UI (Selects, Relatórios, etc.) ===
function atualizarSelectGeneticas(data) { // 'data' é o array de geneticas
    const selects = [ document.getElementById('genetica-lote'), document.getElementById('filtro-lote-genetica'), document.getElementById('genetica-porca'), document.getElementById('genetica-macho'), document.getElementById('filtro-maternidade-genetica') ];
    const optionsHtml = data.filter(g => g.status === 'ativa').map(g => `<option value="${g.id}">${g.nome}</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0 || index === 2 || index === 3) select.options[0].textContent = "Selecione uma genética";
    });
}
function atualizarSelectLotes(data) { // 'data' é o array de lotes
    const selects = [ document.getElementById('lote-bercario'), document.getElementById('filtro-bercario-lote') ];
    const optionsHtml = data.filter(l => l.status === 'ativo').map(l => `<option value="${l.id}">${l.nome}</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0) firstOption.textContent = "Selecione um lote";
    });
}
function atualizarSelectLotesOcorrencias(data) { // 'data' é o array de lotes
    const selects = [ document.getElementById('lote-ocorrencia'), document.getElementById('filtro-ocorrencia-lote') ];
    const optionsHtml = data.map(lote => `<option value="${lote.id}">${lote.nome} (${lote.status})</option>`).join('');
    selects.forEach((select, index) => {
        if (!select) return;
        const firstOption = select.querySelector('option');
        select.innerHTML = firstOption.outerHTML + optionsHtml;
        if(index === 0) firstOption.textContent = "Selecione um lote";
    });
}
async function atualizarResumoOcorrencias(data) { // 'data' é o array de ocorrencias
    const elCriticas = document.getElementById('ocorrencias-criticas');
    const elPendentes = document.getElementById('ocorrencias-pendentes');
    const elResolvidas = document.getElementById('ocorrencias-resolvidas-hoje');
    
    if(!elCriticas) return; // Aborta se os elementos do relatório não estiverem na página
    if(!data) data = await fetchOcorrencias(); // Garante que temos os dados

    const ocorrenciasCriticas = data.filter(o => o.prioridade === 'critica' && o.status !== 'resolvida').length;
    const ocorrenciasPendentes = data.filter(o => o.status === 'pendente' || o.status === 'em-andamento').length;
    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
    const ocorrenciasResolvidasHoje = data.filter(o => o.status === 'resolvida' && new Date(o.dataHora) > ontem).length;
    
    elCriticas.textContent = ocorrenciasCriticas;
    elPendentes.textContent = ocorrenciasPendentes;
    elResolvidas.textContent = ocorrenciasResolvidasHoje;
}
async function atualizarRelatorios() {
    const elGen = document.getElementById('total-geneticas');
    if(!elGen) return; // Aborta se os elementos do relatório não estiverem na página

    // Busca todos os dados necessários (em paralelo)
    const [geneticas, lotes, bercarios, maternidades, inseminacoes] = await Promise.all([
        fetchGeneticas(),
        fetchLotes(),
        fetchBercarios(),
        fetchMaternidades(),
        fetchInseminacoes()
    ]);

    document.getElementById('total-geneticas').textContent = geneticas.filter(g => g.status === 'ativa').length;
    document.getElementById('total-lotes').textContent = lotes.filter(l => l.status === 'ativo').length;
    document.getElementById('total-animais').textContent = lotes.reduce((sum, lote) => sum + lote.quantidadeAnimais, 0);
    document.getElementById('lotes-quarentena').textContent = lotes.filter(l => l.status === 'quarentena').length;
    document.getElementById('total-leitoes-bercario').textContent = bercarios.filter(b => b.status === 'ativo').reduce((sum, bercario) => sum + bercario.quantidadeLeitoes, 0);
    document.getElementById('total-porcas-gestantes').textContent = maternidades.filter(m => m.status === 'gestante').length;
    document.getElementById('total-porcas-lactantes').textContent = maternidades.filter(m => m.status === 'lactante').length;
    document.getElementById('total-inseminacoes-pendentes').textContent = inseminacoes.filter(i => i.resultado === 'aguardando').length;
}

// --- FUNÇÕES DE CONFIGURAÇÃO (LISTENERS) ---
function configurarFiltros() {
    const filtroGenetica = document.getElementById('filtro-genetica');
    if(filtroGenetica) filtroGenetica.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        document.querySelectorAll('#tabela-geneticas tbody tr').forEach(row => { 
            // Filtra pelo que já está renderizado no DOM
            row.style.display = (row.cells[1]?.textContent.toLowerCase() || '').includes(filtro) ? '' : 'none'; 
        });
    });
    
    document.getElementById('filtro-lote-genetica')?.addEventListener('change', aplicarFiltrosLotes);
    document.getElementById('filtro-lote-status')?.addEventListener('change', aplicarFiltrosLotes);
    document.getElementById('filtro-ocorrencia-lote')?.addEventListener('change', aplicarFiltrosOcorrencias);
    document.getElementById('filtro-ocorrencia-tipo')?.addEventListener('change', aplicarFiltrosOcorrencias);
    document.getElementById('filtro-ocorrencia-prioridade')?.addEventListener('change', aplicarFiltrosOcorrencias);
    document.getElementById('filtro-bercario-lote')?.addEventListener('change', aplicarFiltrosBercario);
    document.getElementById('filtro-bercario-status')?.addEventListener('change', aplicarFiltrosBercario);
    document.getElementById('filtro-maternidade-genetica')?.addEventListener('change', aplicarFiltrosMaternidade);
    document.getElementById('filtro-maternidade-status')?.addEventListener('change', aplicarFiltrosMaternidade);
    document.getElementById('filtro-inseminacao-periodo')?.addEventListener('change', aplicarFiltrosInseminacao);
    document.getElementById('filtro-inseminacao-resultado')?.addEventListener('change', aplicarFiltrosInseminacao);
}

// Funções de Filtro (síncronas, pois filtram os dados já renderizados)
async function aplicarFiltrosLotes() {
    const filtroGenetica = document.getElementById('filtro-lote-genetica').value; 
    const filtroStatus = document.getElementById('filtro-lote-status').value;
    const geneticas = await fetchGeneticas(); // Precisa dos dados para comparar
    
    document.querySelectorAll('#tabela-lotes tbody tr').forEach(row => {
        const geneticaCell = row.cells[2]?.textContent || ''; 
        const statusCell = row.cells[5]?.textContent.toLowerCase() || ''; 
        let mostrar = true;
        if (filtroGenetica) { 
            const geneticaSelecionada = geneticas.find(g => g.id == filtroGenetica); 
            if (geneticaSelecionada && geneticaCell !== geneticaSelecionada.nome) mostrar = false; 
        }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
async function aplicarFiltrosOcorrencias() {
    const filtroLote = document.getElementById('filtro-ocorrencia-lote').value; 
    const filtroTipo = document.getElementById('filtro-ocorrencia-tipo').value; 
    const filtroPrioridade = document.getElementById('filtro-ocorrencia-prioridade').value;
    const lotes = await fetchLotes();

    document.querySelectorAll('#tabela-ocorrencias tbody tr').forEach(row => {
        const loteCell = row.cells[2]?.textContent || ''; 
        const tipoCell = row.cells[3]?.textContent.toLowerCase() || ''; 
        const prioridadeCell = row.cells[4]?.textContent.toLowerCase() || ''; 
        let mostrar = true;
        if (filtroLote) { 
            const loteSelecionado = lotes.find(l => l.id == filtroLote); 
            if (loteSelecionado && !loteCell.includes(loteSelecionado.nome)) mostrar = false; 
        }
        if (filtroTipo && !tipoCell.includes(filtroTipo)) mostrar = false;
        if (filtroPrioridade && !prioridadeCell.includes(filtroPrioridade)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
async function aplicarFiltrosBercario() {
    const filtroLote = document.getElementById('filtro-bercario-lote').value; 
    const filtroStatus = document.getElementById('filtro-bercario-status').value;
    const lotes = await fetchLotes();

    document.querySelectorAll('#tabela-bercario tbody tr').forEach(row => {
        const loteCell = row.cells[1]?.textContent || ''; 
        const statusCell = row.cells[5]?.textContent.toLowerCase() || ''; 
        let mostrar = true;
        if (filtroLote) { 
            const loteSelecionado = lotes.find(l => l.id == filtroLote); 
            if (loteSelecionado && loteCell !== loteSelecionado.nome) mostrar = false; 
        }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
async function aplicarFiltrosMaternidade() {
    const filtroGenetica = document.getElementById('filtro-maternidade-genetica').value; 
    const filtroStatus = document.getElementById('filtro-maternidade-status').value;
    const geneticas = await fetchGeneticas();

    document.querySelectorAll('#tabela-maternidade tbody tr').forEach(row => {
        const geneticaCell = row.cells[2]?.textContent || ''; 
        const statusCell = row.cells[6]?.textContent.toLowerCase() || ''; 
        let mostrar = true;
        if (filtroGenetica) { 
            const geneticaSelecionada = geneticas.find(g => g.id == filtroGenetica); 
            if (geneticaSelecionada && geneticaCell !== geneticaSelecionada.nome) mostrar = false; 
        }
        if (filtroStatus && !statusCell.includes(filtroStatus)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}
function aplicarFiltrosInseminacao() {
    const filtroPeriodo = document.getElementById('filtro-inseminacao-periodo').value; 
    const filtroResultado = document.getElementById('filtro-inseminacao-resultado').value;
    document.querySelectorAll('#tabela-inseminacao tbody tr').forEach(row => {
        const dataCell = row.cells[3]?.textContent || ''; 
        const resultadoCell = row.cells[5]?.textContent.toLowerCase() || ''; 
        let mostrar = true;
        if (filtroPeriodo && dataCell) {
            const dataInseminacao = new Date(dataCell.split('/').reverse().join('-')); 
            const hoje = new Date(); 
            const diasAtras = new Date(); 
            diasAtras.setDate(hoje.getDate() - parseInt(filtroPeriodo));
            if (dataInseminacao < diasAtras) mostrar = false;
        }
        if (filtroResultado && !resultadoCell.includes(filtroResultado)) mostrar = false;
        row.style.display = mostrar ? '' : 'none';
    });
}

// Configura os listeners dos formulários
function configurarFormularios() {
    // --- Formulário de Genética (Agora é async) ---
    const formGenetica = document.getElementById('form-genetica');
    if(formGenetica) formGenetica.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaData = { nome: formData.get('nome-genetica'), descricao: formData.get('descricao-genetica'), caracteristicas: formData.get('caracteristicas-genetica'), status: formData.get('status-genetica') };
        
        // Regra de negócio
        if (geneticaEditando && geneticaData.status === 'inativa' && geneticaEditando.status === 'ativa') {
            const lotes = await fetchLotes();
            const lotesAtivos = lotes.filter(lote => lote.geneticaId === geneticaEditando.id && (lote.status === 'ativo' || lote.status === 'quarentena'));
            if (lotesAtivos.length > 0) {
                mostrarNotificacao('Erro!', `Não é possível inativar esta genética pois ela possui lotes ativos: ${lotesAtivos.map(l => l.nome).join(', ')}.`);
                return;
            }
        }
        
        // Chama a API simulada
        await saveGenetica(geneticaData); 
        
        // Recarrega os dados e fecha o modal
        await carregarGeneticas(); 
        await atualizarRelatorios(); 
        fecharModalGenetica();
        mostrarNotificacao('Sucesso!', `Genética "${geneticaData.nome}" salva com sucesso.`);
    });
    
    // --- Formulário de Lote (Agora é async) ---
    const formLote = document.getElementById('form-lote');
    if(formLote) formLote.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaId = parseInt(formData.get('genetica-lote'));
        const geneticas = await fetchGeneticas();
        const genetica = geneticas.find(g => g.id === geneticaId);
        
        if (!genetica) { mostrarNotificacao('Erro!', 'Selecione uma genética válida'); return; }
        
        const loteData = { nome: formData.get('nome-lote'), geneticaId: geneticaId, geneticaNome: genetica.nome, quantidadeAnimais: parseInt(formData.get('quantidade-animais')), dataCriacao: formData.get('data-criacao'), status: formData.get('status-lote') };
        
        await saveLote(loteData);
        await carregarLotes(); 
        await atualizarRelatorios(); 
        fecharModalLote();
        mostrarNotificacao('Sucesso!', `Lote "${loteData.nome}" salvo com sucesso.`);
    });
    
    // --- Formulário de Ocorrência (Agora é async) ---
    const formOcorrencia = document.getElementById('form-ocorrencia');
    if(formOcorrencia) formOcorrencia.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loteId = parseInt(formData.get('lote-ocorrencia'));
        const lotes = await fetchLotes();
        const lote = lotes.find(l => l.id === loteId);
        if (!lote) { mostrarNotificacao('Erro!', 'Selecione um lote válido'); return; }
        
        const ocorrenciaData = { 
            dataHora: formData.get('data-hora-ocorrencia'), loteId: loteId, loteNome: lote.nome, 
            tipo: formData.get('tipo-ocorrencia'), prioridade: formData.get('prioridade-ocorrencia'), 
            titulo: formData.get('titulo-ocorrencia'), descricao: formData.get('descricao-ocorrencia'), 
            animaisAfetados: parseInt(formData.get('animais-afetados')) || 0, 
            medicamentoAplicado: formData.get('medicamento-aplicado') || '', 
            dosagem: formData.get('dosagem') || '', 
            veterinarioResponsavel: formData.get('veterinario-responsavel'), 
            proximasAcoes: formData.get('proximas-acoes') || '', 
            status: formData.get('status-ocorrencia') 
        };
        
        await saveOcorrencia(ocorrenciaData);
        await carregarOcorrencias(); 
        await atualizarRelatorios(); 
        fecharModalOcorrencia();
        mostrarNotificacao('Sucesso!', `Ocorrência "${ocorrenciaData.titulo}" salva.`);
        if (ocorrenciaData.prioridade === 'critica') {
            mostrarNotificacao('Atenção!', 'Ocorrência CRÍTICA registrada. Requer atenção imediata.');
        }
    });
    
    // --- Formulário de Berçário (Agora é async) ---
    const formBercario = document.getElementById('form-bercario');
    if(formBercario) formBercario.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loteId = parseInt(formData.get('lote-bercario'));
        const lotes = await fetchLotes();
        const lote = lotes.find(l => l.id === loteId);
        if (!lote) { mostrarNotificacao('Erro!', 'Selecione um lote válido'); return; }
        
        const bercarioData = { 
            loteId: loteId, loteNome: lote.nome, 
            quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes')), 
            dataNascimento: formData.get('data-nascimento'), 
            pesoMedio: parseFloat(formData.get('peso-medio')), 
            status: formData.get('status-bercario'), 
            dataDesmame: formData.get('data-desmame') || null 
        };
        
        await saveBercario(bercarioData);
        await carregarBercarios(); 
        await atualizarRelatorios(); 
        fecharModalBercario();
        mostrarNotificacao('Sucesso!', `Registro do berçário (Lote ${lote.nome}) salvo com sucesso.`);
    });
    
    // --- Formulário de Maternidade (Agora é async) ---
    const formMaternidade = document.getElementById('form-maternidade');
    if(formMaternidade) formMaternidade.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaId = parseInt(formData.get('genetica-porca'));
        const geneticas = await fetchGeneticas();
        const genetica = geneticas.find(g => g.id === geneticaId);
        if (!genetica) { mostrarNotificacao('Erro!', 'Selecione uma genética válida'); return; }
        
        const maternidadeData = { 
            brincoPorca: formData.get('brinco-porca'), geneticaId: geneticaId, geneticaNome: genetica.nome, 
            dataCobertura: formData.get('data-cobertura'), 
            dataPartoPrevisao: formData.get('data-parto-prevista'), 
            quantidadeLeitoes: parseInt(formData.get('quantidade-leitoes-nascidos')) || 0, 
            status: formData.get('status-maternidade') 
        };
        
        await saveMaternidade(maternidadeData);
        await carregarMaternidades(); 
        await atualizarRelatorios(); 
        fecharModalMaternidade();
        mostrarNotificacao('Sucesso!', `Registro da porca "${maternidadeData.brincoPorca}" salvo com sucesso.`);
    });
    
    // --- Formulário de Inseminação (Agora é async) ---
    const formInseminacao = document.getElementById('form-inseminacao');
    if(formInseminacao) formInseminacao.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const geneticaMachoId = parseInt(formData.get('genetica-macho'));
        const geneticas = await fetchGeneticas();
        const geneticaMacho = geneticas.find(g => g.id === geneticaMachoId);
        if (!geneticaMacho) { mostrarNotificacao('Erro!', 'Selecione uma genética válida para o macho'); return; }
        
        const inseminacaoData = { 
            brincoFemea: formData.get('brinco-femea'), geneticaMachoId: geneticaMachoId, 
            geneticaMachoNome: geneticaMacho.nome, 
            dataInseminacao: formData.get('data-inseminacao'), 
            tecnica: formData.get('tecnica-inseminacao'), 
            resultado: formData.get('resultado-inseminacao'), 
            dataVerificacao: formData.get('data-verificacao') || null 
        };
        
        await saveInseminacao(inseminacaoData);
        await carregarInseminacoes(); 
        await atualizarRelatorios(); 
        fecharModalInseminacao();
        mostrarNotificacao('Sucesso!', `Registro de inseminação (Fêmea "${inseminacaoData.brincoFemea}") salvo com sucesso.`);
    });
}
function configurarListenersDeBotoes() {
    document.getElementById('btn-logout').addEventListener('click', function() {
        // (confirm() é aceitável para logout, pois previne saídas acidentais)
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

    // Tecla ESC para fechar modais (global, definido no app.js)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') { 
            // fecharTodosModais() é uma função global do app.js
            fecharTodosModais(); 
        }
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
    // Event delegation para todas as tabelas
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

