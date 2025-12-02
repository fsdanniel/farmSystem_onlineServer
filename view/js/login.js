document.addEventListener('DOMContentLoaded', () => {
    
    // SELETORES DO DOM
    const form = document.getElementById('formulario-login');
    const idGranjaInput = document.getElementById('id-granja');
    const senhaInput = document.getElementById('senha');
    const botaoLogin = document.getElementById('botao-login');
    const mensagemErro = document.getElementById('mensagem-erro');

    // CONFIGURAÇÃO DA API
    // Se o seu backend estiver em outra URL ou porta, altere aqui.
    const API_URL = 'http://localhost:3000'; 

    // FUNÇÃO AUXILIAR PARA MOSTRAR ERROS 
    function mostrarErro(mensagem) {
        if (mensagemErro) {
            mensagemErro.textContent = mensagem;
            mensagemErro.classList.add('visivel');
        } else {
            console.error("Elemento #mensagem-erro não encontrado. Fallback para alert.");
            alert(mensagem);
        }
    }

    // FUNÇÃO AUXILIAR PARA ESCONDER ERROS 
    function esconderErro() {
        if (mensagemErro) {
            mensagemErro.textContent = '';
            mensagemErro.classList.remove('visivel');
        }
    }

    // LISTENER DE SUBMIT DO FORMULÁRIO (Integração Real)
    // Note o uso de 'async' para podermos esperar a resposta do servidor
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        esconderErro();

        const usuarioId = idGranjaInput.value.trim();
        const senha = senhaInput.value.trim();

        // Validação 1: Campos vazios (Front-end validation)
        if (!usuarioId || !senha) {
            mostrarErro('Por favor, preencha todos os campos.');
            return;
        }

        // Estado de "Carregando"
        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';

        try {
            // CHAMADA REAL AO CONTROLE (Back-end)
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // O servidor espera: { usuario, senha }
                body: JSON.stringify({
                    usuario: usuarioId, // Mapeando o input do HTML para a chave da API
                    senha: senha
                })
            });

            // Converte a resposta do servidor para JSON
            const dados = await response.json();

            // Verifica a resposta do servidor
            if (dados.sucesso) {
                // SUCESSO!
                
                // O servidor retorna { sucesso: true, usuario: "...", tipo: "..." }
                // Vamos salvar conforme a lógica da sua View esperava:
                localStorage.setItem('perfilUsuario', dados.tipo); 
                localStorage.setItem('nomeUsuario', dados.usuario);

                // Redireciona
                window.location.href = 'app.html';
            } else {
                // FALHA (Credenciais inválidas ou erro de negócio)
                // O servidor retorna "motivo" quando falha
                let mensagem = 'Usuário ou Senha incorretos.';
                
                // Traduzindo mensagens técnicas do backend para o usuário, se necessário
                if (dados.motivo === 'usuario_ou_senha_faltando') mensagem = 'Dados incompletos.';
                
                mostrarErro(mensagem);
            }

        } catch (error) {
            // ERRO DE CONEXÃO (Servidor desligado, internet caiu, etc)
            console.error('Erro na requisição:', error);
            mostrarErro('Erro ao conectar com o servidor. Verifique se o sistema está online.');
        } finally {
            // Sempre executa isso no final, dando erro ou sucesso (se não redirecionar antes)
            // Reabilita o botão caso o login falhe
            if (!window.location.href.includes('app.html')) {
                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
            }
        }
    });

    // UX: Limpa erro ao digitar
    idGranjaInput.addEventListener('input', esconderErro);
    senhaInput.addEventListener('input', esconderErro);
});