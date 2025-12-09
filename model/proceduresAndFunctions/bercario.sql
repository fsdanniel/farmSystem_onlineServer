CREATE OR REPLACE PROCEDURE novoRegistroBercario(
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS DEFAULT 'ativo',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO bercario (ber_loteNome, ber_qtdeLeitoes, ber_dataNascimento,
	ber_pesoMedio, ber_status, ber_dataDesmame, ber_statusRegistro) VALUES (loteNome, qtdeLeitoes,
	dataNascimento, pesoMedio, status, dataDesmame, statusRegistro);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroBercario(
	id BIGINT,
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS DEFAULT 'ativo',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE bercario
	SET 
		ber_loteNome = loteNome,
	    ber_qtdeLeitoes  = qtdeLeitoes,
	    ber_dataNascimento = dataNascimento,
	    ber_pesoMedio = pesoMedio,
	    ber_status = status,
	    ber_dataDesmame = dataDesmame,
		ber_statusRegistro = statusRegistro
	WHERE ber_id = id AND ber_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroBercario(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE bercario
	SET ber_statusRegistro = FALSE
	WHERE ber_id = id AND ber_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaBercario(nome VARCHAR(50), stat TYPE_BERSTATUS)
RETURNS TABLE (
	id BIGINT,
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	status TYPE_BERSTATUS,
	dataDesmame DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT ber_id AS id, ber_loteNome AS loteNome, ber_qtdeLeitoes AS qtdeLeitoes, ber_dataNascimento AS dataNascimento,
	ber_pesoMedio AS pesoMedio, ber_status AS status, ber_dataDesmame AS dataDesmame
	FROM bercario
	WHERE (nome IS NULL OR nome = ber_loteNome) 
		AND (stat IS NULL OR stat = ber_status) 
		AND (ber_statusRegistro = TRUE);
END;
$$;
