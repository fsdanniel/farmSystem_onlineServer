CREATE OR REPLACE PROCEDURE novoRegistroMaternidade(
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO maternidade (mater_brincoFemea, mater_genetica,
	mater_dataCobertura, mater_dataPartoPrevisto,
	mater_qtdeLeitoes, mater_status,
	mater_statusRegistro) VALUES (brincoFemea,
	genetica, dataCobertura, dataPartoPrevisto,
	qtdeLeitoes, status, statusRegistro);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroMaternidade(
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE maternidade 
	SET mater_brincoFemea =  brincoFemea,
		mater_genetica = genetica,
		mater_dataCobertura = dataCobertura,
		mater_dataPartoPrevisto = dataPartoPrevisto,
		mater_qtdeLeitoes = qtdeLeitoes,
		mater_status = status,
		mater_statusRegistro = statusRegistro
	WHERE mater_id = id AND statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroMaternidade(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE maternidade 
	SET mater_statusRegistro = FALSE
	WHERE mater_id = id AND mater_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaMaternidade(p_gen VARCHAR(50), p_stat TYPE_MATERSTATUS)
RETURNS TABLE (
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT mater_id AS id, mater_brincoFemea AS brincoFemea, mater_genetica AS genetica,
	mater_dataCobertura AS dataCobertura, mater_dataPartoPrevisto AS dataPartoPrevisto,
	mater_qtdeLeitoes AS qtdeLeitoes, mater_status AS status
	FROM maternidade
	WHERE (p_gen IS NULL OR p_gen = mater_genetica) 
		AND (p_stat IS NULL OR p_stat = mater_status) 
		AND (mater_statusRegistro = TRUE);
END;
$$;