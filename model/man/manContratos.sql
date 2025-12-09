
CALL novoRegistroContrato(
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
);

CALL editarRegistroContrato(
	id BIGINT,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
);

CALL excluirRegistroContrato(id BIGINT);

SELECT * FROM buscaContratos();
