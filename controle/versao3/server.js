const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'granja',
    port: 5432
});

// ------ BERÇÁRIO ------

// Listar todos ou filtrar (nome/status)
app.get('/bercario', async (req, res) => {
    try {
        const resultado = await db.query(
            `SELECT * FROM buscaBercario($1, $2);`,
            [null, null] // NULL = não filtra
        );

        return res.json({
            sucesso: true,
            dados: resultado.rows
        });
    } catch (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ erro: "Erro ao buscar berçário" });
    }
});

// Criar ou editar
app.post('/bercario', async (req, res) => {
    const dados = req.body;
    console.log("📩 Dados recebidos no POST /bercario:", dados);

    try {
        if (dados.id) {
            // --- EDIÇÃO ---
            await db.query(
                `CALL editarRegistroBercario($1, $2, $3, $4, $5, $6, $7);`,
                [
                    dados.id,               // ⚠️ id primeiro
                    dados.loteNome,
                    dados.quantidadeLeitoes,
                    dados.dataNascimento,
                    dados.pesoMedio,
                    dados.dataDesmame,
                    dados.status
                ]
            );
            return res.json({ sucesso: true, operacao: "editado" });
        }

        // --- CRIAÇÃO ---
        await db.query(
            `CALL novoRegistroBercario($1, $2, $3, $4, $5, $6, $7);`,
            [
                dados.loteNome,
                dados.quantidadeLeitoes,
                dados.dataNascimento,
                dados.pesoMedio,
                dados.dataDesmame,
                dados.status,
                true // statusRegistro
            ]
        );
        return res.json({ sucesso: true, operacao: "criado" });

    } catch (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ erro: "Erro ao salvar berçário" });
    }
});

// Excluir
app.delete('/bercario/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const todos = await db.query(
            `SELECT * FROM buscaBercario($1, $2);`,
            [null, null]
        );

        const item = todos.rows.find(b => b.id == id);

        if (!item) {
            return res.json({ sucesso: false, motivo: "nao_encontrado" });
        }

        await db.query(
            `CALL excluirRegistroBercario($1);`,
            [item.id]
        );

        return res.json({ sucesso: true, operacao: "excluido" });

    } catch (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ erro: "Erro ao excluir berçário" });
    }
});



// ------ Servidor ------

app.listen(3000, () => console.log("Backend rodando na porta 3000"));

