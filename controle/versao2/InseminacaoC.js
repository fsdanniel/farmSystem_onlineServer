"use strict";

import {
    novoRegistroInseminacao,
    editarRegistroInseminacao,
    excluirRegistroInseminacao,
    buscaInseminacao
} from "../../modelo/versao3/man/manInseminacao.sql";

export async function fetchInseminacoes() {
    const dados = await buscaInseminacao(null, null);
    return dados.rows || dados;
}

export async function saveInseminacao(insData) {
    if (insData.id) {
        return await editarRegistroInseminacao(
            insData.id,
            insData.brincoFemea,
            insData.geneticaMacho,
            insData.dataInseminacao,
            insData.tecnica,
            insData.resultado,
            insData.dataVerificacao
        );
    }

    return await novoRegistroInseminacao(
        insData.brincoFemea,
        insData.geneticaMacho,
        insData.dataInseminacao,
        insData.tecnica,
        insData.resultado,
        insData.dataVerificacao
    );
}

export async function deleteInseminacao(id) {
    return await excluirRegistroInseminacao(id);
}
