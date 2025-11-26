"use strict";

import {
    novoRegistroMaternidade,
    editarRegistroMaternidade,
    excluirRegistroMaternidade,
    buscaMaternidade
} from "../../modelo/versao3/man/manMaternidade.sql";


export async function fetchMaternidades() {
    const dados = await buscaMaternidade("", "todos");
    return dados.rows || dados;
}


export async function saveMaternidade(materData) {

    if (materData.id) {
        return await editarRegistroMaternidade(
            materData.id,
            materData.brincoFemea,
            materData.genetica,
            materData.dataCobertura,
            materData.dataPartoPrevisto,
            materData.qtdeLeitoes,
            materData.status
        );
    }

    return await novoRegistroMaternidade(
        materData.brincoFemea,
        materData.genetica,
        materData.dataCobertura,
        materData.dataPartoPrevisto,
        materData.qtdeLeitoes,
        materData.status
    );
}



export async function deleteMaternidade(id) {
    return await excluirRegistroMaternidade(id);
}

