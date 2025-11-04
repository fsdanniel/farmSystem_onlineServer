document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('formulario-login');
    const idGranjaInput = document.getElementById('id-granja');
    const senhaInput = document.getElementById('senha');
    const botaoLogin = document.getElementById('botao-login');

    const idCerto = 'admin';
    const senhaCerta = 'granja123';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const idGranja = idGranjaInput.value;
        const senha = senhaInput.value;

        if (!idGranja || !senha) {
            alert('Preencha todos os campos!');
            return;
        }

        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';

        setTimeout(() => {
            if (idGranja === idCerto && senha === senhaCerta) {
                alert('Login realizado com sucesso!');
                
                window.location.href = 'app.html'; 
            } else {
                alert('ID da Granja ou Senha incorretos. Tente novamente.');

                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
            }
        }, 1500); 
    });
});