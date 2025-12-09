CREATE OR REPLACE PROCEDURE comprarInsumos(
    nome TYPE_INSUMOS,
	dataCompra DATE,
	quantidade FLOAT4,
	nomeFornecedor VARCHAR(50),
	custoTotal FLOAT4,
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO insumos(insu_nome, insu_dataCompra, insu_quantidade,
	insu_nomeFornecedor, insu_custoTotal, insu_statusRegistro)
	VALUES (nome, dataCompra, quantidade,
	nomeFornecedor, custoTotal, statusRegistro);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirInsumos(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE insumos
	SET insu_statusRegistro = FALSE
	WHERE insu_id = id AND insu_statusRegistro;
END;
$$;

CREATE OR REPLACE FUNCTION historicoInsumos()
RETURNS TABLE (
	dataCompra DATE,
    nome TYPE_INSUMOS,
	quantidade FLOAT4,
	nomeFornecedor VARCHAR(50),
	custoTotal FLOAT4
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
	SELECT 
    insu_dataCompra AS dataCompra,
    insu_nome AS nome,
    insu_quantidade AS quantidade,
    insu_nomeFornecedor AS nomeFornecedor,
    insu_custoTotal AS custoTotal
	FROM insumos
	WHERE insu_statusRegistro = TRUE
	ORDER BY insu_dataCompra DESC;
END;
$$;

CREATE OR REPLACE FUNCTION estoqueInsumos()
RETURNS TABLE (
	insumo TYPE_INSUMOS,
	quantidadeEmEstoque FLOAT4
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
	SELECT insu_nome AS insumo, SUM(insu_quantidade) AS quantidadeEmEstoqu
	FROM insumos
	WHERE insu_statusRegistro = TRUE
	GROUP BY insu_nome;
END;
$$;