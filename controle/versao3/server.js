const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');               // Necessário para lidar com caminhos de pastas
const { exec } = require('child_process');  // Necessário para abrir o navegador

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DO FRONT-END (VISÃO) ---

// Define onde está a pasta da View. 
// __dirname é a pasta atual (controle). '../view' sobe um nível e entra em view.
const pastaView = path.join(__dirname, '../../view');

// Diz ao Express para servir arquivos estáticos (CSS, JS, Imagens) dessa pasta
app.use(express.static(pastaView));

// Rota Raiz: Quando acessar http://localhost:3000/ entrega o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(pastaView, 'index.html'));
});

// --- FIM CONFIGURAÇÃO FRONT-END ---


// CONFIGURAÇÃO DO BANCO DE DADOS
const db = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'granja',
    port: 5432
});

// --- ROTAS DA API ---

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

    try {
        if (dados.id) {
            
            await db.query(
                `CALL editarRegistroBercario($1, $2, $3, $4, $5, $6, $7);`,
                [
                    dados.id,               
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

app.put('/bercario/:loteNome', async (req, res) => {
    const loteNome = req.params.loteNome;
    const dados = req.body;

    try {
        await db.query(
            `CALL editarRegistroBercario($1, $2, $3, $4, $5, $6, $7);`,
            [
                loteNome,               
                dados.qtdeLeitoes,
                dados.dataNascimento,
                dados.pesoMedio,
                dados.dataDesmame,
                dados.status,
                true                   
            ]
        );

        return res.json({ sucesso: true, operacao: "editado" });
    } catch (err) {
        console.error("ERRO SQL:", err);
        return res.status(500).json({ erro: "Erro ao editar berçário" });
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
        const { rows } = await db.query(`SELECT * FROM buscaContratos();`);
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
            `CALL novoRegistroContrato($1, $2, $3, $4);`,
            [fornecedor, objeto, dataInicio, dataVencimento]
        );

        return res.status(201).json({ sucesso: true, operacao: "criado" });
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

        await db.query(
            `CALL editarRegistroContrato($1, $2, $3, $4, $5);`,
            [id, fornecedor, objeto, dataInicio, dataVencimento]
        );

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

        await db.query(
            `CALL excluirRegistroContrato($1);`,
            [id]
        );

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
        await db.query(`CALL novoEventoCoberturaInseminacao($1, $2, $3, $4);`, [dataCobertura, matrizId, tipo, observacoes]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de inseminação." });
    }
});

app.post('/eventos/parto', async (req, res) => {
    const { data, matrizId, quantidadeNascidos, observacoes } = req.body;
    try {
        await db.query(`CALL novoEventoParto($1, $2, $3, $4);`, [data, matrizId, quantidadeNascidos, observacoes]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de parto." });
    }
});

app.post('/eventos/desmame', async (req, res) => {
    const { data, loteId, quantidadeDesmamados, observacoes } = req.body;
    try {
        await db.query(`CALL novoEventoDesmame($1, $2, $3, $4);`, [data, loteId, quantidadeDesmamados, observacoes]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de desmame." });
    }
});

app.post('/eventos/morte-femea', async (req, res) => {
    const { femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes } = req.body;
    try {
        await db.query(`CALL novoEventoMorteFemea($1, $2, $3, $4);`, [femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de morte de fêmea." });
    }
});

app.post('/eventos/morte-lote', async (req, res) => {
    const { loteData, loteIdLote, loteCausaMorte, loteObservacoes } = req.body;
    try {
        await db.query(`CALL novoEventoMorteLote($1, $2, $3, $4);`, [loteData, loteIdLote, loteCausaMorte, loteObservacoes]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao criar evento de morte de lote." });
    }
});

app.delete('/eventos/inseminacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirEventoCoberturaInseminacao($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de inseminação." });
    }
});

app.delete('/eventos/parto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirEventoParto($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de parto." });
    }
});

app.delete('/eventos/desmame/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirEventoDesmame($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de desmame." });
    }
});

app.delete('/eventos/morte-femea/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirEventoMorteFemea($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir evento de morte de fêmea." });
    }
});

app.delete('/eventos/morte-lote/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirEventoMorteLote($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
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
        await db.query(`CALL novoRegistroFinanceiro($1, $2, $3, $4, $5);`, [data, descricao, valor, tipo, categoria]);
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
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
        await db.query(`CALL editarRegistroFinanceiro($1, $2, $3, $4, $5, $6);`, [id, data, descricao, valor, tipo, categoria]);
        return res.json({ sucesso: true, operacao: "editado" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao editar registro financeiro." });
    }
});

app.delete('/financeiro/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirRegistroFinanceiro($1);`, [id]);
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao excluir registro financeiro." });
    }
});

app.get('/financeiro', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM buscaFinanceiro();`);
        return res.json({ sucesso: true, dados: rows });
    } catch (err) {
        return res.status(500).json({ sucesso: false, erro: "Erro ao buscar registros financeiros." });
    }
});

// GENÉTICAS
app.get('/geneticas', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM listagemFinalPaginaGeneticas();`);
        res.json({ sucesso: true, dados: rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar genéticas." });
    }
});

app.post('/geneticas', async (req, res) => {
    const g = req.body;
    try {
        if (g.id) {
            await db.query(`CALL editaRegistroGenetica($1, $2, $3, $4, $5);`, [g.id, g.nome, g.descricao, g.caracteristicas, g.status]);
            return res.json({ sucesso: true, operacao: "editado" });
        }
        await db.query(`CALL novoRegistroGenetica($1, $2, $3);`, [g.nome, g.descricao, g.caracteristicas]);
        res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar genética." });
    }
});

app.delete('/geneticas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`CALL excluirRegistroGenetica($1);`, [id]);
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir genética." });
    }
});

// INSEMINAÇÃO
app.get('/inseminacoes', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM buscaInseminacao(NULL, NULL);`);
        res.json({ sucesso: true, dados: rows });
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
        await db.query(`CALL excluirRegistroInseminacao($1);`, [id]);
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
        await db.query(`CALL excluirInsumos($1);`, [id]);
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir insumo." });
    }
});

app.get('/insumos/historico', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM historicoInsumos();`);
        res.json({ sucesso: true, dados: rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar histórico de insumos." });
    }
});

app.get('/insumos/estoque', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM estoqueInsumos();`);
        res.json({ sucesso: true, dados: rows });
    } catch (err) {
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar estoque de insumos." });
    }
});

// LOTES

app.get('/lotes', async (req, res) => {
    const { genetica, status } = req.query || {};
    try {
        const resultado = await db.query(
            `SELECT * FROM buscaPaginaLotes($1, $2)`,
            [genetica || null, status || null]
        );
        return res.json({ sucesso: true, dados: resultado.rows });
    } catch (err) {
        console.error("ERRO SQL GET /lotes:", err);
        return res.status(500).json({ erro: "Erro ao buscar lotes" });
    }
});

app.post('/lotes', async (req, res) => {
    const dados = req.body;
    try {
        await db.query(
            `CALL novolote($1, $2, $3, $4, $5)`,
            [
                dados.nome,
                dados.genetica,
                parseInt(dados.quantidade),
                dados.dataCriacao,            // formato 'YYYY-MM-DD'
                dados.status || 'ativo'
            ]
        );
        return res.json({ sucesso: true, operacao: "criado" });
    } catch (err) {
        console.error("ERRO SQL POST /lotes:", err);
        return res.status(500).json({ erro: "Erro ao salvar lote" });
    }
});

app.put('/lotes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const dados = req.body;
    try {
        await db.query(
            `CALL editalote($1, $2, $3, $4, $5, $6)`,
            [
                id,
                dados.nome,
                dados.genetica,
                parseInt(dados.quantidade),
                dados.dataCriacao,
                dados.status || 'ativo'
            ]
        );
        return res.json({ sucesso: true, operacao: "editado" });
    } catch (err) {
        console.error("ERRO SQL PUT /lotes/:id:", err);
        return res.status(500).json({ erro: "Erro ao editar lote" });
    }
});

app.delete('/lotes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query(
            `CALL excluirlote($1)`,
            [id]
        );
        return res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error("ERRO SQL DELETE /lotes/:id:", err);
        return res.status(500).json({ erro: "Erro ao excluir lote" });
    }
});

//MATERNIDADE


app.get('/maternidades', async (req, res) => {
    try {
        let { genetica, status } = req.query;
        genetica = (genetica === "" || genetica === "todos") ? null : genetica;
        status = (status === "" || status === "todos") ? null : status;

        const resultado = await db.query(
            `SELECT * FROM buscaMaternidade($1, $2);`,
            [genetica, status]
        );

        return res.json({ sucesso: true, dados: resultado.rows });
    } catch (err) {
        console.error("Erro ao buscar maternidades:", err);
        return res.status(500).json({ sucesso: false, erro: "Erro ao buscar maternidades." });
    }
});


app.post('/maternidades', async (req, res) => {
    const materData = req.body;

    try {
        if (materData.id) {
            await db.query(
                `CALL editarregistromaternidade($1, $2, $3, $4, $5, $6, $7);`,
                [
                    materData.id,
                    materData.brincoFemea,
                    materData.genetica,
                    materData.dataCobertura,
                    materData.dataPartoPrevisto,
                    materData.qtdeLeitoes,
                    materData.status || 'disponivel'
                ]
            );
            return res.json({ sucesso: true, operacao: "editado" });
        }

        await db.query(
            `CALL novoregistromaternidade($1, $2, $3, $4, $5, $6);`,
            [
                materData.brincoFemea,
                materData.genetica,
                materData.dataCobertura,
                materData.dataPartoPrevisto,
                materData.qtdeLeitoes,
                materData.status || 'disponivel'
            ]
        );

        res.json({ sucesso: true, operacao: "criado" });

    } catch (err) {
        console.error("Erro ao salvar maternidade:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar maternidade." });
    }
});

app.delete('/maternidades/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            `CALL excluirregistromaternidade($1);`,
            [id]
        );
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error("Erro ao excluir maternidade:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir maternidade." });
    }
});

// OCORRÊNCIAS

app.get('/ocorrencias', async (req, res) => {
    try {
        const dados = await db.query(
            `SELECT * FROM buscaocorrencias($1, $2, $3);`,
            [null, null, null]
        );
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao buscar ocorrências:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar ocorrências." });
    }
});

app.post('/ocorrencias', async (req, res) => {
    const oc = req.body;

    try {
        if (oc.id) {
            // Editar ocorrência
            await db.query(
                `CALL editarocorrencia($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);`,
                [
                    oc.id,
                    oc.lote,
                    oc.tipo,
                    oc.prioridade,
                    oc.data,
                    oc.hora,
                    oc.titulo,
                    oc.descricao,
                    oc.quantidadeAnimaisAfetados,
                    oc.medicamentoAplicado,
                    oc.dosagem,
                    oc.responsavel,
                    oc.proximasAcoes,
                    oc.status
                ]
            );
            return res.json({ sucesso: true, operacao: "editado" });
        }

        // Criar nova ocorrência
        await db.query(
            `CALL novaocorrencia($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);`,
            [
                oc.lote,
                oc.tipo,
                oc.prioridade,
                oc.data,
                oc.hora,
                oc.titulo,
                oc.descricao,
                oc.quantidadeAnimaisAfetados,
                oc.medicamentoAplicado,
                oc.dosagem,
                oc.responsavel,
                oc.proximasAcoes,
                oc.status
            ]
        );
        res.json({ sucesso: true, operacao: "criado" });

    } catch (err) {
        console.error("Erro ao salvar ocorrência:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar ocorrência." });
    }
});


app.delete('/ocorrencias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(`CALL excluirocorrencia($1);`, [id]);
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error("Erro ao excluir ocorrência:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir ocorrência." });
    }
});

app.get('/ocorrencias/lotes', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM listagemlotes();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao buscar lotes:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar lotes." });
    }
});

app.get('/ocorrencias/qtd-criticas', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM quantidadeocorrenciascriticas();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao buscar ocorrências críticas:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar ocorrências críticas." });
    }
});

app.get('/ocorrencias/qtd-pendentes', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM quantidadeocorrenciaspendentes();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao buscar ocorrências pendentes:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar ocorrências pendentes." });
    }
});

app.get('/ocorrencias/qtd-resolvidas-hoje', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM quantidadeocorrenciasresolvidashoje();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao buscar ocorrências resolvidas hoje:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar ocorrências resolvidas hoje." });
    }
});

//USUÁRIOS

app.get('/usuarios', async (req, res) => {
    try {
        const dados = await db.query(`SELECT * FROM buscausuarios();`);
        res.json({ sucesso: true, dados: dados.rows });
    } catch (err) {
        console.error("Erro ao listar usuários:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao buscar usuários." });
    }
});


app.post('/usuarios', async (req, res) => {
    const u = req.body;

    try {
        // EDITAR USUÁRIO
        if (u.old_nickname) {
            await db.query(
                `CALL editarregistrousuario($1,$2,$3,$4,$5);`,
                [
                    u.old_nickname,
                    u.new_nickname,
                    u.new_nome,
                    u.new_tipo,
                    u.new_senha
                ]
            );
            return res.json({ sucesso: true, operacao: "editado" });
        }

        // CRIAR USUÁRIO
        await db.query(
            `CALL novoregistrousuario($1,$2,$3,$4);`,
            [
                u.nickname,
                u.nome,
                u.tipo,
                u.senha
            ]
        );

        res.json({ sucesso: true, operacao: "criado" });

    } catch (err) {
        console.error("Erro ao salvar usuário:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar usuário." });
    }
});

app.delete('/usuarios/:nickname', async (req, res) => {
    const { nickname } = req.params;

    try {
        await db.query(`CALL excluirregistrousuario($1);`, [nickname]);
        res.json({ sucesso: true, operacao: "excluido" });
    } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        res.status(500).json({ sucesso: false, erro: "Erro ao excluir usuário." });
    }
});

//TAREFAS

app.get('/tarefas', async (req, res) => {
   try {
       const dados = await db.query(`SELECT * FROM buscatarefas();`);
       res.json({ sucesso: true, dados: dados.rows });
   } catch (err) {
       console.error("Erro ao listar tarefas:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao listar tarefas." });
   }
});

app.post('/tarefas', async (req, res) => {
   const t = req.body;


   try {
       await db.query(
           `CALL novoregistrotarefa($1,$2,$3,$4,$5);`,
           [
               t.titulo,
               t.descricao,
               t.usuariresponsavel,
               t.prioridade,
               t.status
           ]
       );


       res.json({ sucesso: true, operacao: "criado" });


   } catch (err) {
       console.error("Erro ao criar tarefa:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao criar tarefa." });
   }
});


app.put('/tarefas/:id', async (req, res) => {
   const { id } = req.params;
   const t = req.body;


   try {
       await db.query(
           `CALL editarregistrotarefa($1,$2,$3,$4,$5,$6);`,
           [
               id,
               t.titulo,
               t.descricao,
               t.usuariresponsavel,
               t.prioridade,
               t.status
           ]
       );


       res.json({ sucesso: true, operacao: "editado" });


   } catch (err) {
       console.error("Erro ao atualizar tarefa:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao atualizar tarefa." });
   }
});


app.delete('/tarefas/:id', async (req, res) => {
   const { id } = req.params;


   try {
       await db.query(`CALL excluirregistrotarefa($1);`, [id]);
       res.json({ sucesso: true, operacao: "excluido" });


   } catch (err) {
       console.error("Erro ao excluir tarefa:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao excluir tarefa." });
   }
});


app.post('/tarefas/concluir/:id', async (req, res) => {
   const { id } = req.params;


   try {
       await db.query(`CALL concluirtarefa($1);`, [id]);
       res.json({ sucesso: true, operacao: "concluida" });


   } catch (err) {
       console.error("Erro ao concluir tarefa:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao concluir tarefa." });
   }
});


app.get('/tarefas/minhas/:usuario', async (req, res) => {
   const { usuario } = req.params;


   try {
       const dados = await db.query(
           `SELECT * FROM minhastarefas($1);`,
           [usuario]
       );


       res.json({ sucesso: true, dados: dados.rows });


   } catch (err) {
       console.error("Erro ao buscar minhas tarefas:", err);
       res.status(500).json({ sucesso: false, erro: "Erro ao buscar tarefas do usuário." });
   }
});


app.get('/api/tarefas', async (req, res) => {
    try {
        const sql = `SELECT * FROM buscatarefas()`;
        const resultado = await db.query(sql);
        res.json({ ok: true, resultado: resultado.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao listar tarefas" });
    }
});


app.post('/api/tarefas', async (req, res) => {
    try {
        const { titulo, descricao, usuarioresponsavel, prioridade, status } = req.body;


        const sql = `
            call novoregistrotarefa($1,$2,$3,$4,$5)
        `;


        const resultado = await db.query(sql, [
            titulo,
            descricao,
            usuarioresponsavel,
            prioridade,
            status
        ]);


        res.json({ ok: true, resultado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao criar tarefa" });
    }
});


app.put('/api/tarefas/:id', async (req, res) => {
    try {
        const { titulo, descricao, usuarioresponsavel, prioridade, status } = req.body;


        const sql = `
            call editarregistrotarefa($1,$2,$3,$4,$5,$6)
        `;


        const resultado = await db.query(sql, [
            req.params.id,
            titulo,
            descricao,
            usuarioresponsavel,
            prioridade,
            status
        ]);


        res.json({ ok: true, resultado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao atualizar tarefa" });
    }
});


app.delete('/api/tarefas/:id', async (req, res) => {
    try {
        const sql = `call excluirregistrotarefa($1)`;
        const resultado = await db.query(sql, [req.params.id]);


        res.json({ ok: true, resultado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao excluir tarefa" });
    }
});



app.post('/api/tarefas/:id/concluir', async (req, res) => {
    try {
        const sql = `call concluirtarefa($1)`;
        const resultado = await db.query(sql, [req.params.id]);


        res.json({ ok: true, resultado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao concluir tarefa" });
    }
});

app.get('/api/tarefas/me/:usuario', async (req, res) => {
    try {
        const sql = `SELECT * FROM minhaterefas($1)`;
        const resultado = await db.query(sql, [req.params.usuario]);


        res.json({ ok: true, resultado: resultado.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar tarefas do usuário" });
    }
});


// RELATÓRIOS

// --- resumo inicial da página ---
app.get('/api/relatorios/resumo', async (req, res) => {
    try {
        const resultado = {
            geneticas: (await db.query("SELECT quantidadegeneticasativas() AS v")).rows[0].v,
            lotesAtivos: (await db.query("SELECT quantidadelotesativos() AS v")).rows[0].v,
            animaisAtivos: (await db.query("SELECT quantidadeanimaisativos() AS v")).rows[0].v,
            quarentena: (await db.query("SELECT quantidadelotesquarentenados() AS v")).rows[0].v,
            bercario: (await db.query("SELECT quantidadeleitoesbercario() AS v")).rows[0].v,
            gestantes: (await db.query("SELECT quantidadeporcasgestantes() AS v")).rows[0].v,
            lactantes: (await db.query("SELECT quantidadeporcaslactantes() AS v")).rows[0].v,
            inseminacoesPendentes: (await db.query("SELECT quantidadeinseminacoespendentes() AS v")).rows[0].v
        };

        res.json({ ok: true, resultado });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar resumo" });
    }
});


// --- busca de relatórios (partos/desmames) ---
app.get('/api/relatorios', async (req, res) => {
    try {
        const { tipo, dataIni, dataFim } = req.query;

        if (!tipo || (tipo !== "partos" && tipo !== "desmames")) {
            return res.status(400).json({ ok: false, erro: "Tipo inválido. Use: partos | desmames" });
        }

        const query = `
            SELECT * FROM buscarelatorios($1, $2, $3)
        `;

        const params = [
            tipo,
            dataIni || null,
            dataFim || null
        ];

        const resultado = await db.query(query, params);

        res.json({ ok: true, resultado: resultado.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: "Erro ao buscar relatório" });
    }
});





// --- INICIALIZAÇÃO DO SERVIDOR COM AUTO-OPEN ---
app.listen(5000, () => {
    console.log(" Backend rodando na porta 5000");
   

    // Lógica para abrir o navegador automaticamente
    const url = 'http://localhost:5000';
    
    // Identifica o comando correto baseado no Sistema Operacional
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    
    // Executa o comando
    exec(`${start} ${url}`, (error) => {
        if (error) {
            console.log("Não foi possível abrir o navegador automaticamente. Por favor, abra manualmente.");
        }
    });
});
