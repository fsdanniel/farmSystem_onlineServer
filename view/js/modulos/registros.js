// Arquivo: js/modulos/registros.js
// Módulo responsável pela lógica da seção "Registro de Eventos",
// (o seletor que alterna os formulários de Parto, Desmame, etc.)

"use strict";

/**
 * Inicializa a lógica de abas (formulários dinâmicos) 
 * na seção de Registro de Eventos.
 * É chamada pelo app.js (DOMContentLoaded).
 */
function inicializarModuloRegistros() {
    const select = document.getElementById("tipoEvento");
    // Garante que só buscamos formulários dentro da seção correta
    const sections = document.querySelectorAll("#registros-section .form-section");

    // Se o seletor não existir na página (ex: usuário sem permissão),
    // não executa o resto do script.
    if (!select) return; 

    select.addEventListener("change", () => {
        // Esconde todos os formulários
        sections.forEach((form) => (form.style.display = "none"));

        const tipo = select.value;
        if (tipo) {
            // Constrói o ID do formulário (ex: "form" + "Cobertura" = "formCobertura")
            const formId = `form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
            const formParaMostrar = document.getElementById(formId);
            
            if (formParaMostrar) {
                formParaMostrar.style.display = "block";
            }
        }
    });
}
