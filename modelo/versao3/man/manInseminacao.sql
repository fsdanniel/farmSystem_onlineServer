
CALL novoRegistroInseminacao(
	brincoFemea VARCHAR(30),
	geneticaMacho BIGINT,
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
);

CALL editarRegistroInseminacao(
	id BIGINT,
	insem_brincoFemea VARCHAR(30),
	insem_geneticaMacho BIGINT,
	insem_dataInseminacao DATE,
	insem_tecnica VARCHAR(30),
	insem_resultado TYPE_INSEMRESULTADO,
	insem_dataVerificacao DATE
);

CALL excluirRegistroInseminacao(id BIGINT);

SELECT * FROM buscaInseminacao(p_periodo INT, p_resultado TYPE_INSEMRESULTADO);
