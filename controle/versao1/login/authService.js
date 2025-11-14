const { hash, compare } = require('bcrypt'); // importa a biblioteca bcrypt para criação e autenticação de senhas
const { pool } = require('./database'); // importa a instância pool de database.js que estabelece a conexação com a database da granja

async function criarUsuario(username, senha) {
    /*
    Função assíncrona que cria um novo usuário e o adiciona à tabela 'usuarios' da database 'granja_porcos'
    */
    try {
        const hashSenha = await hash(senha, 10); // cria um hash da senha
        // tenta inserir os dados do usuário na tabela pela pool importada de database.js
        const result = await pool.query(
            'INSERT INTO usuarios (username, senha) VALUES ($1, $2) RETURNING id', // comando SQL que será executado no postgres via pool
            [username, hashSenha]
        );
        return { success: true, userId: result.rows[0].id}; // caso sucesso, retorna o id do usuário (determinado automaticamente por uma SEQUENCE do postgres)
    } catch (error) {
        if (error.code === '32505') { // caso error de unique violation (username já ocupado)
            return { success: false, error: 'Nome de usuário já existe'};
        } // caso qualquer outro erro:
        console.log(error);
        return { success: false, error: 'Erro interno do servidor'};
    }
}

async function login(username, senha) {
    /*
    Função assíncrona que tenta fazer um login verificando se usuário e senha batem com alguma linha da table usuarios
    */
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1', // sql que retorna todos os registros com atributo usuário === username
            [username]
        );

        if (result.rows.length === 0) { // se não foi encontrado registro com esse nome de usuário
            return { success: false, error: 'Credenciais inválidas'};
        } // caso o contrário, segue:

        const usuario = result.rows[0]; // seleciona o registro encontrado
        const senhaValida = await compare(senha, usuario.senha); // compara a senha dada no login com a senha registrada

        if (!senhaValida) { // caso senha inválida
            return { success: false, error: 'Credenciais inválidas'};
        } // caso o contrário, segue:

        return { success: true, userId: usuario.id }; // login bem sucedido
    } catch (error) { // caso algum outro erro que não seja nem usuário inválido nem senha inválida:
        console.log(error);
        return { success: false, error: 'Erro interno do servidor'};
    }
}

module.exports = { criarUsuario, login }; // objetos a serem exportados a quem importar esse módulo