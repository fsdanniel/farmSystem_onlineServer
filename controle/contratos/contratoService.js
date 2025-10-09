const { pool } = require('../login/database');

// 1. Função para tgistrar um novo fornecedor
async function registrarFornecedor(nome, cnpj, contato) {
    try {
        const result = await pool.query(
            'INSERT INTO fornecedores (nome, cnpj, contato) VALUES ($1, $2, $3) RETURNING id',
            [nome, cnpj, contato]
        );
        return { success: true, fornecedorId: result.rows[0].id };
    } catch (error) {
        // Assume-se que '23505' é o código de erro de violação de restrição UNIQUE no PostgreSQL (ex: CNPJ duplicado)
        if (error.code === '23505') {
            return { success: false, error: 'CNPJ ou Nome do fornecedor já existe.' };
        }
        console.error('Erro ao registrar fornecedor:', error);
        return { success: false, error: 'Erro interno ao registrar fornecedor.' };
    }
}

// 2. Função para Registrar um novo contrato de fornecimento
async function registrarContrato(fornecedorId, descricao, dataInicio, dataFim, valorTotal, status) {
    try {
        const result = await pool.query(
            'INSERT INTO contratos_fornecimento (fornecedor_id, descricao, data_inicio, data_fim, valor_total, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [fornecedorId, descricao, dataInicio, dataFim, valorTotal, status]
        );
        return { success: true, contratoId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao registrar contrato:', error);
        return { success: false, error: 'Erro interno ao registrar contrato.' };
    }
}

// 3. Função para consultar contratos ativos
async function consultarContratos(statusFiltro = 'Ativo') {
    try {
        let query = `
            SELECT
                c.id,
                f.nome AS fornecedor_nome,
                c.descricao,
                TO_CHAR(c.data_inicio, 'DD/MM/YYYY') AS data_inicio,
                TO_CHAR(c.data_fim, 'DD/MM/YYYY') AS data_fim,
                c.valor_total,
                c.status
            FROM contratos_fornecimento c
            JOIN fornecedores f ON c.fornecedor_id = f.id
        `;
        const params = [];

        if (statusFiltro) {
            query += ' WHERE c.status = $1';
            params.push(statusFiltro);
        }

        query += ' ORDER BY c.data_inicio DESC';

        const result = await pool.query(query, params);
        return { success: true, contratos: result.rows };
    } catch (error) {
        console.error('Erro ao consultar contratos:', error);
        return { success: false, error: 'Erro interno ao consultar contratos.' };
    }
}

module.exports = {
    registrarFornecedor,
    registrarContrato,
    consultarContratos
};