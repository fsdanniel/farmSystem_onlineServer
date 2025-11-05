document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DADOS MOCADOS DOS USUÁRIOS
    // (Simula nosso banco de dados de usuários com 3 perfis)
    const mockUsuarios = [
        { 
            id: 'admin', 
            senha: '123', 
            nome: 'Administrador', 
            perfil: 'admin' // Perfil de Administrador
        },
        { 
            id: 'vet', 
            senha: '123', 
            nome: 'Dr. João', 
            perfil: 'veterinario' // Perfil de Veterinário
        },
        { 
            id: 'func', 
            senha: '123', 
            nome: 'Carlos (Funcionário)', 
            perfil: 'funcionario' // Perfil de Funcionário
        }
    ];

    // 2. SELETORES DO DOM
    const form = document.getElementById('formulario-login');
    const idGranjaInput = document.getElementById('id-granja');
    const senhaInput = document.getElementById('senha');
    const botaoLogin = document.getElementById('botao-login');
    
    // Novo seletor para o componente de erro (substitui o alert)
    const mensagemErro = document.getElementById('mensagem-erro');

    // 3. FUNÇÃO AUXILIAR PARA MOSTRAR ERROS (Substitui o alert)
    function mostrarErro(mensagem) {
        // (Esta função espera que exista um <p id="mensagem-erro"> no HTML)
        if (mensagemErro) {
            mensagemErro.textContent = mensagem;
            mensagemErro.classList.add('visivel');
        } else {
            // Fallback caso o HTML esteja errado (mas não deveríamos usar)
            console.error("Elemento #mensagem-erro não encontrado. Fallback para alert.");
            alert(mensagem);
        }
    }

    // 4. FUNÇÃO AUXILIAR PARA ESCONDER ERROS (Melhoria de UX)
    function esconderErro() {
        if (mensagemErro) {
            mensagemErro.textContent = '';
            mensagemErro.classList.remove('visivel');
        }
    }

    // 5. LISTENER DE SUBMIT DO FORMULÁRIO (Lógica Principal)
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        
        // Esconde erros antigos
        esconderErro();

        // Pega os valores dos inputs
        const usuarioId = idGranjaInput.value.trim();
        const senha = senhaInput.value.trim();

        // Validação 1: Campos vazios
        if (!usuarioId || !senha) {
            mostrarErro('Por favor, preencha todos os campos.');
            return;
        }

        // Desabilita o botão para feedback
        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';

        // Simula uma pequena demora (como se fosse uma chamada de API)
        setTimeout(() => {
            // Validação 2: Encontra o usuário no mock
            // (Compara com 'id', não 'idGranja')
            const usuarioEncontrado = mockUsuarios.find(u => u.id === usuarioId);

            // Validação 3: Verifica o usuário e a senha
            if (usuarioEncontrado && usuarioEncontrado.senha === senha) {
                // SUCESSO!
                
                // Salva as informações do usuário no localStorage
                // Isso é o que o app.html vai usar para saber quem está logado
                localStorage.setItem('perfilUsuario', usuarioEncontrado.perfil);
                localStorage.setItem('nomeUsuario', usuarioEncontrado.nome);

                // Redireciona para o dashboard principal
                // (Assumindo que seu dashboard é o app.html)
                window.location.href = 'app.html';

            } else {
                // FALHA!
                // (Substituindo o alert() pelo componente de tela)
                mostrarErro('Usuário ou Senha incorretos. Tente novamente.');
                
                // Reabilita o botão
                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
            }
        }, 1000); // Atraso de 1 segundo
    });

    // 6. MELHORIA DE UX: Esconde o erro quando o usuário voltar a digitar
    idGranjaInput.addEventListener('input', esconderErro);
    senhaInput.addEventListener('input', esconderErro);
});

