
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



/* 
            Parte do login

*/ 



app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        // CHAMANDO A PROCEDURE DO BACK
        const sql = `CALL verificaLogin($1, $2);`;

        // O PostgreSQL só deixa CALL retornar resultado via SELECT após ela
        const resultado = await db.query(`SELECT verificaLogin($1, $2) AS tipo;`, [usuario, senha]);

        const tipoUsuario = resultado.rows[0]?.tipo;

        if (!tipoUsuario) {
            return res.json({
                sucesso: false,
                motivo: "credenciais_invalidas"
            });
        }

        // sucesso
        return res.json({
            sucesso: true,
            usuario: usuario,      // você pode trocar por user_nome no futuro
            tipo: tipoUsuario       // funcionario / veterinario / administrador
        });

    } catch (err) {
        console.error("ERRO LOGIN:", err);
        return res.status(500).json({ erro: "Erro no servidor" });
    }
});

app.listen(3000, () => console.log("Backend rodando na porta 3000"));