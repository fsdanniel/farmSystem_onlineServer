"use strict";

import {
    novoRegistroGenetica,
    editaRegistroGenetica,
    excluirRegistroGenetica,
    buscaGenetica,
    listaNomesGeneticas,
    listagemFinalPaginaGeneticas
} from "../../modelo/versao3/man/manGenetica.sql";


export async function fetchGeneticas() {
    const dados = await buscaGenetica(""); 
    return dados.rows || dados;  
}


export async function saveGenetica(geneticaData) {

    if (geneticaData.id) {
        return await editaRegistroGenetica(
            geneticaData.id,
            geneticaData.nome,
            geneticaData.descricao,
            geneticaData.caracteristicas,
            geneticaData.status
        );
    }

    return await novoRegistroGenetica(
        geneticaData.nome,
        geneticaData.descricao,
        geneticaData.caracteristicas
    );
}


export async function deleteGenetica(idGen) {
    return await excluirRegistroGenetica(idGen);
}


// OPCIONAIS (PRA USO POSTERIOR DO FRONT)

export async function fetchNomesGeneticas() {
    const dados = await listaNomesGeneticas();
    return dados.rows || dados;
}

export async function fetchGeneticasPaginadas() {
    const dados = await listagemFinalPaginaGeneticas();
    return dados.rows || dados;
}
