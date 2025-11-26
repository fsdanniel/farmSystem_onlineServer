

import * as insumosSQL from "../../modelo/versao3/man/manInsumos.sql";

"use strict";

const InsumosC = {

    // compra de insumos

    async comprarInsumos(dados) {
        const {
            nome,
            dataCompra,
            quantidade,
            nomeFornecedor,
            custoTotal,
            statusRegistro
        } = dados;

        return await insumosSQL.comprarInsumos(
            nome,
            dataCompra,
            quantidade,
            nomeFornecedor,
            custoTotal,
            statusRegistro
        );
    },

    // excluir insumo

    async excluirInsumos(id) {
        return await insumosSQL.excluirInsumos(id);
    },

    // histórico de insumos

    async historicoInsumos() {
        return await insumosSQL.historicoInsumos();
    },

    // estoque atual de insumos

    async estoqueInsumos() {
        return await insumosSQL.estoqueInsumos();
    }
};

export default InsumosC;


