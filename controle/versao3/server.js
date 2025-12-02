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
// EVENTOS

app.post('/eventos/inseminacao', async (req, res) => {
    const { dataCobertura, matrizId, tipo, observacoes } = req.body;
    try {
        await db.query(
            `INSERT INTO eventocoberturainseminacao
                (cobert_datacobertura, cobert_matrizid, cobert_tipo, cobert_observacoes, cobert_statusregistro)
             VALUES ($1, $2, $3, $4, true)
             RETURNING cobert_id;`,
            [dataCobertura, matrizId, tipo, observacoes]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de inseminação." });
    }
});

app.post('/eventos/parto', async (req, res) => {
    const { data, matrizId, quantidadeNascidos, observacoes } = req.body;
    try {
        await db.query(
            `INSERT INTO eventoparto
                (parto_data, parto_matrizid, parto_quantidadenascidos, parto_observacoes, parto_statusregistro)
             VALUES ($1, $2, $3, $4, true)
             RETURNING parto_id;`,
            [data, matrizId, quantidadeNascidos, observacoes]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de parto." });
    }
});

app.post('/eventos/desmame', async (req, res) => {
    const { data, loteId, quantidadeDesmamados, observacoes } = req.body;
    try {
        await db.query(
            `INSERT INTO eventodesmame
                (desm_data, desm_loteid, desm_quantidadedesmamados, desm_observacoes, desm_statusregistro)
             VALUES ($1, $2, $3, $4, true)
             RETURNING desm_id;`,
            [data, loteId, quantidadeDesmamados, observacoes]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de desmame." });
    }
});

app.post('/eventos/morte-femea', async (req, res) => {
    const { femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes } = req.body;
    try {
        await db.query(
            `INSERT INTO eventomortalidadefemea
                (mort_femeadata, mort_femeaidmatriz, mort_femeacausamorte, mort_femeaobservacoes, mort_femeastatusregistro)
             VALUES ($1, $2, $3, $4, true)
             RETURNING mort_femeaid;`,
            [femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de morte de fêmea." });
    }
});

app.post('/eventos/morte-lote', async (req, res) => {
    const { loteData, loteIdLote, loteCausaMorte, loteObservacoes } = req.body;
    try {
        await db.query(
            `INSERT INTO eventomortalidadelote
                (mort_lotedata, mort_loteidlote, mort_lotecausamorte, mort_loteobservacoes, mort_lotestatusregistro)
             VALUES ($1, $2, $3, $4, true)
             RETURNING mort_loteid;`,
            [loteData, loteIdLote, loteCausaMorte, loteObservacoes]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de morte de lote." });
    }
});

app.delete('/eventos/inseminacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            `SELECT cobert_id FROM eventocoberturainseminacao WHERE cobert_id = $1;`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado." });

        await db.query(`CALL excluirEventoCoberturaInseminacao($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de inseminação." });
    }
});

app.delete('/eventos/parto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            `SELECT parto_id FROM eventoparto WHERE parto_id = $1;`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado." });

        await db.query(`CALL excluirEventoParto($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de parto." });
    }
});

app.delete('/eventos/desmame/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            `SELECT desm_id FROM eventodesmame WHERE desm_id = $1;`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado." });

        await db.query(`CALL excluirEventoDesmame($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de desmame." });
    }
});

app.delete('/eventos/morte-femea/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            `SELECT mort_femeaid FROM eventomortalidadefemea WHERE mort_femeaid = $1;`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado." });

        await db.query(`CALL excluirEventoMorteFemea($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de morte de fêmea." });
    }
});

app.delete('/eventos/morte-lote/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            `SELECT mort_loteid FROM eventomortalidadelote WHERE mort_loteid = $1;`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado." });

        await db.query(`CALL excluirEventoMorteLote($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de morte de lote." });
    }
});

//FINANCEIRO

app.post('/financeiro', async (req, res) => {
    const { data, descricao, valor, tipo, categoria } = req.body;

    if (!data || !descricao || !valor || !tipo || !categoria) {
        return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando." });
    }

    try {
        await db.query(
            `CALL novoRegistroFinanceiro($1, $2, $3, $4, $5);`,
            [data, descricao, valor, tipo, categoria]
        );

        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error("Erro ao criar registro financeiro:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar registro financeiro." });
    }
});

app.put('/financeiro/:id', async (req, res) => {
    const { id } = req.params;
    const { data, descricao, valor, tipo, categoria } = req.body;

    if (!id) return res.status(400).json({ sucesso: false, erro: "ID é obrigatório." });
    if (!data || !descricao || !valor || !tipo || !categoria) {
        return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios faltando." });
    }

    try {
        const { rowCount } = await db.query(
            `CALL editarRegistroFinanceiro($1, $2, $3, $4, $5, $6);`,
            [id, data, descricao, valor, tipo, categoria]
        );

        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
        }

        return res.json({ sucesso: true, operacao: "editado" });
    } catch (err) {
        console.error("Erro ao editar registro financeiro:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao editar registro financeiro." });
    }
});

app.delete('/financeiro/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await db.query(
            `SELECT 1 FROM financeiro WHERE finan_id = $1;`,
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
        }

        await db.query(
            `CALL excluirRegistroFinanceiro($1);`,
            [id]
        );

        res.json({ sucesso: true, operacao: "excluido" });

    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir registro financeiro." });
    }
});


app.get('/financeiro', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM financeiro ORDER BY finan_id;`);
        return res.json({ sucesso: true, dados: rows });
    } catch (err) {
        console.error("Erro ao buscar registros financeiros:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao buscar registros financeiros." });
    }
});

// GENÉTICAS

app.get('/geneticas', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM geneticas WHERE gen_statusregistro = true;`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar genéticas." });
    }
});

app.post('/geneticas', async (req, res) => {
    const g = req.body;
    try {
        if (g.id) {
            const { rowCount } = await db.query(
                `UPDATE geneticas
                 SET gen_nome=$1, gen_descricao=$2, gen_caracteristicas=$3, gen_status=$4
                 WHERE gen_id=$5 AND gen_statusregistro = true;`,
                [g.nome, g.descricao, g.caracteristicas, g.status, g.id]
            );
            if (rowCount === 0) return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
            return res.json({ sucesso: true, operacao: "editado" });
        }

        await db.query(
            `INSERT INTO geneticas (gen_nome, gen_descricao, gen_caracteristicas, gen_status, gen_statusregistro)
             VALUES ($1, $2, $3, $4, true);`,
            [g.nome, g.descricao, g.caracteristicas, g.status]
        );

        res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar genética." });
    }
});

app.delete('/geneticas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { rowCount } = await db.query(
            `UPDATE geneticas SET gen_statusregistro=false WHERE gen_id=$1 AND gen_statusregistro = true;`,
            [id]
        );
        if (rowCount === 0) return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir genética." });
    }
});

// INSEMINAÇÃO

app.get('/inseminacoes', async (req, res) => {
    try {
        const dados = await db.query(
            `SELECT insem_id, insem_brincofemea, insem_geneticamacho, insem_datainseminacao, insem_tecnica, insem_resultado, insem_dataverificacao 
             FROM inseminacao 
             WHERE insem_statusregistro = true 
             ORDER BY insem_datainseminacao DESC;`
        );
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar inseminações." });
    }
});

app.post('/inseminacoes', async (req, res) => {
    const insData = req.body;
    try {
        if (insData.id) {
            await db.query(
                `CALL editarRegistroInseminacao($1, $2, $3, $4, $5, $6, $7);`,
                [
                    insData.id,
                    insData.brincoFemea,
                    insData.geneticaMacho,
                    insData.dataInseminacao,
                    insData.tecnica,
                    insData.resultado,
                    insData.dataVerificacao
                ]
            );
            return res.json({ sucesso: true, operacao: "editado" });
        }

        await db.query(
            `CALL novoRegistroInseminacao($1, $2, $3, $4, $5, $6);`,
            [
                insData.brincoFemea,
                insData.geneticaMacho,
                insData.dataInseminacao,
                insData.tecnica,
                insData.resultado,
                insData.dataVerificacao
            ]
        );
        res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar inseminação." });
    }
});

app.delete('/inseminacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await db.query(
            `UPDATE inseminacao SET insem_statusregistro = false WHERE insem_id = $1 AND insem_statusregistro = true;`,
            [id]
        );
        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
        }
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir inseminação." });
    }
});

// INSUMOS 
app.post('/insumos', async (req, res) => {
    const { nome, dataCompra, quantidade, nomeFornecedor, custoTotal, statusRegistro } = req.body;

    try {
        await db.query(
            `CALL comprarInsumos($1, $2, $3, $4, $5, $6);`,
            [nome, dataCompra, quantidade, nomeFornecedor, custoTotal, statusRegistro]
        );

        res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao registrar compra de insumos." });
    }
});

app.delete('/insumos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await db.query(
            `UPDATE insumos SET insu_statusregistro = false WHERE insu_id = $1 AND insu_statusregistro = true;`,
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ sucesso: false, erro: "Registro não encontrado." });
        }

        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir insumo." });
    }
});

app.get('/insumos/historico', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM historicoInsumos();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar histórico de insumos." });
    }
});

app.get('/insumos/estoque', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM estoqueInsumos();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar estoque de insumos." });
    }
});



// SERVIDOR

app.listen(3000, () => console.log("Backend rodando na porta 3000"));

