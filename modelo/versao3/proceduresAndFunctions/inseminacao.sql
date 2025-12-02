
CREATE OR REPLACE PROCEDURE novoRegistroInseminacao(
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO inseminacao (insem_brincoFemea, insem_geneticaMacho,
	insem_dataInseminacao, insem_tecnica, insem_resultado,
	insem_dataVerificacao) VALUES (brincoFemea, geneticaMacho,
	dataInseminacao, tecnica, resultado, dataVerificacao);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroInseminacao(
	id BIGINT,
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE inseminacao 
	SET insem_brincoFemea = brincoFemea,
		insem_geneticaMacho = geneticaMacho,
		insem_dataInseminacao = dataInseminacao,
		insem_tecnica = tecnica,
		insem_resultado = resultado,
		insem_dataVerificacao = dataVerificacao 
	WHERE insem_id = id AND insem_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroInseminacao(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE inseminacao 
	SET insem_statusRegistro = FALSE
	WHERE insem_id = id AND insem_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaInseminacao(p_periodo INT, p_resultado TYPE_INSEMRESULTADO)
RETURNS TABLE (
	id BIGINT,
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT insem_id AS id, insem_brincoFemea AS brincoFemea,
	insem_geneticaMacho AS geneticaMacho, insem_dataInseminacao AS dataInseminacao,
	insem_tecnica AS tecnica, insem_resultado AS resultado, insem_dataVerificacao AS dataVerificacao
	FROM inseminacao
	WHERE (p_periodo IS NULL OR insem_dataInseminacao >= CURRENT_DATE - p_periodo)
		AND (p_resultado IS NULL OR p_resultado = insem_resultado)
		AND (insem_statusRegistro = TRUE); 
END;
$$;