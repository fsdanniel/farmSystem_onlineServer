--login
DROP FUNCTION IF EXISTS verificaLogin(VARCHAR(50), VARCHAR(50));
--bercario
DROP PROCEDURE IF EXISTS novoRegistroBercario(
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS,
	statusRegistro BOOLEAN);
DROP PROCEDURE IF EXISTS editarRegistroBercario(
	id BIGINT,
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS,
	statusRegistro BOOLEAN);
DROP PROCEDURE IF EXISTS excluirRegistroBercario(
	id BIGINT);
DROP FUNCTION IF EXISTS buscaBercario(
	nome VARCHAR(50), 
	stat TYPE_BERSTATUS);
--contratos
DROP PROCEDURE IF EXISTS novoRegistroContrato(
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE);
DROP PROCEDURE IF EXISTS editarRegistroContrato(
	id BIGINT,
	fornecedor VARCHAR(50),
	objeto VARCHAR(100),
	dataInicio DATE,
	dataVencimento DATE);
DROP PROCEDURE IF EXISTS excluirRegistroContrato(
	id BIGINT);
DROP FUNCTION IF EXISTS buscaContratos();
--eventos
DROP PROCEDURE IF EXISTS novoEventoCoberturaInseminacao(
	dataCobertura DATE,
	matrizId BIGINT,
	tipo TYPE_EVENTOCOBERTURAINSEMINACAOTIPO,
	observacoes VARCHAR(350)
);
DROP PROCEDURE IF EXISTS excluirEventoCoberturaInseminacao(id BIGINT);
DROP PROCEDURE IF EXISTS novoEventoParto(
	data DATE,
	matrizId BIGINT,
	quantidadeNascidos BIGINT,
	observacoes VARCHAR(350)
);
DROP PROCEDURE IF EXISTS excluirEventoParto(id BIGINT);
DROP PROCEDURE IF EXISTS novoEventoDesmame(
	data DATE,
	loteId BIGINT,
	quantidadeDesmamados BIGINT,
	observacoes VARCHAR(350)
);
DROP PROCEDURE IF EXISTS excluirEventoDesmame(id BIGINT);
DROP PROCEDURE IF EXISTS novoEventoMorteLote(
	loteData DATE,
	loteIdLote BIGINT,
	loteCausaMorte VARCHAR(100),
	loteObservacoes VARCHAR(350)
);
DROP PROCEDURE IF EXISTS excluirEventoMorteLote(id BIGINT);
DROP PROCEDURE IF EXISTS novoEventoMorteFemea(
	femeaData DATE,
	femeaIdMatriz BIGINT,
	femeaCausaMorte VARCHAR(100),
	femeaObservacoes VARCHAR(350)
);
DROP PROCEDURE IF EXISTS excluirEventoMorteFemea(id BIGINT);
--financeiro
DROP PROCEDURE IF EXISTS novoRegistroFinanceiro(
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA);
DROP PROCEDURE IF EXISTS editarRegistroFinanceiro(
	id BIGINT,
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA);
DROP PROCEDURE IF EXISTS excluirRegistroFinanceiro(id BIGINT);
DROP FUNCTION IF EXISTS buscaFinanceiro();
--geneticas
DROP PROCEDURE IF EXISTS novoRegistroGenetica(
	nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS);
DROP PROCEDURE IF EXISTS editaRegistroGenetica(
	idGen BIGINT,
    nome VARCHAR(50),
    descricao VARCHAR(150),
    caracteristicas VARCHAR(150),
	status TYPE_GENETICASTATUS);
DROP PROCEDURE IF EXISTS excluirRegistroGenetica(idGen BIGINT);
DROP FUNCTION IF EXISTS buscaGenetica(
	nomeX VARCHAR(50));
DROP FUNCTION IF EXISTS listaNomesGeneticas();
DROP FUNCTION IF EXISTS listagemFinalPaginaGeneticas();
--inseminacao
DROP PROCEDURE IF EXISTS novoRegistroInseminacao(
	brincoFemea VARCHAR(30),
	geneticaMacho VARCHAR(50),
	dataInseminacao DATE,
	tecnica VARCHAR(30),
	resultado TYPE_INSEMRESULTADO,
	dataVerificacao DATE);
DROP PROCEDURE IF EXISTS editarRegistroInseminacao(
	id BIGINT,
	insem_brincoFemea VARCHAR(30),
	insem_geneticaMacho VARCHAR(50),
	insem_dataInseminacao DATE,
	insem_tecnica VARCHAR(30),
	insem_resultado TYPE_INSEMRESULTADO,
	insem_dataVerificacao DATE);
DROP PROCEDURE IF EXISTS excluirRegistroInseminacao(
	id BIGINT);
DROP FUNCTION IF EXISTS buscaInseminacao(
	p_periodo INT,
	p_resultado TYPE_INSEMRESULTADO
);
--insumos
DROP PROCEDURE IF EXISTS comprarInsumos(
	nome TYPE_INSUMOS,
	dataCompra DATE,
	quantidade FLOAT4,
	nomeFornecedor VARCHAR(50),
	custoTotal FLOAT4,
	statusRegistro BOOLEAN);
DROP PROCEDURE IF EXISTS excluirInsumos(
	id BIGINT);
DROP FUNCTION IF EXISTS historicoInsumos();
DROP FUNCTION IF EXISTS estoqueInsumos();
--lotes
DROP PROCEDURE IF EXISTS novoLote(
	nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS);
DROP PROCEDURE IF EXISTS editaLote(
	idL BIGINT,
    nome VARCHAR(50),
    genetica VARCHAR(50),
	quantidade INT,
	dataCriacao DATE,
	status TYPE_LOTESTATUS);
DROP PROCEDURE IF EXISTS excluirLote(idL BIGINT);
DROP FUNCTION IF EXISTS buscaPaginaLotes(
	geneticaNomeLote VARCHAR(50), 
	statusLote VARCHAR(20));
--maternidade
DROP PROCEDURE IF EXISTS novoRegistroMaternidade(
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS ,
	statusRegistro BOOLEAN);
DROP PROCEDURE IF EXISTS editarRegistroMaternidade(
	id BIGINT,
	brincoFemea VARCHAR(10),
	genetica VARCHAR(50),
	dataCobertura DATE,
	dataPartoPrevisto DATE,
	qtdeLeitoes INT,
	status TYPE_MATERSTATUS,
	statusRegistro BOOLEAN);
DROP PROCEDURE IF EXISTS excluirRegistroMaternidade(id BIGINT);
DROP FUNCTION IF EXISTS buscaMaternidade(
	p_gen VARCHAR(50), 
	p_stat TYPE_MATERSTATUS);
--ocorrencias
DROP PROCEDURE IF EXISTS novaOcorrencia(
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
DROP PROCEDURE IF EXISTS editarOcorrencia(
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
DROP PROCEDURE IF EXISTS excluirOcorrencia(id BIGINT);
DROP FUNCTION IF EXISTS buscaOcorrencias(loteNome VARCHAR(30), tip TYPE_OCORRTIPO, prioridad TYPE_OCORRPRIORIDADE);
DROP FUNCTION IF EXISTS listagemLotes();
DROP FUNCTION IF EXISTS quantidadeOcorrenciasCriticas();
DROP FUNCTION IF EXISTS quantidadeOcorrenciasPendentes();
DROP FUNCTION IF EXISTS quantidadeOcorrenciasResolvidasHoje();
--relatorios
DROP FUNCTION IF EXISTS quantidadeGeneticasAtivas();
DROP FUNCTION IF EXISTS quantidadeLotesAtivos();
DROP FUNCTION IF EXISTS quantidadeAnimaisAtivos();
DROP FUNCTION IF EXISTS quantidadeLotesQuarentenados();
DROP FUNCTION IF EXISTS quantidadeLeitoesBercario();
DROP FUNCTION IF EXISTS quantidadePorcasGestantes();
DROP FUNCTION IF EXISTS quantidadePorcasLactantes();
DROP FUNCTION IF EXISTS quantidadeInseminacoesPendentes();
DROP FUNCTION IF EXISTS buscaRelatorios(
	tipo VARCHAR(20), 
	dataIni DATE, 
	dataFim DATE);
--tarefas
DROP PROCEDURE IF EXISTS novoRegistroTarefa(
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS);
DROP PROCEDURE IF EXISTS editarRegistroTarefa(
	id BIGINT,
	titulo VARCHAR(100),
	descricao VARCHAR(350),
	usuarioResponsavel VARCHAR(50),
	prioridade TYPE_TAREFAPRIORIDADE,
	status TYPE_TAREFASTATUS);
DROP PROCEDURE IF EXISTS excluirRegistroTarefa(
	id BIGINT);
DROP FUNCTION IF EXISTS buscaTarefas();
DROP PROCEDURE IF EXISTS concluirTarefa(id BIGINT);
DROP FUNCTION IF EXISTS minhasTarefas(usuarioNome VARCHAR(50));
--usuarios
DROP PROCEDURE IF EXISTS novoRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50),
	nome VARCHAR(50),
	tipo TYPE_USERTIPO,
	senha VARCHAR(50));
DROP PROCEDURE IF EXISTS editarRegistroUsuario(
	--id BIGINT,
	old_nickname VARCHAR(50),
	new_nickname VARCHAR(50),
	new_nome VARCHAR(50),
	new_tipo TYPE_USERTIPO,
	new_senha VARCHAR(50));
DROP PROCEDURE IF EXISTS excluirRegistroUsuario(
	--id BIGINT,
	nickname VARCHAR(50));
DROP FUNCTION IF EXISTS buscaUsuarios();