"use strict";

import {
    novaOcorrencia,
    editarOcorrencia,
    excluirOcorrencia,
    buscaOcorrencias,
    listagemLotes,
    quantidadeOcorrenciasCriticas,
    quantidadeOcorrenciasPendentes,
    quantidadeOcorrenciasResolvidasHoje
} from "../../modelo/versao3/man/manOcorrencias.sql";

export async function fetchOcorrencias() {
    const dados = await buscaOcorrencias(null, null, null);
    return dados.rows || dados;
}

export async function saveOcorrencia(ocData) {
    if (ocData.id) {
        return await editarOcorrencia(
            ocData.id,
            ocData.loteNome,
            ocData.tipo,
            ocData.prioridade,
            ocData.dia,
            ocData.hora,
            ocData.titulo,
            ocData.descricao,
            ocData.quantidadeAnimaisAfetados,
            ocData.medicamentoAplicado,
            ocData.dosagem,
            ocData.responsavel,
            ocData.proximasAcoes,
            ocData.status
        );
    }

    return await novaOcorrencia(
        ocData.loteNome,
        ocData.tipo,
        ocData.prioridade,
        ocData.dia,
        ocData.hora,
        ocData.titulo,
        ocData.descricao,
        ocData.quantidadeAnimaisAfetados,
        ocData.medicamentoAplicado,
        ocData.dosagem,
        ocData.responsavel,
        ocData.proximasAcoes,
        ocData.status
    );
}

export async function deleteOcorrencia(id) {
    return await excluirOcorrencia(id);
}

export async function fetchLotesOcorrencias() {
    const dados = await listagemLotes();
    return dados.rows || dados;
}

export async function fetchQtdOcorrenciasCriticas() {
    const dados = await quantidadeOcorrenciasCriticas();
    return dados.rows || dados;
}

export async function fetchQtdOcorrenciasPendentes() {
    const dados = await quantidadeOcorrenciasPendentes();
    return dados.rows || dados;
}

export async function fetchQtdOcorrenciasResolvidasHoje() {
    const dados = await quantidadeOcorrenciasResolvidasHoje();
    return dados.rows || dados;
}
