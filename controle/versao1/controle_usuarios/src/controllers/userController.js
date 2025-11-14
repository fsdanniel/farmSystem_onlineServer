const db = require('../database/db');

const getTableName = (userType) => {
    const userTypes = {
        administrador: 'Administradores',
        funcionario: 'Funcionarios',
        veterinario: 'Veterinarios',
    };
    return userTypes[userType.toLowerCase()];
};

const getTablePrefix = (userType) => {
    const userPrefixes = {
        administrador: 'Adm',
        funcionario: 'Fun',
        veterinario: 'Vet',
    };
    return userPrefixes[userType.toLowerCase()];
}

const createUser = async (req, res) => {
    const { userType } = req.params;
    const { nome, senha, nascimento, email } = req.body;
    const tableName = getTableName(userType);
    const prefix = getTablePrefix(userType);

    if (!tableName) {
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    try {
        const query = `INSERT INTO ${tableName} (${prefix}_Nome, ${prefix}_Senha, ${prefix}_Nascimento, ${prefix}_Email) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [nome, senha, nascimento, email];
        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    const { userType } = req.params;
    const tableName = getTableName(userType);
    const prefix = getTablePrefix(userType);

    if (!tableName) {
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    try {
        const { rows } = await db.query(`SELECT ${prefix}_Id, ${prefix}_Nome, ${prefix}_Email, ${prefix}_Nascimento, ${prefix}_Ativo FROM ${tableName}`);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { userType, id } = req.params;
    const tableName = getTableName(userType);
    const prefix = getTablePrefix(userType);

    if (!tableName) {
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    try {
        const { rows } = await db.query(`SELECT ${prefix}_Id, ${prefix}_Nome, ${prefix}_Email, ${prefix}_Nascimento, ${prefix}_Ativo FROM ${tableName} WHERE ${prefix}_Id = $1`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { userType, id } = req.params;
    const { nome, nascimento, email, ativo } = req.body;
    const tableName = getTableName(userType);
    const prefix = getTablePrefix(userType);

    if (!tableName) {
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    try {
        const query = `UPDATE ${tableName} SET ${prefix}_Nome = $1, ${prefix}_Nascimento = $2, ${prefix}_Email = $3, ${prefix}_Ativo = $4 WHERE ${prefix}_Id = $5 RETURNING *`;
        const values = [nome, nascimento, email, ativo, id];
        const { rows } = await db.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { userType, id } = req.params;
    const tableName = getTableName(userType);
    const prefix = getTablePrefix(userType);

    if (!tableName) {
        return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    try {
        const { rowCount } = await db.query(`DELETE FROM ${tableName} WHERE ${prefix}_Id = $1`, [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
