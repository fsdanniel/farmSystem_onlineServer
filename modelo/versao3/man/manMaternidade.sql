
CALL novoRegistroMaternidade(
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel'
);

CALL editarRegistroMaternidade(
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel'
);

CALL excluirRegistroMaternidade(id BIGINT);

SELECT * FROM buscaMaternidade(p_gen VARCHAR(50), p_stat TYPE_MATERSTATUS);
