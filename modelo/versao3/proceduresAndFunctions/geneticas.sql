CREATE OR REPLACE PROCEDURE novoRegistroGenetica(
    nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS DEFAULT 'ativa'
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO geneticas (gen_nome, gen_descricao, gen_caracteristicas, gen_status)
    VALUES (nome, descricao, caracteristicas, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editaRegistroGenetica(
	idGen BIGINT,
    nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS DEFAULT 'ativa' 
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE geneticas SET 
        gen_nome = nome,
        gen_descricao = descricao,
        gen_caracteristicas = caracteristicas,
		gen_status = status
    WHERE gen_id = idGen AND gen_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroGenetica(idGen BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE geneticas SET 
		gen_statusRegistro = FALSE,
		gen_status = 'inativa'
    WHERE gen_id = idGen AND gen_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaGenetica(nomeX VARCHAR(50))
RETURNS TABLE (
	idGen BIGINT, 
	nome VARCHAR(50),
	descricao VARCHAR(150),
	caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT gen_id AS idGen, gen_nome AS nome, gen_descricao AS descricao,
	gen_caracteristicas AS caracteristicas, gen_status AS status
	FROM geneticas
	WHERE nomeX = gen_nome AND gen_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION listaNomesGeneticas()
RETURNS TABLE (nome VARCHAR(50))
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT gen_nome AS nome
	FROM geneticas
	WHERE gen_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION listagemFinalPaginaGeneticas()
RETURNS TABLE (
	idGen BIGINT, 
	nome VARCHAR(50),
	descricao VARCHAR(150),
	caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
    SELECT gen_id AS idGen, gen_nome AS nome, gen_descricao AS descricao,
	gen_caracteristicas AS caracteristicas, gen_status AS status
	FROM geneticas
	WHERE gen_statusRegistro = TRUE
	ORDER BY gen_id
	LIMIT 5 OFFSET 0;
END;
$$;