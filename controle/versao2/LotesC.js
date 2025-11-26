"use strict";

import {
    novoLote,
    editaLote,
    excluirLote,
    buscaPaginaLotes,
    listaNomesGeneticas
} from "../../modelo/versao3/man/manLotes.sql";


export async function fetchLotes() {
    const dados = await buscaPaginaLotes(null, null);
    return dados.rows || dados;
}


export async function saveLote(loteData) {

    if (loteData.id) {
        return await editaLote(
            loteData.id,
            loteData.nome,
            loteData.genetica,
            loteData.quantidade,
            loteData.dataCriacao,
            loteData.status
        );
    }

    return await novoLote(
        loteData.nome,
        loteData.genetica,
        loteData.quantidade,
        loteData.dataCriacao,
        loteData.status
    );
}


export async function deleteLote(idL) {
    return await excluirLote(idL);
}


export async function fetchNomesGeneticas() {
    const dados = await listaNomesGeneticas();
    return dados.rows || dados;
}
