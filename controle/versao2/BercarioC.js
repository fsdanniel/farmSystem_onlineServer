"use strict";

import { 
    novoRegistroBercario,
    editarRegistroBercario,
    excluirRegistroBercario,
    buscaBercario
} from "../../modelo/versao3/man/manBercario.sql";



export async function fetchBercarios() {
    // O FRONT espera um array igual ao que o mock retornava
    const dados = await buscaBercario("", "todos");
    return dados.rows || dados; 
}


export async function saveBercario(bercarioData) {

    if (bercarioData.id) {
        // Atualização → chamar editarRegistroBercario
        return await editarRegistroBercario(
            bercarioData.loteNome,
            bercarioData.quantidadeLeitoes,
            bercarioData.dataNascimento,
            bercarioData.pesoMedio,
            bercarioData.dataDesmame,
            bercarioData.status
        );
    }

    return await novoRegistroBercario(
        bercarioData.loteNome,
        bercarioData.quantidadeLeitoes,
        bercarioData.dataNascimento,
        bercarioData.pesoMedio,
        bercarioData.dataDesmame,
        bercarioData.status
    );
}


export async function deleteBercario(idOuNomeLote) {
    // O front usa "id", mas o back usa "loteNome" no delete.

    const todos = await buscaBercario("", "todos");
    const item = todos.find(b => b.id == idOuNomeLote);

    if (!item) throw new Error("Registro não encontrado!");

    return await excluirRegistroBercario(item.loteNome);
}

