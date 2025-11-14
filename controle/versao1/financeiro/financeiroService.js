const { pool } = require('../login/database');

// 1. Função para lançar uma nova movimentação financeira
async function lancarMovimentacao(tipoMovimentacao, descricao, valor, usuarioId, dataMovimento = new Date(), referenciaId = null) {
    try {
        if (!valor || valor === 0) {
            return { success: false, error: 'O valor da movimentação deve ser válido e diferente de zero.' };
        }
        
        const result = await pool.query(
            `INSERT INTO movimentacoes_financeiras 
            (tipo_movimentacao, descricao, valor, usuario_id, data_movimento, referencia_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [tipoMovimentacao, descricao, valor, usuarioId, dataMovimento, referenciaId]
        );
        return { success: true, movimentoId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao lançar movimentação financeira:', error);
        return { success: false, error: 'Erro interno ao lançar movimentação.' };
    }
}

// 2. Função para consultar o extrato de movimentações
async function consultarExtrato(tipo = null, dataInicio = null, dataFim = null) {
    let query = `
        SELECT
            mf.id,
            mf.tipo_movimentacao,
            mf.descricao,
            mf.valor,
            TO_CHAR(mf.data_movimento, 'DD/MM/YYYY') AS data,
            u.username AS lancado_por
        FROM movimentacoes_financeiras mf
        JOIN usuarios u ON mf.usuario_id = u.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (tipo) {
        query += ` AND mf.tipo_movimentacao = $${paramIndex++}`;
        params.push(tipo);
    }
    if (dataInicio) {
        query += ` AND mf.data_movimento >= $${paramIndex++}`;
        params.push(dataInicio);
    }
    if (dataFim) {
        query += ` AND mf.data_movimento <= $${paramIndex++}`;
        params.push(dataFim);
    }

    query += ' ORDER BY mf.data_movimento DESC';

    try {
        const result = await pool.query(query, params);
        return { success: true, extrato: result.rows };
    } catch (error) {
        console.error('Erro ao consultar extrato financeiro:', error);
        return { success: false, error: 'Erro interno ao consultar extrato.' };
    }
}

// 3. Função para calcular o saldo total
async function calcularSaldoTotal() {
    const query = `
        SELECT COALESCE(SUM(valor), 0) AS saldo_atual
        FROM movimentacoes_financeiras;
    `;
    try {
        const result = await pool.query(query);
        return { success: true, saldo: result.rows[0].saldo_atual };
    } catch (error) {
        console.error('Erro ao calcular saldo:', error);
        return { success: false, error: 'Erro interno ao calcular saldo.' };
    }
}

module.exports = { 
    lancarMovimentacao, 
    consultarExtrato, 
    calcularSaldoTotal 
};