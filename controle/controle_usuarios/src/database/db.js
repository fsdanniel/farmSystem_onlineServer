const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // substitua pelo seu usuário
  host: 'localhost',
  database: 'controle_usuarios', // substitua pelo nome do seu banco
  password: 'your_password', // substitua pela sua senha
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
