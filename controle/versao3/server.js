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



// SERVIDOR

app.listen(3000, () => console.log("Backend rodando na porta 3000"));

