// Arquivo: js/modulos/registros.js
// Módulo responsável pela lógica da seção "Registro de Eventos"
// Gerencia a alternância de formulários e o envio dos eventos para o backend.

"use strict";

// CONFIGURAÇÃO DA API
const API_URL_REGISTROS = 'https://undeluded-filmier-eusebio.ngrok-free.dev/api';

/**
 * Inicializa a lógica de abas (formulários dinâmicos) e configura os envios.
 * É chamada pelo app.js (DOMContentLoaded).
 */
function inicializarModuloRegistros() {
    const select = document.getElementById("tipoEvento");
    // Garante que só buscamos formulários dentro da seção correta
    const sections = document.querySelectorAll("#registros-section .form-section");

    // Se o seletor não existir na página (ex: usuário sem permissão),
    // não executa o resto do script.
    if (!select) return; 

    // Lógica de UI: Alternar formulários
    select.addEventListener("change", () => {
        // Esconde todos os formulários
        sections.forEach((form) => (form.style.display = "none"));

        const tipo = select.value;
        if (tipo) {
            // Constrói o ID do formulário (ex: "form" + "Cobertura" = "formCobertura")
            // Espera-se que o HTML tenha IDs como: formCobertura, formParto, formDesmame, formMorteFemea, formMorteLote
            const formId = `form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
            const formParaMostrar = document.getElementById(formId);
            
            if (formParaMostrar) {
                formParaMostrar.style.display = "block";
            }
        }
    });

    // Configura os listeners de submit para cada formulário de evento
    configurarEnvioEventos();
}

/**
 * Configura o listener 'submit' para cada formulário específico.
 * Mapeia os dados do formulário para o JSON esperado pelo server.js.
 */
function configurarEnvioEventos() {
    
    // --- 1. Evento: Cobertura / Inseminação (Log Rápido) ---
    const formCobertura = document.getElementById('formCobertura');
    if (formCobertura) {
        formCobertura.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formCobertura);
            const dados = {
                dataCobertura: formData.get('data'),
                matrizId: formData.get('matrizId'), // ID ou Brinco
                tipo: formData.get('tipo'), // Monta natural ou IA
                observacoes: formData.get('observacoes')
            };
            await enviarEvento('/eventos/inseminacao', dados, formCobertura);
        });
    }

    // --- 2. Evento: Parto ---
    const formParto = document.getElementById('formParto');
    if (formParto) {
        formParto.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formParto);
            const dados = {
                data: formData.get('data'),
                matrizId: formData.get('matrizId'),
                quantidadeNascidos: parseInt(formData.get('qtdNascidos')),
                observacoes: formData.get('observacoes')
            };
            await enviarEvento('/eventos/parto', dados, formParto);
        });
    }

    // --- 3. Evento: Desmame ---
    const formDesmame = document.getElementById('formDesmame');
    if (formDesmame) {
        formDesmame.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formDesmame);
            const dados = {
                data: formData.get('data'),
                loteId: formData.get('loteId'), // Nome ou ID do lote
                quantidadeDesmamados: parseInt(formData.get('qtdDesmamados')),
                observacoes: formData.get('observacoes')
            };
            await enviarEvento('/eventos/desmame', dados, formDesmame);
        });
    }

    // --- 4. Evento: Morte de Fêmea (Matriz) ---
    const formMorteFemea = document.getElementById('formMorteFemea');
    if (formMorteFemea) {
        formMorteFemea.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formMorteFemea);
            const dados = {
                femeaData: formData.get('data'),
                femeaIdMatriz: formData.get('matrizId'),
                femeaCausaMorte: formData.get('causa'),
                femeaObservacoes: formData.get('observacoes')
            };
            await enviarEvento('/eventos/morte-femea', dados, formMorteFemea);
        });
    }

    // --- 5. Evento: Morte em Lote ---
    const formMorteLote = document.getElementById('formMorteLote');
    if (formMorteLote) {
        formMorteLote.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formMorteLote);
            const dados = {
                loteData: formData.get('data'),
                loteIdLote: formData.get('loteId'),
                loteCausaMorte: formData.get('causa'),
                loteObservacoes: formData.get('observacoes')
            };
            await enviarEvento('/eventos/morte-lote', dados, formMorteLote);
        });
    }
}

/**
 * Função genérica para enviar dados para o backend.
 * @param {string} rota - Endpoint da API (ex: '/eventos/parto')
 * @param {object} dados - Objeto JSON com os dados
 * @param {HTMLFormElement} form - O formulário para resetar em caso de sucesso
 */
async function enviarEvento(rota, dados, form) {
    // Feedback visual básico no botão
    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn ? btn.textContent : 'Salvar';
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Salvando...';
    }

    try {
        const response = await fetch(`${API_URL_REGISTROS}${rota}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            if (typeof mostrarNotificacao === 'function') {
                mostrarNotificacao('Sucesso!', 'Evento registrado com sucesso.');
            } else {
                alert('Evento registrado com sucesso.');
            }
            form.reset();
            // Define data de hoje nos campos de data após resetar
            const inputsData = form.querySelectorAll('input[type="date"]');
            inputsData.forEach(input => input.value = new Date().toISOString().split('T')[0]);
        } else {
            throw new Error(resultado.erro || 'Erro desconhecido ao salvar.');
        }

    } catch (error) {
        console.error(`Erro ao enviar para ${rota}:`, error);
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Erro', error.message);
        } else {
            alert('Erro: ' + error.message);
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    }
}