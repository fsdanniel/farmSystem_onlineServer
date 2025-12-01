CREATE OR REPLACE PROCEDURE novoRegistroContrato(
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
)
LANGUAGE plpgsql
AS $$ 
DECLARE 
	status TYPE_STATUSCONTRATO;
BEGIN
	IF CURRENT_DATE < dataInicio THEN
		status := 'futuro';
	ELSIF CURRENT_DATE > dataInicio AND CURRENT_DATE < dataVencimento THEN
		status := 'vigente';
	ELSIF CURRENT_DATE > dataVencimento THEN
		status := 'vencido';
	END IF;
    INSERT INTO contratos (cont_fornecedor, cont_objeto, cont_dataInicio,
	cont_dataVencimento, cont_status)
	VALUES (fornecedor, objeto, dataInicio, dataVencimento, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroContrato(
	id BIGINT,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
)
LANGUAGE plpgsql
AS $$ 
DECLARE 
	status TYPE_STATUSCONTRATO;
BEGIN
	IF CURRENT_DATE < dataInicio THEN
		status := 'futuro';
	ELSIF CURRENT_DATE > dataInicio AND CURRENT_DATE < dataVencimento THEN
		status := 'vigente';
	ELSIF CURRENT_DATE > dataVencimento THEN
		status := 'vencido';
	END IF;
    UPDATE contratos
	SET cont_fornecedor = fornecedor,
		cont_objeto = objeto,
		cont_dataInicio = dataInicio,
		cont_dataVencimento = dataVencimento,
		cont_status = status
	WHERE cont_id = id AND cont_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroContrato(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE contratos 
	SET cont_statusRegistro = FALSE
	WHERE cont_id = id AND cont_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaContratos()
RETURNS TABLE (
	--id BIGSERIAL,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE,
	status TYPE_STATUSCONTRATO
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		--cont_id,
		cont_fornecedor,
		cont_objeto,
		cont_dataInicio,
		cont_dataVencimento,
		cont_status	
	FROM contratos
	WHERE cont_statusRegistro = TRUE; 
END;
$$;
