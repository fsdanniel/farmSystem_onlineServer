// Arquivo: js/modulos/relatorios.js
// Módulo responsável pela lógica do Gerador de Relatórios
// (Filtros e tabela na seção #relatorios-section)

"use strict";

// CONFIGURAÇÃO DA API
const API_URL_RELATORIOS = 'http://localhost:3000';

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
            mostrarNotificacao('Atenção!', 'Selecione o tipo de relatório.');
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
                    // Filtra apenas registros relevantes (com leitões nascidos ou gestantes)
                    // e mapeia para o formato da tabela de relatório
                    dadosFormatados = json.dados.map(item => ({
                        data: item.datapartoprevisto || item.datacobertura, // Usa previsão ou cobertura
                        lote: `Matriz ${item.brincofemea || item.brincoPorca}`,
                        qtd: item.qtdeleitoes || 0,
                        obs: item.status // Ex: "lactante", "gestante"
                    }));
                }

            } else if (tipo === "desmames") {
                // Busca dados reais do Berçário (que representam os desmames/lotes)
                const response = await fetch(`${API_URL_RELATORIOS}/bercario`);
                const json = await response.json();

                if (json.sucesso && json.dados) {
                    dadosFormatados = json.dados.map(item => ({
                        data: item.datadesmame || item.datanascimento, // Data do desmame ou nascimento
                        lote: item.lotenome,
                        qtd: item.quantidadeleitoes,
                        obs: item.pesomedio ? `Peso Médio: ${item.pesomedio}kg` : item.status
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

    if (dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum registro encontrado para este relatório.</td></tr>`;
        return;
    }

    dados.forEach((item) => {
        // Formata data cortando o ISO string se necessário
        let dataExibicao = item.data;
        if (dataExibicao && dataExibicao.includes('T')) {
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