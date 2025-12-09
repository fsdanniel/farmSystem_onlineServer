CREATE OR REPLACE PROCEDURE novoRegistroTarefa(
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO tarefas (tar_titulo, tar_descricao,
	tar_usuarioResponsavel, tar_prioridade, tar_status) 
	VALUES (titulo, descricao, usuarioResponsavel, prioridade, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroTarefa(
	id BIGINT,
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE tarefas
	SET tar_titulo = titulo,
		tar_descricao = descricao,
		tar_usuarioResponsavel = usuarioResponsavel,
		tar_prioridade = prioridade,
		tar_status = status
	WHERE tar_statusRegistro = TRUE AND tar_id = id;
   
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroTarefa(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE tarefas 
	SET tar_statusRegistro = FALSE
	WHERE tar_id = id AND tar_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaTarefas()
RETURNS TABLE (
	id BIGINT,
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		tar_id AS id,
		tar_titulo AS titulo,
		tar_descricao AS descricao,
		tar_usuarioResponsavel AS usuarioResponsavel,
		tar_prioridade AS prioridade,
		tar_status AS status
	FROM tarefas
	WHERE tar_statusRegistro = TRUE; 
END;
$$;

CREATE OR REPLACE PROCEDURE concluirTarefa(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE tarefas 
	SET tar_status = 'concluida'
	WHERE tar_id = id AND tar_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION minhasTarefas(usuarioNome VARCHAR(50))
RETURNS TABLE (
	id BIGINT,
	titulo VARCHAR(100),
	descricao VARCHAR(350)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		tar_id AS id,
		tar_titulo AS titulo,
		tar_descricao AS descricao
	FROM tarefas
	WHERE tar_statusRegistro = TRUE AND tar_usuarioResponsavel = usuarioNome AND
		  tar_status != 'concluida'
	ORDER BY tar_id;
END;
$$;