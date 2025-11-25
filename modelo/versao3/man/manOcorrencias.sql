
CALL novaOcorrencia(
	loteNome VARCHAR(30),
	tipo TYPE_OCORRTIPO,
	prioridade TYPE_OCORRPRIORIDADE,
	dia DATE,
	hora TIME,
	titulo VARCHAR(100),
	descricao VARCHAR(300),
	quantidadeAnimaisAfetados INTEGER,
	medicamentoAplicado VARCHAR(30),
	dosagem VARCHAR(30),
	responsavel VARCHAR(50),
	proximasAcoes VARCHAR(300),
	status TYPE_OCORRSTATUS DEFAULT 'pendente'
);

CALL editarOcorrencia(
		id BIGINT,
    	loteNome VARCHAR(30),
		tipo TYPE_OCORRTIPO,
		prioridade TYPE_OCORRPRIORIDADE,
		dia DATE,
		hora TIME,
		titulo VARCHAR(100),
		descricao VARCHAR(300),
		quantidadeAnimaisAfetados INTEGER,
		medicamentoAplicado VARCHAR(30),
		dosagem VARCHAR(30),
		responsavel VARCHAR(50),
		proximasAcoes VARCHAR(300),
		status TYPE_OCORRSTATUS
);

CALL excluirOcorrencia(id BIGINT);

-- Aceita null's com NULL em todos os parâmetros, funcao abaixo retorna TODAS ocorrencias;
SELECT * FROM buscaOcorrencias(loteNome VARCHAR(30), tip TYPE_OCORRTIPO, prioridad TYPE_OCORRPRIORIDADE)
SELECT * FROM listagemLotes(); -- auxilia na funcao 'buscaOcorrencias(...)'

SELECT * FROM quantidadeOcorrenciasCriticas();
SELECT * FROM quantidadeOcorrenciasPendentes();
SELECT * FROM quantidadeOcorrenciasResolvidasHoje();
