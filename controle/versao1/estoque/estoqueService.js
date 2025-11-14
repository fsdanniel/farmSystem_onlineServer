const { pool } = require('../login/database');

// 1. Função para registrar um novo tipo de insumo
async function registrarInsumo(nome, unidadeMedida) {
    try {
        const result = await pool.query(
            'INSERT INTO insumos (nome, unidade_medida) VALUES ($1, $2) RETURNING id',
            [nome, unidadeMedida]
        );
        return { success: true, insumoId: result.rows[0].id };
    } catch (error) {
        // Assume-se '23505' para unique violation (insumo já existe)
        if (error.code === '23505') {
            return { success: false, error: 'Insumo com este nome já existe.' };
        }
        console.error('Erro ao registrar insumo:', error);
        return { success: false, error: 'Erro interno ao registrar insumo.' };
    }
}

// 2. Função para registrar uma movimentação de rstoque
async function registrarMovimentacaoEstoque(insumoId, tipoMovimento, quantidade, usuarioId, observacao = null) {
    try {
        if (quantidade <= 0) {
            return { success: false, error: 'Quantidade deve ser positiva.' };
        }
        
        const result = await pool.query(
            `INSERT INTO movimentacoes_estoque 
            (insumo_id, tipo, quantidade, usuario_id, observacao) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [insumoId, tipoMovimento, quantidade, usuarioId, observacao]
        );
        return { success: true, movimentoId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao registrar movimentação de estoque:', error);
        // Pode ser erro de FK (insumoId ou usuarioId inválido)
        return { success: false, error: 'Erro interno ao registrar movimentação.' };
    }
}


// 3. Função para consultar o estoque atual consolidado
async function consultarEstoqueAtual() {
    const query = `
        SELECT
            i.nome,
            i.unidade_medida,
            -- Soma a quantidade se for 'Entrada' ou 'Ajuste_Positivo', subtrai se for 'Saída' ou 'Ajuste_Negativo'
            COALESCE(SUM(
                CASE 
                    WHEN me.tipo LIKE 'Entrada%' OR me.tipo LIKE 'Ajuste_Positivo' THEN me.quantidade
                    ELSE -me.quantidade
                END
            ), 0) AS quantidade_atual
        FROM insumos i
        LEFT JOIN movimentacoes_estoque me ON i.id = me.insumo_id
        GROUP BY i.id, i.nome, i.unidade_medida
        ORDER BY i.nome;
    `;
    try {
        const result = await pool.query(query);
        return { success: true, estoque: result.rows };
    } catch (error) {
        console.error('Erro ao consultar estoque:', error);
        return { success: false, error: 'Erro interno ao consultar estoque.' };
    }
}

module.exports = { 
    registrarInsumo, 
    registrarMovimentacaoEstoque, 
    consultarEstoqueAtual 
};