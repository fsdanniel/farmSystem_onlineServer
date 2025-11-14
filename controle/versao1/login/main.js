const { criarUsuario, login } = require('./authService'); // importa as funções do módulo authService.js

async function testarSistema() {
    // teste de criação do usuário:
    const resultadoCriacao = await criarUsuario('pedro', 'senha123');
    console.log('Criação de usuário:', resultadoCriacao); // deve imprimir o userId

    // teste de login 1
    const resultadoLogin1 = await login('pedro', 'senha321'); // teste com senha errada
    console.log('Tentativa de login:', resultadoLogin1); // deve imprimir Credenciais Invalidas

    // teste de login 2
    const resultadoLogin2 = await login('pedro', 'senha123'); // teste com senha correta
    console.log('Tentativa de login:', resultadoLogin2); // deve imprimir o userId
}

testarSistema();