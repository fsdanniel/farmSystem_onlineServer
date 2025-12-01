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

// LOGIN
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ sucesso: false, motivo: "usuario_ou_senha_faltando" });
    }

    try {
        const resultado = await db.query(
            `SELECT verificaLogin($1, $2) AS tipo;`,
            [usuario, senha]
        );

        const tipoUsuario = resultado.rows[0]?.tipo;

        if (!tipoUsuario) {
            return res.json({
                sucesso: false,
                motivo: "credenciais_invalidas"
            });
        }

        return res.json({
            sucesso: true,
            usuario: usuario,
            tipo: tipoUsuario
        });

    } catch (err) {
        console.error("ERRO LOGIN:", err);
        return res.status(500).json({ erro: "Erro no servidor" });
    }
});


// BERÇÁRIO

app.get('/bercario', async (req, res) => {
    try {
        const resultado = await db.query(
            `SELECT * FROM buscaBercario($1, $2);`,
            [null, null] 
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

app.post('/bercario', async (req, res) => {
    const dados = req.body;
    console.log("📩 Dados recebidos no POST /bercario:", dados);

    try {
        if (dados.id) {
            
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

        
        await db.query(
            `CALL novoRegistroBercario($1, $2, $3, $4, $5, $6, $7);`,
            [
                dados.loteNome,
                dados.quantidadeLeitoes,
                dados.dataNascimento,
                dados.pesoMedio,
                dados.dataDesmame,
                dados.status,
                true 
            ]
        );
        return res.json({ sucesso: true, operacao: "criado" });

    } catch (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ erro: "Erro ao salvar berçário" });
    }
});


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
// CONTRATOS

app.get('/contratos', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM contratos ORDER BY cont_id;`);
        return res.status(200).json({ sucesso: true, dados: rows });
    } catch (err) {
        console.error("Erro ao buscar contratos:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao buscar contratos." });
    }
});

app.post('/contratos', async (req, res) => {
    try {
        const { fornecedor, objeto, dataInicio, dataVencimento } = req.body;

        if (!fornecedor || !objeto || !dataInicio || !dataVencimento) {
            return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando." });
        }

        if (new Date(dataInicio) > new Date(dataVencimento)) {
            return res.status(400).json({ sucesso: false, erro: "Data de início não pode ser maior que a data de vencimento." });
        }

        const { rows } = await db.query(
            `INSERT INTO contratos
                (cont_fornecedor, cont_objeto, cont_dataInicio, cont_dataVencimento, cont_status, cont_statusregistro)
             VALUES ($1, $2, $3, $4, 'futuro', true)
             RETURNING cont_id;`,
            [fornecedor, objeto, dataInicio, dataVencimento]
        );

        return res.status(201).json({ sucesso: true, operacao: "criado", cont_id: rows[0].cont_id });
    } catch (err) {
        console.error("Erro ao criar contrato:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar contrato." });
    }
});

app.put('/contratos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fornecedor, objeto, dataInicio, dataVencimento } = req.body;

        if (!id) return res.status(400).json({ sucesso: false, erro: "ID é obrigatório." });
        if (!fornecedor || !objeto || !dataInicio || !dataVencimento) {
            return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando." });
        }
        if (new Date(dataInicio) > new Date(dataVencimento)) {
            return res.status(400).json({ sucesso: false, erro: "Data de início não pode ser maior que a data de vencimento." });
        }

        const { rowCount } = await db.query(
            `UPDATE contratos
             SET cont_fornecedor = $1, cont_objeto = $2, cont_dataInicio = $3, cont_dataVencimento = $4
             WHERE cont_id = $5;`,
            [fornecedor, objeto, dataInicio, dataVencimento, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Contrato não encontrado." });
        }

        return res.status(200).json({ sucesso: true, operacao: "editado" });
    } catch (err) {
        console.error("Erro ao editar contrato:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao editar contrato." });
    }
});

app.delete('/contratos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ sucesso: false, erro: "ID é obrigatório." });

        const { rowCount } = await db.query(
            `DELETE FROM contratos WHERE cont_id = $1;`,
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Contrato não encontrado." });
        }

        return res.status(200).json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error("Erro ao excluir contrato:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir contrato." });
    }
});


// SERVIDOR

app.listen(3000, () => console.log("Backend rodando na porta 3000"));

