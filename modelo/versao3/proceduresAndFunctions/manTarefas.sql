
CALL novoRegistroTarefa(
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS
);

CALL editarRegistroTarefa(
	id BIGINT,
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS
);

CALL excluirRegistroTarefa(id BIGINT);

SELECT * FROM buscaTarefas(); -- listagem pagina de administrador com todas insformações

CALL concluirTarefa(id BIGINT); -- conclusao de tarefa para o funcionario

SELECT * FROM minhasTarefas(usuarioNome VARCHAR(50)); -- funcao que retorna tarefas ...
-- ... para um funcionário, de acordo com o seu nome.
