-- EVENTO COBERTURA INSEMINACAO:

CREATE OR REPLACE PROCEDURE novoEventoCoberturaInseminacao(
	dataCobertura DATE,
	matrizId BIGINT,
	tipo TYPE_EVENTOCOBERTURAINSEMINACAOTIPO,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoCoberturaInseminacao(
	cobert_dataCobertura, cobert_matrizId,
	cobert_tipo, cobert_observacoes) 
	VALUES (dataCobertura, matrizId, tipo, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoCoberturaInseminacao(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoCoberturaInseminacao
	SET cobert_statusRegistro = FALSE
	WHERE cobert_id = id AND cobert_statusRegistro = TRUE;
END;
$$;

-- EVENTO PARTO:

CREATE OR REPLACE PROCEDURE novoEventoParto(
	data DATE,
	matrizId BIGINT,
	quantidadeNascidos BIGINT,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoParto (parto_data, parto_matrizId,
	parto_quantidadeNascidos, parto_observacoes) 
	VALUES (data, matrizId, quantidadeNascidos, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoParto(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoParto
	SET parto_statusRegistro = FALSE
	WHERE id = parto_id AND parto_statusRegistro = TRUE;
END;
$$;

-- EVENTO DESAME:

CREATE OR REPLACE PROCEDURE novoEventoDesmame(
	data DATE,
	loteId BIGINT,
	quantidadeDesmamados BIGINT,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoDesmame (desm_data, desm_loteId, desm_quantidadeDesmamados, desm_observacoes) 
	VALUES (data, loteId, quantidadeDesmamados, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoDesmame(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoDesmame
	SET desm_statusRegistro = FALSE
	WHERE id = desm_id AND desm_statusRegistro = TRUE;
END;
$$;

-- EVENTO MORTE LOTE:

CREATE OR REPLACE PROCEDURE novoEventoMorteLote(
	loteData DATE,
	loteIdLote BIGINT,
	loteCausaMorte VARCHAR(100),
	loteObservacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoMortalidadeLote (mort_loteData, mort_loteIdLote, mort_loteCausaMorte, mort_loteObservacoes)
	VALUES (loteData, loteIdLote, loteCausaMorte, loteObservacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoMorteLote(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoMortalidadeLote
	Set mort_loteStatusRegistro = FALSE
	WHERE id = mort_loteId AND mort_loteStatusRegistro = TRUE;
END;
$$;

-- EVENTO MORTE FEMEA:

CREATE OR REPLACE PROCEDURE novoEventoMorteFemea(
	femeaData DATE,
	femeaIdMatriz BIGINT,
	femeaCausaMorte VARCHAR(100),
	femeaObservacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoMortalidadeFemea (mort_femeaData, mort_femeaIdMatriz, mort_femeaCausaMorte, mort_femeaObservacoes)
	VALUES (femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoMorteFemea(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoMortalidadeFemea
	SET mort_femeaStatusRegistro = FALSE
	WHERE id = mort_femeaId AND mort_femeaStatusRegistro = TRUE;
END;
$$;
