"use strict";

import {
    listarTarefas,
    inserirTarefa,
    atualizarTarefa,
    excluirTarefa
} from "../../modelo/versao3/man/manTarefas.sql";

export async function controleListarTarefas(req, res) {
    try {
        const dados = await listarTarefas();
        res.json({ ok: true, dados });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao listar tarefas" });
    }
}

export async function controleInserirTarefa(req, res) {
    try {
        const dados = await inserirTarefa(req.body);
        res.json({ ok: true, dados });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao inserir tarefa" });
    }
}

export async function controleAtualizarTarefa(req, res) {
    try {
        const dados = await atualizarTarefa(req.params.id, req.body);
        res.json({ ok: true, dados });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao atualizar tarefa" });
    }
}

export async function controleExcluirTarefa(req, res) {
    try {
        const dados = await excluirTarefa(req.params.id);
        res.json({ ok: true, dados });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao excluir tarefa" });
    }
}
