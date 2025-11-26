"use strict";

import {
    novoRegistroUsuario,
    editarRegistroUsuario,
    excluirRegistroUsuario,
    buscaUsuarios
} from "../../modelo/versao3/man/manUsuarios.sql";


// ---listar usuarios---
export async function controleListarUsuarios(req, res) {
    try {
        const resultado = await buscaUsuarios();
        res.json({ ok: true, dados: resultado });
    } catch (err) {
        console.error("Erro ao listar usuarios:", err);
        res.status(500).json({ ok: false, erro: "Erro no backend ao buscar usuarios." });
    }
}


//--- criar usuario ---
export async function controleCriarUsuario(req, res) {
    try {
        const { nickname, nome, tipo, senha } = req.body;

        const resultado = await novoRegistroUsuario(
            nickname,
            nome,
            tipo,
            senha
        );

        res.json({ ok: true, dados: resultado });

    } catch (err) {
        console.error("Erro ao criar usuario:", err);
        res.status(500).json({ ok: false, erro: "Erro no backend ao criar usuario." });
    }
}



// ---editar usuario---

export async function controleEditarUsuario(req, res) {
    try {
        const {
            old_nickname,
            new_nickname,
            new_nome,
            new_tipo,
            new_senha
        } = req.body;

        const resultado = await editarRegistroUsuario(
            old_nickname,
            new_nickname,
            new_nome,
            new_tipo,
            new_senha
        );

        res.json({ ok: true, dados: resultado });

    } catch (err) {
        console.error("Erro ao editar usuario:", err);
        res.status(500).json({ ok: false, erro: "Erro no backend ao editar usuario." });
    }
}


// --- excluir usuario---
export async function controleExcluirUsuario(req, res) {
    try {
        const { nickname } = req.params;

        const resultado = await excluirRegistroUsuario(nickname);

        res.json({ ok: true, dados: resultado });

    } catch (err) {
        console.error("Erro ao excluir usuario:", err);
        res.status(500).json({ ok: false, erro: "Erro no backend ao excluir usuario." });
    }
}
