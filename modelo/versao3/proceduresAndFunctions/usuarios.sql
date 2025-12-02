
CREATE OR REPLACE PROCEDURE novoRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50),
	nome VARCHAR(50),
	tipo TYPE_USERTIPO,
	senha VARCHAR(50)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	INSERT INTO usuarios (user_nickname, user_nome, user_tipo, user_senha)
	VALUES (nickname, nome, tipo, MD5(senha));
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroUsuario(
	--id BIGINT,
	old_nickname VARCHAR(50),
	new_nickname VARCHAR(50),
	new_nome VARCHAR(50),
	new_tipo TYPE_USERTIPO,
	new_senha VARCHAR(50)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE usuarios
	SET user_nickname = new_nickname, 
		user_nome = new_nome, 
		user_tipo = new_tipo,
		user_senha = new_senha
	WHERE user_nickname = old_nickname AND user_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE usuarios
	SET user_statusRegistro = FALSE
	WHERE user_nickname = nickname AND user_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaUsuarios()
RETURNS TABLE (
	--id BIGSERIAL,
	nickname VARCHAR(50),
	nome VARCHAR(50),
	tipo TYPE_USERTIPO
	--,email VARCHAR(50)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		--user_id,
		user_nickname,
		user_nome,
		user_tipo
		--,user_email
	FROM usuarios
	WHERE user_statusRegistro = TRUE; 
END;
$$;

