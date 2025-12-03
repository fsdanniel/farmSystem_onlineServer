// Arquivo: js/modulos/relatorios.js
// Módulo responsável pela lógica do Gerador de Relatórios
// (Filtros e tabela na seção #relatorios-section)

"use strict";

// CONFIGURAÇÃO DA API
// Ajustado para uso relativo (mesmo domínio do servidor web)
const API_URL_RELATORIOS = 'http://undeluded-filmier-eusebio.ngrok-free.dev/api';

/**
 * Inicializa a lógica do Gerador de Relatórios (botão Filtrar).
 * É chamada pelo app.js (DOMContentLoaded).
 */
function inicializarModuloRelatorios() {
    const btnFiltrar = document.getElementById("btnFiltrar");
    const tabelaBody = document.getElementById("tbody-relatorios");

    // Se o botão não existir, encerra a inicialização
    if (!btnFiltrar) return; 

    btnFiltrar.addEventListener("click", async () => {
        const tipo = document.getElementById("tipoRelatorio").value;
        
        if (!tipo) {
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Atenção!', 'Selecione o tipo de relatório.');
            } else {
                alert('Selecione o tipo de relatório.');
            }
            return;
        }

        // Feedback visual de carregamento
        tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Carregando dados...</td></tr>`;
        
        try {
            let dadosFormatados = [];

            if (tipo === "partos") {
                // Busca dados reais da Maternidade
                const response = await fetch(`${API_URL_RELATORIOS}/maternidades`);
                const json = await response.json();
                
                if (json.sucesso && json.dados) {
                    // Mapeia os dados brutos do banco para o formato do relatório
                    dadosFormatados = json.dados.map(item => ({
                        // Tenta pegar data de parto ou cobertura. Postgres retorna minúsculo.
                        data: item.datapartoprevisto || item.dataPartoPrevisao || item.datacobertura || item.dataCobertura,
                        lote: `Matriz ${item.brincofemea || item.brincoPorca || 'S/N'}`,
                        qtd: item.qtdeleitoes || item.quantidadeLeitoes || 0,
                        obs: item.status // Ex: "lactante", "gestante"
                    }));
                }

            } else if (tipo === "desmames") {
                // Busca dados reais do Berçário (que representam os desmames/lotes)
                const response = await fetch(`${API_URL_RELATORIOS}/bercario`);
                const json = await response.json();

                if (json.sucesso && json.dados) {
                    dadosFormatados = json.dados.map(item => ({
                        data: item.datadesmame || item.dataDesmame || item.datanascimento || item.dataNascimento,
                        lote: item.lotenome || item.loteNome,
                        qtd: item.quantidadeleitoes || item.quantidadeLeitoes,
                        // Formata a observação
                        obs: (item.pesomedio || item.pesoMedio) ? `Peso Médio: ${item.pesomedio || item.pesoMedio}kg` : item.status
                    }));
                }
            }
            
            // Renderização
            renderizarTabelaRelatorios(tabelaBody, dadosFormatados);

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Erro ao buscar dados do servidor.</td></tr>`;
        }
    });
}

/**
 * Função auxiliar para renderizar o HTML da tabela
 */
function renderizarTabelaRelatorios(tbody, dados) {
    tbody.innerHTML = ""; // Limpa carregamento

    if (!dados || dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum registro encontrado para este relatório.</td></tr>`;
        return;
    }

    dados.forEach((item) => {
        // Formata data cortando o ISO string se necessário (YYYY-MM-DDTHH:mm...)
        let dataExibicao = item.data;
        if (dataExibicao && typeof dataExibicao === 'string' && dataExibicao.includes('T')) {
            dataExibicao = dataExibicao.split('T')[0];
        }

        const row = `<tr>
            <td>${formatarData(dataExibicao)}</td>
            <td>${item.lote}</td>
            <td>${item.qtd}</td>
            <td>${item.obs}</td>
        </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}