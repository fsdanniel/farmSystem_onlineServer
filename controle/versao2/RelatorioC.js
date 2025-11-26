"use strict";

import {
    relatorioPaginaRelatorios,
    quantidadeGeneticasAtivas,
    quantidadeLotesAtivos,
    quantidadeAnimaisAtivos,
    quantidadeLotesQuarentenados,
    quantidadeLeitoesBercario,
    quantidadePorcasGestantes,
    quantidadePorcasLactantes,
    quantidadeInseminacoesPendentes
} from "../../modelo/versao3/man/manRelatorios.js";

// --- resumo inicial da página ---
export async function obterResumoRelatorios(req, res) {
    try {
        const resumo = {
            geneticas: await quantidadeGeneticasAtivas(),
            lotesAtivos: await quantidadeLotesAtivos(),
            animaisAtivos: await quantidadeAnimaisAtivos(),
            quarentena: await quantidadeLotesQuarentenados(),
            bercario: await quantidadeLeitoesBercario(),
            gestantes: await quantidadePorcasGestantes(),
            lactantes: await quantidadePorcasLactantes(),
            inseminacoesPendentes: await quantidadeInseminacoesPendentes()
        };

        res.json({ ok: true, dados: resumo });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar resumo" });
    }
}


// --- gerador de relatorio ---
export async function buscarRelatorio(req, res) {
    try {
        const { tipo, dataIni, dataFim } = req.query;

        if (!tipo || (tipo !== "partos" && tipo !== "desmames")) {
            return res.status(400).json({ ok: false, erro: "Tipo inválido" });
        }

        const dados = await relatorioPaginaRelatorios(tipo, dataIni || null, dataFim || null);

        res.json({ ok: true, dados });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar relatório" });
    }
}

