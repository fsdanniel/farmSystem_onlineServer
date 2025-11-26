
import * as financeiroSQL from "../../modelo/versao3/man/manFinanceiro.sql";

"use strict";

const FinanceiroC = {

// NOVO REGISTRO FINANCEIRO

    async novoRegistroFinanceiro(dados) {
        const { data, descricao, valor, tipo, categoria } = dados;

        return await financeiroSQL.novoRegistroFinanceiro(
            data,
            descricao,
            valor,
            tipo,
            categoria
        );
    },

// EDITAR REGISTRO FINANCEIRO

    async editarRegistroFinanceiro(dados) {
        const { id, data, descricao, valor, tipo, categoria } = dados;

        return await financeiroSQL.editarRegistroFinanceiro(
            id,
            data,
            descricao,
            valor,
            tipo,
            categoria
        );
    },

// EXCLUIR REGISTRO FINANCEIRO

    async excluirRegistroFinanceiro(id) {
        return await financeiroSQL.excluirRegistroFinanceiro(id);
    },

// CONSULTAR LISTA FINANCEIRA

    async buscaFinanceiro() {
        return await financeiroSQL.buscaFinanceiro();
    }
};

export default FinanceiroC;


