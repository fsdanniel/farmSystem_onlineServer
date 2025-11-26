import * as eventosSQL from "../../modelo/versao3/man/manEventos.sql";

"use strict";

const EventosC = {

 // INSEMINAÇÃO

    async novoEventoCoberturaInseminacao(dados) {
        const { dataCobertura, matrizId, tipo, observacoes } = dados;
        return await eventosSQL.novoEventoCoberturaInseminacao(
            dataCobertura,
            matrizId,
            tipo,
            observacoes
        );
    },

    async excluirEventoCoberturaInseminacao(id) {
        return await eventosSQL.excluirEventoCoberturaInseminacao(id);
    },

// PARTO

    async novoEventoParto(dados) {
        const { data, matrizId, quantidadeNascidos, observacoes } = dados;
        return await eventosSQL.novoEventoParto(
            data,
            matrizId,
            quantidadeNascidos,
            observacoes
        );
    },

    async excluirEventoParto(id) {
        return await eventosSQL.excluirEventoParto(id);
    },

// DESMAME

    async novoEventoDesmame(dados) {
        const { data, loteId, quantidadeDesmamados, observacoes } = dados;
        return await eventosSQL.novoEventoDesmame(
            data,
            loteId,
            quantidadeDesmamados,
            observacoes
        );
    },

    async excluirEventoDesmame(id) {
        return await eventosSQL.excluirEventoDesmame(id);
    },

// MORTE LOTE

    async novoEventoMorteLote(dados) {
        const { loteData, loteIdLote, loteCausaMorte, loteObservacoes } = dados;
        return await eventosSQL.novoEventoMorteLote(
            loteData,
            loteIdLote,
            loteCausaMorte,
            loteObservacoes
        );
    },

    async excluirEventoMorteLote(id) {
        return await eventosSQL.excluirEventoMorteLote(id);
    },

// MORTE FÊMEA

    async novoEventoMorteFemea(dados) {
        const { femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes } = dados;
        return await eventosSQL.novoEventoMorteFemea(
            femeaData,
            femeaIdMatriz,
            femeaCausaMorte,
            femeaObservacoes
        );
    },

    async excluirEventoMorteFemea(id) {
        return await eventosSQL.excluirEventoMorteFemea(id);
    }
};

export default EventosC;



