// Local: /granja/granjaService.js

const { pool } = require('../login/database');

// --- Funções para Edifícios (Tarefa #19526) ---

/**
 * Cadastra um novo edifício no banco de dados.
 */
async function cadastrarEdificio(nome, tipo, capacidade) {
    const query = `
        INSERT INTO edificios_granja (nome, tipo, capacidade, data_cadastro) 
        VALUES ($1, $2, $3, NOW()) 
        RETURNING id
    `;
    try {
        const result = await pool.query(query, [nome, tipo, capacidade]);
        return { success: true, edificioId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao cadastrar edifício:', error);
        return { success: false, error: 'Erro interno ao cadastrar edifício.' };
    }
}

/**
 * Atualiza os dados de um edifício existente.
 */
async function editarEdificio(id, nome, tipo, capacidade) {
    const query = `
        UPDATE edificios_granja 
        SET nome = $1, tipo = $2, capacidade = $3 
        WHERE id = $4
        RETURNING id
    `;
    try {
        const result = await pool.query(query, [nome, tipo, capacidade, id]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Edifício não encontrado.' };
        }
        return { success: true, edificioId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao editar edifício:', error);
        return { success: false, error: 'Erro interno ao editar edifício.' };
    }
}

/**
 * Remove um edifício do banco de dados pelo ID.
 */
async function excluirEdificio(id) {
    const query = 'DELETE FROM edificios_granja WHERE id = $1 RETURNING id';
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Edifício não encontrado.' };
        }
        return { success: true, message: 'Edifício excluído com sucesso.' };
    } catch (error) {
        console.error('Erro ao excluir edifício:', error);
        return { success: false, error: 'Erro interno ao excluir edifício.' };
    }
}

/**
 * Busca e retorna a lista de todos os edifícios.
 */
async function consultarEdificios() {
    const query = 'SELECT id, nome, tipo, capacidade FROM edificios_granja ORDER BY nome';
    try {
        const result = await pool.query(query);
        return { success: true, edificios: result.rows };
    } catch (error) {
        console.error('Erro ao consultar edifícios:', error);
        return { success: false, error: 'Erro interno ao consultar edifícios.' };
    }
}


// --- Funções para Lotes e Setores (Tarefa #19529) ---

/**
 * Atualiza os dados de um lote específico.
 */
async function editarLote(id, nomeLote, setorId, outrosDados) {
    const query = `
        UPDATE lotes 
        SET nome = $1, setor_id = $2, outros_dados = $3 
        WHERE id = $4
        RETURNING id
    `;
    try {
        const result = await pool.query(query, [nomeLote, setorId, outrosDados, id]);
        return { success: true, loteId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao editar lote:', error);
        return { success: false, error: 'Erro interno ao editar lote.' };
    }
}

/**
 * Remove um lote do banco de dados pelo ID.
 */
async function excluirLote(id) {
    const query = 'DELETE FROM lotes WHERE id = $1 RETURNING id';
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Lote não encontrado.' };
        }
        return { success: true, message: 'Lote excluído com sucesso.' };
    } catch (error) {
        console.error('Erro ao excluir lote:', error);
        return { success: false, error: 'Erro interno ao excluir lote.' };
    }
}

/**
 * Atualiza os dados de um setor específico.
 */
async function editarSetor(id, nomeSetor, edificioId) {
    const query = `
        UPDATE setores 
        SET nome = $1, edificio_id = $2
        WHERE id = $3
        RETURNING id
    `;
    try {
        const result = await pool.query(query, [nomeSetor, edificioId, id]);
        return { success: true, setorId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao editar setor:', error);
        return { success: false, error: 'Erro interno ao editar setor.' };
    }
}

/**
 * Remove um setor do banco de dados pelo ID.
 */
async function excluirSetor(id) {
    const query = 'DELETE FROM setores WHERE id = $1 RETURNING id';
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Setor não encontrado.' };
        }
        return { success: true, message: 'Setor excluído com sucesso.' };
    } catch (error) {
        console.error('Erro ao excluir setor:', error);
        return { success: false, error: 'Erro interno ao excluir setor.' };
    }
}


module.exports = {
    cadastrarEdificio,
    editarEdificio,
    excluirEdificio,
    consultarEdificios,
    editarLote,
    excluirLote,
    editarSetor,
    excluirSetor
};