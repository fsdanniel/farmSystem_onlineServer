CREATE OR REPLACE PROCEDURE novoLote(
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS DEFAULT 'ativo'
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO lotes (lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao,
	lote_status) VALUES (nome, genetica, quantidade, dataCriacao, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editaLote(
	idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS DEFAULT 'ativo'
)
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE lotes SET 
        lote_nome = nome,
        lote_genetica = genetica,
        lote_quantidade = quantidade,
		lote_dataCriacao = dataCriacao,
        lote_status = status
    WHERE idL = lote_id;
END;
$$;

CREATE OR REPLACE FUNCTION buscaPaginaLotes(geneticaNomeLote VARCHAR(50), statusLote VARCHAR(20))
RETURNS TABLE (
    idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
    quantidade INT,
    dataCriacao DATE,
    status TYPE_LOTESTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT lote_id AS idL, lote_nome AS nome, lote_genetica AS genetica, lote_quantidade AS quantidade,
    lote_dataCriacao AS dataCriacao, lote_status AS status
    FROM lotes
    WHERE (geneticaNomeLote IS NULL OR lote_genetica = geneticaNomeLote) AND 
		  (statusLote IS NULL OR lote_status = NULLIF(statusLote, '')::TYPE_LOTESTATUS); 
END;
$$;

CREATE OR REPLACE FUNCTION listagemFinalPaginaLotes()
RETURNS TABLE (
	idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT lote_id AS idL, lote_nome AS nome, lote_genetica AS genetica,
	lote_quantidade AS quantidade, lote_dataCriacao AS dataCriacao, lote_status AS status
	FROM lotes
	WHERE lote_status = 'ativo'
	ORDER BY lote_id
	LIMIT 5 OFFSET 0;
END;
$$;

    