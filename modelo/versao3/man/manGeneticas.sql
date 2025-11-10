CALL novaGenetica(nome VARCHAR(50), descricao VARCHAR(150), caracteristicas VARCHAR(150),
	status BOOLEAN DEFAULT TRUE);

CALL editaGenetica(idGen BIGINT, nome VARCHAR(50), descricao VARCHAR(150),
    caracteristicas VARCHAR(150), status BOOLEAN DEFAULT TRUE);

SELECT filtrarGeneticaPorNome(nomeX VARCHAR(50);

SELECT listagemFinalPaginaGeneticas();