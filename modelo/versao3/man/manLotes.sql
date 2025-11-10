CALL novoLote(nome VARCHAR(50), genetica VARCHAR(50), 
quantidade INT, dataCriacao DATE, status TYPE_LOTESTATUS);

CALL editaLote(
	idL BIGINT, nome VARCHAR(50), genetica VARCHAR(50), quantidade INT,
	dataCriacao DATE, status TYPE_LOTESTATUS);

SELECT buscaPaginaLotes(geneticaNomeLote VARCHAR(50), statusLote VARCHAR(20));

SELECT listagemFinalPaginaLotes();


-- testes:

    CALL novoLote('lote teste', 'Duroc', 12, '2023-04-09', 'quarentenado');
	CALL editaLote(101, 'lote teste2', 'Duroc', 13, '2023-04-10', 'inativo');
	SELECT *FROM lotes;

	SELECT buscaPaginaLotes(NULL, NULL);
	SELECT buscaPaginaLotes(NULL, 'quarentenado');
	SELECT buscaPaginaLotes('Duroc', NULL);
	SELECT buscaPaginaLotes('Duroc', 'ativo');