
--  Para registrar uma nova genetica:

CALL novoRegistroGenetica(nome, descricao, caracteristicas);

CALL editaRegistroGenetica(idGen, nome, descricao, caracteristicas, status); -- status ativa ou inativa, ativa por padrão

CALL excluirRegistroGenetica(idGen);

SELECT * FROM buscaGenetica(nomeX);
SELECT * FROM listaNomesGeneticas();

SELECT * FROM listagemFinalPaginaGeneticas(); -- LISTA DE NO MAXIMO 5
