
CREATE OR REPLACE PROCEDURE novaOcorrencia(
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
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ocorrencias (
		ocor_loteNome,
		ocor_tipo,
		ocor_prioridade,
		ocor_dia,
		ocor_hora,
		ocor_titulo,
		ocor_descricao,
		ocor_quantidadeAnimaisAfetados,
		ocor_medicamentoAplicado,
		ocor_dosagem,
		ocor_responsavel,
		ocor_proximasAcoes,
		ocor_status
	) VALUES (
		loteNome,
		tipo,
		prioridade,
		dia,
		hora,
		titulo,
		descricao,
		quantidadeAnimaisAfetados,
		medicamentoAplicado,
		dosagem,
		responsavel,
		proximasAcoes,
		status
	);
END;
$$;


CREATE OR REPLACE PROCEDURE editarOcorrencia(
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
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE ocorrencias 
	SET 
		ocor_loteNome = loteNome,
		ocor_tipo = tipo,
		ocor_prioridade = prioridade,
		ocor_dia = dia,
		ocor_hora = hora,
		ocor_titulo = titulo,
		ocor_descricao = descricao,
		ocor_quantidadeAnimaisAfetados = quantidadeAnimaisAfetados,
		ocor_medicamentoAplicado = medicamentoAplicado,
		ocor_dosagem = dosagem,
		ocor_responsavel = responsavel,
		ocor_proximasAcoes = proximasAcoes,
		ocor_status = status
	WHERE id = ocor_id AND ocor_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirOcorrencia(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE ocorrencias 
	SET ocor_statusRegistro = FALSE
	WHERE id = ocor_id AND ocor_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaOcorrencias(loteNome VARCHAR(30), tip TYPE_OCORRTIPO, prioridad TYPE_OCORRPRIORIDADE)
RETURNS TABLE (
    id BIGINT,
    data DATE,
    hora TIME,
	lote VARCHAR(30),
	tipo TYPE_OCORRTIPO,
	prioridade TYPE_OCORRPRIORIDADE,
	titulo VARCHAR(100),
	status TYPE_OCORRSTATUS,
	reponsavel VARCHAR(50)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	RETURN QUERY
	SELECT ocor_id AS id, ocor_dia AS data, ocor_hora AS hora, ocor_loteNome AS lote, ocor_tipo AS tipo,
		ocor_prioridade AS prioridade, ocor_titulo AS titulo, ocor_status AS status, ocor_responsavel AS responsavel
	FROM ocorrencias
	WHERE (ocor_statusRegistro = TRUE) 
		AND (loteNome IS NULL OR ocor_loteNome = loteNome)
		AND (tip IS NULL OR ocor_tipo = tip)
		AND (prioridad IS NULL OR ocor_prioridade = prioridad)
	ORDER BY ocor_id;
END;
$$;

CREATE OR REPLACE FUNCTION listagemLotes()
RETURNS TABLE (
   lotes VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT lote_nome AS lotes
    FROM lotes
	WHERE lote_nome IS NOT NULL AND lote_statusRegistro = TRUE
	ORDER BY (lote_id);
END;
$$;

CREATE OR REPLACE FUNCTION quantidadeOcorrenciasCriticas()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS ocorrenciasCriticas
	INTO retorno
	FROM ocorrencias
	WHERE ocor_prioridade = 'critica' AND ocor_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeOcorrenciasPendentes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS ocorrenciasPendentes
	INTO retorno
	FROM ocorrencias
	WHERE ocor_status = 'pendente' AND ocor_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeOcorrenciasResolvidasHoje()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS ocorrenciasResolvidasHoje
	INTO retorno
	FROM ocorrencias
	WHERE ocor_dia = CURRENT_DATE AND ocor_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;
