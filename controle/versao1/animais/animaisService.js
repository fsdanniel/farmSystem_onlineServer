// Local: /animais/animaisService.js

const { pool } = require('../login/database');

// --- Funções para Inseminação (Tarefa #19528) ---

/**
 * Registra um novo evento de inseminação.
 */
async function registrarInseminacao(animalId, dataInseminacao, reprodutorId, responsavelId) {
    const query = `
        INSERT INTO historico_inseminacoes (animal_id, data_inseminacao, reprodutor_id, responsavel_usuario_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    try {
        const result = await pool.query(query, [animalId, dataInseminacao, reprodutorId, responsavelId]);
        return { success: true, inseminacaoId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao registrar inseminação:', error);
        return { success: false, error: 'Erro interno ao registrar inseminação.' };
    }
}

/**
 * Busca o histórico de inseminações (de um animal ou de todos).
 */
async function consultarHistoricoInseminacao(animalId = null) {
    let query = `
        SELECT hi.id, hi.data_inseminacao, a.identificacao AS animal, r.identificacao AS reprodutor, u.username AS responsavel
        FROM historico_inseminacoes hi
        JOIN animais a ON hi.animal_id = a.id
        JOIN animais r ON hi.reprodutor_id = r.id
        JOIN usuarios u ON hi.responsavel_usuario_id = u.id
    `; 
    
    const params = [];
    
    if (animalId) {
        query += ' WHERE hi.animal_id = $1';
        params.push(animalId);
    }
    
    query += ' ORDER BY hi.data_inseminacao DESC';

    try {
        const result = await pool.query(query, params);
        return { success: true, historico: result.rows };
    } catch (error) {
        console.error('Erro ao consultar histórico de inseminações:', error);
        return { success: false, error: 'Erro interno ao consultar histórico.' };
    }
}


// --- Funções para Genética (Tarefa #19527) ---

/**
 * Adiciona ou modifica a informação genética de um animal.
 */
async function atualizarInfoGenetica(animalId, dadosGeneticos) {
    const query = `
        UPDATE animais
        SET info_genetica = $1 
        WHERE id = $2
        RETURNING id
    `;
    
    try {
        const result = await pool.query(query, [dadosGeneticos, animalId]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Animal não encontrado.' };
        }
        return { success: true, animalId: result.rows[0].id };
    } catch (error) {
        console.error('Erro ao atualizar info genética:', error);
        return { success: false, error: 'Erro interno ao atualizar info genética.' };
    }
}

/**
 * Busca a informação genética de um animal específico.
 */
async function consultarInfoGenetica(animalId) {
    const query = 'SELECT id, identificacao, info_genetica FROM animais WHERE id = $1';
    try {
        const result = await pool.query(query, [animalId]);
        if (result.rowCount === 0) {
            return { success: false, error: 'Animal não encontrado.' };
        }
        return { success: true, genetica: result.rows[0] };
    } catch (error) {
        console.error('Erro ao consultar info genética:', error);
        return { success: false, error: 'Erro interno ao consultar info genética.' };
    }
}

module.exports = {
    registrarInseminacao,
    consultarHistoricoInseminacao,
    atualizarInfoGenetica,
    consultarInfoGenetica
};