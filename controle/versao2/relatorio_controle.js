"use strict"; 


async function buscarDadosRelatorio(tipo, dataIni, dataFim) {

    const params = new URLSearchParams({
        tipo: tipo,
        dataIni: dataIni || "",
        dataFim: dataFim || ""
    });

    try {
        const response = await fetch(`/api/relatorios?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Erro ao buscar relatório no servidor");
        }

        const dados = await response.json();
        return dados;

    } catch (error) {
        console.error("Erro ao buscar dados do relatório:", error);
        return [];
    }
}


async function quantidadeGeneticasAtivas() {
    return await buscarDadosRelatorio("geneticasAtivas");
}

async function quantidadeLotesAtivos() {
    return await buscarDadosRelatorio("lotesAtivos");
}

async function quantidadeAnimaisAtivos() {
    return await buscarDadosRelatorio("animaisAtivos");
}

async function quantidadeLotesQuarentenados() {
    return await buscarDadosRelatorio("lotesQuarentena");
}

async function quantidadeLeitoesBercario() {
    return await buscarDadosRelatorio("leitoesBercario");
}

async function quantidadePorcasGestantes() {
    return await buscarDadosRelatorio("porcasGestantes");
}

async function quantidadePorcasLactantes() {
    return await buscarDadosRelatorio("porcasLactantes");
}

async function quantidadeInseminacoesPendentes() {
    return await buscarDadosRelatorio("inseminacoesPendentes");
}

async function relatorioPaginaRelatorios(tipo, dataIni, dataFim) {
    return await buscarDadosRelatorio(tipo, dataIni, dataFim);
}

