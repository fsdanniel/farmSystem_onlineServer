const { Pool } = require('pg'); // importa a classe Pool da biblioteca pg (node-postgres)

const pool = new Pool({
    host: 'localhost', // SGBD instalado na maquina local, TODO: rodar em nuvem
    user: 'usuario_granja', // usuario com privilegios suficientes para escrever na tabela 'usuarios'
    port: 5432,
    password: 'password', // senha simples para teste
    database: 'granja_porcos',   // database para teste
})

module.exports = { pool }; // objetos a serem exportados a quem importar esse módulo