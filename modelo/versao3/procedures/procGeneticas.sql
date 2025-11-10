CREATE OR REPLACE PROCEDURE novaGenetica(
    nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO geneticas (gen_nome, gen_descricao, gen_caracteristicas, gen_status)
    VALUES (nome, descricao, caracteristicas, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editaGenetica(
	idGen BIGINT,
    nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE geneticas SET 
        gen_nome = nome,
        gen_descricao = descricao,
        gen_caracteristicas = caracteristicas,
        gen_status = status
    WHERE gen_id = idGen;
END;
$$;

CREATE OR REPLACE FUNCTION filtrarGeneticaPorNome(nomeX VARCHAR(50))
RETURNS TABLE (
	idGen BIGINT, 
	nome VARCHAR(50),
	descricao VARCHAR(150),
	caracteristicas VARCHAR(150),
	status BOOLEAN
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT gen_id AS idGen, gen_nome AS nome, gen_descricao AS descricao,
	gen_caracteristicas AS caracteristicas, gen_status AS status
	FROM geneticas
	WHERE nomeX = gen_nome;
END;
$$;

CREATE OR REPLACE FUNCTION listagemFinalPaginaGeneticas()
RETURNS TABLE (
	idGen BIGINT, 
	nome VARCHAR(50),
	descricao VARCHAR(150),
	caracteristicas VARCHAR(150),
	status BOOLEAN
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT gen_id AS idGen, gen_nome AS nome, gen_descricao AS descricao,
	gen_caracteristicas AS caracteristicas, gen_status AS status
	FROM geneticas
	WHERE gen_status = TRUE
	ORDER BY gen_id
	LIMIT 5 OFFSET 0;
END;
$$;