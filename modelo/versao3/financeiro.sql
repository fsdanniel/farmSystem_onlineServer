CREATE OR REPLACE PROCEDURE novoRegistroFinanceiro(
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO financeiro (finan_data, finan_descricao, finan_valor,
	finan_tipo, finan_categoria) VALUES (data, descricao, valor,
	tipo, categoria);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroFinanceiro(
	id BIGINT,
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE financeiro
	SET finan_data = data, finan_descricao = descricao, finan_valor = valor,
	finan_tipo = tipo, finan_categoria = categoria
	WHERE finan_id = id AND finan_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroFinanceiro(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE financeiro
	SET finan_statusRegistro = FALSE
	WHERE finan_id = id AND finan_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaFinanceiro()
RETURNS TABLE (
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		finan_data AS data,
		finan_descricao AS descricao,
		finan_valor AS valor,
		finan_tipo AS tipo,
		finan_categoria AS categoria
	FROM financeiro
	WHERE finan_statusRegistro = TRUE; 
END;
$$;