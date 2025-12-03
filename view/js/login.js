document.addEventListener('DOMContentLoaded', () => {
    
    // SELETORES DO DOM
    const form = document.getElementById('formulario-login');
    const idGranjaInput = document.getElementById('id-granja');
    const senhaInput = document.getElementById('senha');
    const botaoLogin = document.getElementById('botao-login');
    const mensagemErro = document.getElementById('mensagem-erro');

    // CONFIGURAÇÃO DA API
    // Como o server.js agora serve o site, deixamos vazio para usar a mesma origem (host e porta)
    // Se fosse separado, seria 'http://localhost:3000'
    const API_URL = 'http://undeluded-filmier-eusebio.ngrok-free.dev/api'; 

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
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        esconderErro();

        const usuarioId = idGranjaInput.value.trim();
        const senha = senhaInput.value.trim();

        // Validação 1: Campos vazios
        if (!usuarioId || !senha) {
            mostrarErro('Por favor, preencha todos os campos.');
            return;
        }

        // Estado de "Carregando"
        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';

        try {
            // CHAMADA REAL AO CONTROLE (Back-end)
            // A rota combinada com API_URL fica: "/login"
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // O servidor espera: { usuario, senha }
                body: JSON.stringify({
                    usuario: usuarioId, 
                    senha: senha
                })
            });

            // Converte a resposta do servidor para JSON
            const dados = await response.json();

            // Verifica a resposta do servidor
            if (dados.sucesso) {
                // SUCESSO!
                // O servidor retorna { sucesso: true, usuario: "...", tipo: "..." }
                
                localStorage.setItem('perfilUsuario', dados.tipo); 
                localStorage.setItem('nomeUsuario', dados.usuario);

                // Redireciona
                window.location.href = 'app.html';
            } else {
                // FALHA (Credenciais inválidas ou erro de negócio)
                let mensagem = 'Usuário ou Senha incorretos.';
                
                if (dados.motivo === 'usuario_ou_senha_faltando') mensagem = 'Dados incompletos.';
                if (dados.motivo === 'credenciais_invalidas') mensagem = 'Usuário ou senha inválidos.';
                
                mostrarErro(mensagem);
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            mostrarErro('Erro ao conectar com o servidor. Verifique se o sistema está online.');
        } finally {
            // Reabilita o botão caso o login falhe ou dê erro
            // Se redirecionar, a página vai mudar, então isso não afeta
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