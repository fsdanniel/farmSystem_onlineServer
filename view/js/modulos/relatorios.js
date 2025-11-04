// Arquivo: js/modulos/relatorios.js
// Módulo responsável pela lógica do Gerador de Relatórios
// (Filtros e tabela na seção #relatorios-section)

"use strict";

// --- DADOS MOCADOS (Simulação de BD) ---
// (Movidos do app.js)
const mockDadosPartos = [
    { data: '2025-10-01', lote: 'Matriz F002', qtd: 12, obs: 'Parto normal' },
    { data: '2025-10-03', lote: 'Matriz F005', qtd: 14, obs: 'Parto assistido' }
];

const mockDadosDesmames = [
    { data: '2025-10-22', lote: 'Lote A-001', qtd: 11, obs: 'Peso médio 7.5kg' },
    { data: '2025-10-24', lote: 'Lote B-002', qtd: 13, obs: 'Transferidos para creche' }
];

/**
 * Inicializa a lógica do Gerador de Relatórios (botão Filtrar).
 * É chamada pelo app.js (DOMContentLoaded).
 */
function inicializarModuloRelatorios() {
    const btnFiltrar = document.getElementById("btnFiltrar");
    const tabelaBody = document.getElementById("tbody-relatorios");

    // Se o botão não existir, encerra a inicialização
    if (!btnFiltrar) return; 

    btnFiltrar.addEventListener("click", () => {
        const tipo = document.getElementById("tipoRelatorio").value;
        tabelaBody.innerHTML = ""; // Limpa a tabela

        if (!tipo) {
            // Chama a função modal global (definida no app.js)
            mostrarNotificacao('Atenção!', 'Selecione o tipo de relatório.');
            return;
        }

        // Simula a busca de dados
        let dados = [];
        if (tipo === "partos") {
            dados = mockDadosPartos;
        } else if (tipo === "desmames") {
            dados = mockDadosDesmames;
        }
        
        if (dados.length === 0) {
             tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum dado encontrado para este relatório.</td></tr>`;
             return;
        }

        // Renderiza os dados na tabela
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
