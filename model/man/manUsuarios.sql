
CALL novoRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50),
	nome VARCHAR(50),
	tipo TYPE_USERTIPO,
	senha VARCHAR(50)
);

CALL editarRegistroUsuario(
	--id BIGINT,
	old_nickname VARCHAR(50),
	new_nickname VARCHAR(50),
	new_nome VARCHAR(50),
	new_tipo TYPE_USERTIPO,
	new_senha VARCHAR(50)
);

CALL excluirRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50)
);

SELECT * FROM buscaUsuarios();
