"use strict";

/**
 * IMPORTA AS FUNÇÕES DO BACK
 * Aqui você importa apenas as funções necessárias do banco.
 */
import {
    novoRegistroContrato,
    editarRegistroContrato,
    excluirRegistroContrato,
    buscaContratos
} from "../../modelo/versao3/man/manContratos.sql";


// --- criar contratos ---
export async function listarContratos(req, res) {
    try {
        const lista = await buscaContratos();
        res.json({ ok: true, data: lista });
    } catch (err) {
        console.error("Erro ao listar contratos:", err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar contratos." });
    }
}


// --- criar novo contrato ---
export async function criarContrato(req, res) {
    try {
        const { fornecedor, objeto, dataInicio, dataVencimento } = req.body;

        // Validações básicas
        if (!fornecedor || !objeto || !dataInicio || !dataVencimento) {
            return res.status(400).json({ ok: false, erro: "Campos obrigatórios faltando." });
        }

        await novoRegistroContrato(fornecedor, objeto, dataInicio, dataVencimento);
        res.json({ ok: true, msg: "Contrato criado com sucesso." });

    } catch (err) {
        console.error("Erro ao criar contrato:", err);
        res.status(500).json({ ok: false, erro: "Erro ao criar contrato." });
    }
}


// --- editar um contrato ---
export async function editarContrato(req, res) {
    try {
        const { id } = req.params;
        const { fornecedor, objeto, dataInicio, dataVencimento } = req.body;

        if (!id) {
            return res.status(400).json({ ok: false, erro: "ID é obrigatório." });
        }

        await editarRegistroContrato(id, fornecedor, objeto, dataInicio, dataVencimento);
        res.json({ ok: true, msg: "Contrato editado com sucesso." });

    } catch (err) {
        console.error("Erro ao editar contrato:", err);
        res.status(500).json({ ok: false, erro: "Erro ao editar contrato." });
    }
}


// --- Excluir contrato ---
export async function removerContrato(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ ok: false, erro: "ID é obrigatório." });
        }

        await excluirRegistroContrato(id);
        res.json({ ok: true, msg: "Contrato excluído com sucesso." });

    } catch (err) {
        console.error("Erro ao excluir contrato:", err);
        res.status(500).json({ ok: false, erro: "Erro ao excluir contrato." });
    }
}
