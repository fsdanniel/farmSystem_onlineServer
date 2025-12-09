
-- EVENTO COBERTURA INSEMINAÇÃO:

CALL novoEventoCoberturaInseminacao(
	dataCobertura DATE,
	matrizId BIGINT,
	tipo TYPE_EVENTOCOBERTURAINSEMINACAOTIPO,
	observacoes VARCHAR(350)
);

CALL excluirEventoCoberturaInseminacao(id BIGINT);

-- EVENTO PARTO:

CALL novoEventoParto(
	data DATE,
	matrizId BIGINT,
	quantidadeNascidos BIGINT,
	observacoes VARCHAR(350)
);

CALL excluirEventoParto(id BIGINT);

-- EVENTO DESMAME:

CALL novoEventoDesmame(
	data DATE,
	loteId BIGINT,
	quantidadeDesmamados BIGINT,
	observacoes VARCHAR(350)
);

CALL excluirEventoDesmame(id BIGINT);

-- EVENTO MORTE LOTE:

CALL novoEventoMorteLote(
	loteData DATE,
	loteIdLote BIGINT,
	loteCausaMorte VARCHAR(100),
	loteObservacoes VARCHAR(350)
);

CALL excluirEventoMorteLote(id BIGINT);

-- EVENTO MORTE FEMEA:

CALL novoEventoMorteFemea(
	femeaData DATE,
	femeaIdMatriz BIGINT,
	femeaCausaMorte VARCHAR(100),
	femeaObservacoes VARCHAR(350)
);

CALL excluirEventoMorteFemea(id BIGINT);
