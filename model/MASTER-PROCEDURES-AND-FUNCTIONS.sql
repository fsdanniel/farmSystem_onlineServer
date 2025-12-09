CREATE OR REPLACE PROCEDURE novoRegistroBercario(
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS DEFAULT 'ativo',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO bercario (ber_loteNome, ber_qtdeLeitoes, ber_dataNascimento,
	ber_pesoMedio, ber_status, ber_dataDesmame, ber_statusRegistro) VALUES (loteNome, qtdeLeitoes,
	dataNascimento, pesoMedio, status, dataDesmame, statusRegistro);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroBercario(
	id BIGINT,
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS DEFAULT 'ativo',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE bercario
	SET 
		ber_loteNome = loteNome,
	    ber_qtdeLeitoes  = qtdeLeitoes,
	    ber_dataNascimento = dataNascimento,
	    ber_pesoMedio = pesoMedio,
	    ber_status = status,
	    ber_dataDesmame = dataDesmame,
		ber_statusRegistro = statusRegistro
	WHERE ber_id = id AND ber_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroBercario(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
	UPDATE bercario
	SET ber_statusRegistro = FALSE
	WHERE ber_id = id AND ber_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaBercario(nome VARCHAR(50), stat TYPE_BERSTATUS)
RETURNS TABLE (
	id BIGINT,
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	status TYPE_BERSTATUS,
	dataDesmame DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT ber_id AS id, ber_loteNome AS loteNome, ber_qtdeLeitoes AS qtdeLeitoes, ber_dataNascimento AS dataNascimento,
	ber_pesoMedio AS pesoMedio, ber_status AS status, ber_dataDesmame AS dataDesmame
	FROM bercario
	WHERE (nome IS NULL OR nome = ber_loteNome) 
		AND (stat IS NULL OR stat = ber_status) 
		AND (ber_statusRegistro = TRUE);
END;
$$;
CREATE OR REPLACE PROCEDURE novoRegistroContrato(
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
)
LANGUAGE plpgsql
AS $$ 
DECLARE 
	status TYPE_STATUSCONTRATO;
BEGIN
	IF CURRENT_DATE < dataInicio THEN
		status := 'futuro';
	ELSIF CURRENT_DATE > dataInicio AND CURRENT_DATE < dataVencimento THEN
		status := 'vigente';
	ELSIF CURRENT_DATE > dataVencimento THEN
		status := 'vencido';
	END IF;
    INSERT INTO contratos (cont_fornecedor, cont_objeto, cont_dataInicio,
	cont_dataVencimento, cont_status)
	VALUES (fornecedor, objeto, dataInicio, dataVencimento, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroContrato(
	id BIGINT,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE
)
LANGUAGE plpgsql
AS $$ 
DECLARE 
	status TYPE_STATUSCONTRATO;
BEGIN
	IF CURRENT_DATE < dataInicio THEN
		status := 'futuro';
	ELSIF CURRENT_DATE > dataInicio AND CURRENT_DATE < dataVencimento THEN
		status := 'vigente';
	ELSIF CURRENT_DATE > dataVencimento THEN
		status := 'vencido';
	END IF;
    UPDATE contratos
	SET cont_fornecedor = fornecedor,
		cont_objeto = objeto,
		cont_dataInicio = dataInicio,
		cont_dataVencimento = dataVencimento,
		cont_status = status
	WHERE cont_id = id AND cont_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroContrato(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE contratos 
	SET cont_statusRegistro = FALSE
	WHERE cont_id = id AND cont_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaContratos()
RETURNS TABLE (
	--id BIGSERIAL,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE,
	status TYPE_STATUSCONTRATO
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT 
		--cont_id,
		cont_fornecedor,
		cont_objeto,
		cont_dataInicio,
		cont_dataVencimento,
		cont_status	
	FROM contratos
	WHERE cont_statusRegistro = TRUE; 
END;
$$;
-- EVENTO COBERTURA INSEMINACAO:

CREATE OR REPLACE PROCEDURE novoEventoCoberturaInseminacao(
	dataCobertura DATE,
	matrizId BIGINT,
	tipo TYPE_EVENTOCOBERTURAINSEMINACAOTIPO,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoCoberturaInseminacao(
	cobert_dataCobertura, cobert_matrizId,
	cobert_tipo, cobert_observacoes) 
	VALUES (dataCobertura, matrizId, tipo, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoCoberturaInseminacao(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoCoberturaInseminacao
	SET cobert_statusRegistro = FALSE
	WHERE cobert_id = id AND cobert_statusRegistro = TRUE;
END;
$$;

-- EVENTO PARTO:

CREATE OR REPLACE PROCEDURE novoEventoParto(
	data DATE,
	matrizId BIGINT,
	quantidadeNascidos BIGINT,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoParto (parto_data, parto_matrizId,
	parto_quantidadeNascidos, parto_observacoes) 
	VALUES (data, matrizId, quantidadeNascidos, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoParto(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoParto
	SET parto_statusRegistro = FALSE
	WHERE id = parto_id AND parto_statusRegistro = TRUE;
END;
$$;

-- EVENTO DESAME:

CREATE OR REPLACE PROCEDURE novoEventoDesmame(
	data DATE,
	loteId BIGINT,
	quantidadeDesmamados BIGINT,
	observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoDesmame (desm_data, desm_loteId, desm_quantidadeDesmamados, desm_observacoes) 
	VALUES (data, loteId, quantidadeDesmamados, observacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoDesmame(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoDesmame
	SET desm_statusRegistro = FALSE
	WHERE id = desm_id AND desm_statusRegistro = TRUE;
END;
$$;

-- EVENTO MORTE LOTE:

CREATE OR REPLACE PROCEDURE novoEventoMorteLote(
	loteData DATE,
	loteIdLote BIGINT,
	loteCausaMorte VARCHAR(100),
	loteObservacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoMortalidadeLote (mort_loteData, mort_loteIdLote, mort_loteCausaMorte, mort_loteObservacoes)
	VALUES (loteData, loteIdLote, loteCausaMorte, loteObservacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoMorteLote(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoMortalidadeLote
	Set mort_loteStatusRegistro = FALSE
	WHERE id = mort_loteId AND mort_loteStatusRegistro = TRUE;
END;
$$;

-- EVENTO MORTE FEMEA:

CREATE OR REPLACE PROCEDURE novoEventoMorteFemea(
	femeaData DATE,
	femeaIdMatriz BIGINT,
	femeaCausaMorte VARCHAR(100),
	femeaObservacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO eventoMortalidadeFemea (mort_femeaData, mort_femeaIdMatriz, mort_femeaCausaMorte, mort_femeaObservacoes)
	VALUES (femeaData, femeaIdMatriz, femeaCausaMorte, femeaObservacoes);
END;
$$;

CREATE OR REPLACE PROCEDURE excluirEventoMorteFemea(id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE eventoMortalidadeFemea
	SET mort_femeaStatusRegistro = FALSE
	WHERE id = mort_femeaId AND mort_femeaStatusRegistro = TRUE;
END;
$$;
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
$$;CREATE OR REPLACE PROCEDURE novoRegistroGenetica(
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
CREATE OR REPLACE PROCEDURE novoRegistroInseminacao(
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO inseminacao (insem_brincoFemea, insem_geneticaMacho,
	insem_dataInseminacao, insem_tecnica, insem_resultado,
	insem_dataVerificacao) VALUES (brincoFemea, geneticaMacho,
	dataInseminacao, tecnica, resultado, dataVerificacao);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroInseminacao(
	id BIGINT,
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE inseminacao 
	SET insem_brincoFemea = brincoFemea,
		insem_geneticaMacho = geneticaMacho,
		insem_dataInseminacao = dataInseminacao,
		insem_tecnica = tecnica,
		insem_resultado = resultado,
		insem_dataVerificacao = dataVerificacao 
	WHERE insem_id = id AND insem_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroInseminacao(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE inseminacao 
	SET insem_statusRegistro = FALSE
	WHERE insem_id = id AND insem_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaInseminacao(p_periodo INT, p_resultado TYPE_INSEMRESULTADO)
RETURNS TABLE (
	id BIGINT,
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT insem_id AS id, insem_brincoFemea AS brincoFemea,
	insem_geneticaMacho AS geneticaMacho, insem_dataInseminacao AS dataInseminacao,
	insem_tecnica AS tecnica, insem_resultado AS resultado, insem_dataVerificacao AS dataVerificacao
	FROM inseminacao
	WHERE (p_periodo IS NULL OR insem_dataInseminacao >= CURRENT_DATE - p_periodo)
		AND (p_resultado IS NULL OR p_resultado = insem_resultado)
		AND (insem_statusRegistro = TRUE); 
END;
$$;CREATE OR REPLACE PROCEDURE comprarInsumos(
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
CREATE OR REPLACE FUNCTION verificaLogin(nickname VARCHAR(50), senha VARCHAR(50))
RETURNS TYPE_USERTIPO
LANGUAGE plpgsql
AS $$
DECLARE 
    resultado TYPE_USERTIPO;
BEGIN
    SELECT user_tipo INTO resultado
    FROM usuarios
    WHERE user_nickname = nickname
      AND user_senha = MD5(senha)
      AND user_statusRegistro = TRUE;

    RETURN resultado; 
END;
$$;
CREATE OR REPLACE PROCEDURE novoLote(
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS DEFAULT 'ativo'
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO lotes (lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao,
	lote_status) VALUES (nome, genetica, quantidade, dataCriacao, status);
END;
$$;

CREATE OR REPLACE PROCEDURE editaLote(
	idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS DEFAULT 'ativo'
)
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE lotes SET 
        lote_nome = nome,
        lote_genetica = genetica,
        lote_quantidade = quantidade,
		lote_dataCriacao = dataCriacao,
        lote_status = status
    WHERE idL = lote_id;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirLote(idL BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE lotes 
	SET lote_statusRegistro = FALSE,
		lote_status = 'inativo'
    WHERE idL = lote_id AND lote_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaPaginaLotes(geneticaNomeLote VARCHAR(50), statusLote VARCHAR(20))
RETURNS TABLE (
    idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
    quantidade INT,
    dataCriacao DATE,
    status TYPE_LOTESTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT lote_id AS idL, lote_nome AS nome, lote_genetica AS genetica, lote_quantidade AS quantidade,
    lote_dataCriacao AS dataCriacao, lote_status AS status
    FROM lotes
    WHERE (lote_statusRegistro = TRUE) AND (geneticaNomeLote IS NULL OR lote_genetica = geneticaNomeLote) 
		AND (statusLote IS NULL OR lote_status = NULLIF(statusLote, '')::TYPE_LOTESTATUS); 
END;
$$;CREATE OR REPLACE PROCEDURE novoRegistroMaternidade(
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    INSERT INTO maternidade (mater_brincoFemea, mater_genetica,
	mater_dataCobertura, mater_dataPartoPrevisto,
	mater_qtdeLeitoes, mater_status,
	mater_statusRegistro) VALUES (brincoFemea,
	genetica, dataCobertura, dataPartoPrevisto,
	qtdeLeitoes, status, statusRegistro);
END;
$$;

CREATE OR REPLACE PROCEDURE editarRegistroMaternidade(
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS DEFAULT 'disponivel',
	statusRegistro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE maternidade 
	SET mater_brincoFemea =  brincoFemea,
		mater_genetica = genetica,
		mater_dataCobertura = dataCobertura,
		mater_dataPartoPrevisto = dataPartoPrevisto,
		mater_qtdeLeitoes = qtdeLeitoes,
		mater_status = status,
		mater_statusRegistro = statusRegistro
	WHERE mater_id = id AND statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE PROCEDURE excluirRegistroMaternidade(id BIGINT)
LANGUAGE plpgsql
AS $$ 
BEGIN
    UPDATE maternidade 
	SET mater_statusRegistro = FALSE
	WHERE mater_id = id AND mater_statusRegistro = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION buscaMaternidade(p_gen VARCHAR(50), p_stat TYPE_MATERSTATUS)
RETURNS TABLE (
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    RETURN QUERY
    SELECT mater_id AS id, mater_brincoFemea AS brincoFemea, mater_genetica AS genetica,
	mater_dataCobertura AS dataCobertura, mater_dataPartoPrevisto AS dataPartoPrevisto,
	mater_qtdeLeitoes AS qtdeLeitoes, mater_status AS status
	FROM maternidade
	WHERE (p_gen IS NULL OR p_gen = mater_genetica) 
		AND (p_stat IS NULL OR p_stat = mater_status) 
		AND (mater_statusRegistro = TRUE);
END;
$$;
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
CREATE OR REPLACE FUNCTION quantidadeGeneticasAtivas()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(gen_id)
    INTO retorno
    FROM geneticas
    WHERE gen_status = 'ativa' AND gen_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLotesAtivos()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(lote_id)
	INTO retorno
	FROM lotes
	WHERE lote_status = 'ativo' AND lote_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeAnimaisAtivos()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT 
	INTO retorno
    COALESCE((SELECT SUM(lote_quantidade) FROM lotes), 0) +
    COALESCE((SELECT SUM(ber_qtdeLeitoes) FROM bercario), 0) +
    COALESCE((SELECT SUM(mater_qtdeLeitoes) FROM maternidade), 0) AS total_animais;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLotesQuarentenados()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(lote_id)
	INTO retorno
	FROM lotes
	WHERE lote_status = 'quarentenado' AND lote_statusRegistro = TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLeitoesBercario()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COALESCE(SUM(ber_qtdeLeitoes), 0)
	INTO retorno
	FROM bercario;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadePorcasGestantes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) 
	INTO retorno
	FROM maternidade
	WHERE mater_status = 'gestante';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadePorcasLactantes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS total_porcas_lactantes
	INTO retorno
	FROM maternidade
	WHERE mater_status = 'lactante';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeInseminacoesPendentes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS total_inseminacoes_pendentes
	INTO retorno
	FROM inseminacao
	WHERE insem_resultado = 'aguardando';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION buscaRelatorios(
    tipo VARCHAR(20), 
    dataIni DATE, 
    dataFim DATE
)
RETURNS TABLE (
    data DATE,
    loteMatriz BIGINT,
    quantidade BIGINT,
    observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    IF tipo = 'desmames' THEN
    
        RETURN QUERY
        SELECT 
            desm_data AS data,
            desm_loteId AS loteMatriz,
            desm_quantidadeDesmamados AS quantidade,
            desm_observacoes AS observacoes
        FROM eventoDesmame
        WHERE (dataIni IS NULL OR desm_data >= dataIni)
          AND (dataFim  IS NULL OR desm_data <= dataFim);

    ELSIF tipo = 'partos' THEN
    
        RETURN QUERY
        SELECT 
            parto_data AS data,
            parto_matrizId AS loteMatriz,
            parto_quantidadeNascidos AS quantidade,
            parto_observacoes AS observacoes
        FROM eventoParto
        WHERE (dataIni IS NULL OR parto_data >= dataIni)
          AND (dataFim  IS NULL OR parto_data <= dataFim);

    END IF;
END;
$$;
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

