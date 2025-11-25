TRUNCATE TABLE ocorrencias RESTART IDENTITY CASCADE;
TRUNCATE TABLE bercario RESTART IDENTITY CASCADE;
TRUNCATE TABLE insumos RESTART IDENTITY CASCADE;
TRUNCATE TABLE contratos RESTART IDENTITY CASCADE;
TRUNCATE TABLE financeiro RESTART IDENTITY CASCADE;
TRUNCATE TABLE eventoParto RESTART IDENTITY CASCADE;
TRUNCATE TABLE eventoDesmame RESTART IDENTITY CASCADE;
TRUNCATE TABLE eventoMortalidadeLote RESTART IDENTITY CASCADE;
TRUNCATE TABLE eventoMortalidadeFemea RESTART IDENTITY CASCADE;
TRUNCATE TABLE eventoCoberturaInseminacao RESTART IDENTITY CASCADE;
TRUNCATE TABLE tarefas RESTART IDENTITY CASCADE;
TRUNCATE TABLE inseminacao RESTART IDENTITY CASCADE;
TRUNCATE TABLE lotes RESTART IDENTITY CASCADE;
TRUNCATE TABLE geneticas RESTART IDENTITY CASCADE;
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE maternidade RESTART IDENTITY CASCADE;

DROP TABLE IF EXISTS ocorrencias;
DROP TABLE IF EXISTS bercario;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS contratos;
DROP TABLE IF EXISTS financeiro;
DROP TABLE IF EXISTS eventoParto;
DROP TABLE IF EXISTS eventoDesmame;
DROP TABLE IF EXISTS eventoMortalidadeLote;
DROP TABLE IF EXISTS eventoMortalidadeFemea;
DROP TABLE IF EXISTS eventoCoberturaInseminacao;
DROP TABLE IF EXISTS inseminacao;
DROP TABLE IF EXISTS maternidade;
DROP TABLE IF EXISTS lotes;
DROP TABLE IF EXISTS geneticas;
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
	user_id BIGSERIAL PRIMARY KEY,
	user_nickname VARCHAR(50) UNIQUE NOT NULL,
	user_nome VARCHAR(50) UNIQUE NOT NULL,
	user_senha VARCHAR(50) NOT NULL,
	user_email VARCHAR(50) NULL,
	user_tipo TYPE_USERTIPO NOT NULL DEFAULT 'funcionario',
	
	user_statusRegistro BOOLEAN DEFAULT TRUE
);

CREATE TABLE geneticas(
	gen_id BIGSERIAL PRIMARY KEY, 
	gen_nome VARCHAR(50) NOT NULL UNIQUE,
	gen_descricao VARCHAR(150),
	gen_caracteristicas VARCHAR(150),
	gen_status TYPE_GENETICASTATUS DEFAULT 'ativa',

	gen_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE lotes(
	lote_id BIGSERIAL PRIMARY KEY,
	lote_nome VARCHAR(30) UNIQUE,
	lote_genetica VARCHAR(50) NOT NULL REFERENCES geneticas(gen_nome), 
	lote_quantidade INT,
	lote_dataCriacao DATE NULL,
	lote_status TYPE_LOTESTATUS NOT NULL DEFAULT 'ativo',

	lote_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ocorrencias(
	ocor_id BIGSERIAL PRIMARY KEY,
	ocor_loteNome VARCHAR(30),
	ocor_tipo TYPE_OCORRTIPO,
	ocor_prioridade TYPE_OCORRPRIORIDADE,
	ocor_dia DATE,
	ocor_hora TIME,
	ocor_titulo VARCHAR(100),
	ocor_descricao VARCHAR(300),
	ocor_quantidadeAnimaisAfetados INTEGER,
	ocor_medicamentoAplicado VARCHAR(30),
	ocor_dosagem VARCHAR(30),
	ocor_responsavel VARCHAR(50),
	ocor_proximasAcoes VARCHAR(300),
	ocor_status TYPE_OCORRSTATUS DEFAULT 'pendente',

	ocor_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE,
	

	FOREIGN KEY (ocor_loteNome) REFERENCES lotes(lote_nome),
	FOREIGN KEY (ocor_responsavel) REFERENCES usuarios(user_nome)
);

CREATE TABLE insumos(
	insu_id BIGSERIAL PRIMARY KEY,
    insu_nome TYPE_INSUMOS NOT NULL,
	insu_dataCompra DATE,
	insu_quantidade FLOAT4 NOT NULL,
	insu_nomeFornecedor VARCHAR(50),
	insu_custoTotal FLOAT4,

	insu_statusRegistro BOOLEAN DEFAULT TRUE
);

CREATE TABLE bercario(
	ber_id BIGSERIAL,
	ber_loteNome VARCHAR(50) NOT NULL,
	ber_qtdeLeitoes INT,
	ber_dataNascimento DATE,
	ber_pesoMedio FLOAT4,
	ber_status TYPE_BERSTATUS NOT NULL,
	ber_dataDesmame DATE,

	ber_statusRegistro BOOLEAN DEFAULT TRUE,

	FOREIGN KEY (ber_loteNome) REFERENCES lotes(lote_nome)
);

CREATE TABLE maternidade(
	mater_id BIGSERIAL PRIMARY KEY,
	mater_brincoFemea VARCHAR(30) NOT NULL UNIQUE,
	mater_genetica VARCHAR(50) NOT NULL,
	mater_dataCobertura DATE,
	mater_dataPartoPrevisto DATE NULL,
	mater_qtdeLeitoes INT NULL,
	mater_status TYPE_MATERSTATUS NOT NULL DEFAULT 'disponivel',

	mater_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE,

	FOREIGN KEY (mater_genetica) REFERENCES geneticas(gen_nome)
);

CREATE TABLE inseminacao(
	insem_id BIGSERIAL PRIMARY KEY,
	insem_brincoFemea VARCHAR(30) NOT NULL REFERENCES maternidade(mater_brincoFemea),
	insem_geneticaMacho VARCHAR(50) NOT NULL,
	insem_dataInseminacao DATE NOT NULL,
	insem_tecnica VARCHAR(30),
	insem_resultado TYPE_INSEMRESULTADO NOT NULL,
	insem_dataVerificacao DATE NULL,
 
	insem_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE,
	FOREIGN KEY (insem_geneticaMacho) REFERENCES geneticas (gen_nome)
);

CREATE TABLE eventoCoberturaInseminacao(
	cobert_id BIGSERIAL PRIMARY KEY,
	cobert_dataCobertura DATE NOT NULL,
	cobert_matrizId BIGINT NOT NULL REFERENCES maternidade(mater_id),
	cobert_tipo TYPE_EVENTOCOBERTURAINSEMINACAOTIPO NULL,
	cobert_observacoes VARCHAR(350) NULL,
	cobert_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE eventoParto(
	parto_id BIGSERIAL PRIMARY KEY,
	parto_data DATE NOT NULL,
	parto_matrizId BIGINT NOT NULL REFERENCES maternidade(mater_id),
	parto_quantidadeNascidos BIGINT NOT NULL,
	parto_observacoes VARCHAR(350) NOT NULL,
	parto_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE

);

CREATE TABLE eventoDesmame(
	desm_id BIGSERIAL PRIMARY KEY,
	desm_data DATE NULL,
	desm_loteId BIGINT NOT NULL REFERENCES lotes(lote_id),
	desm_quantidadeDesmamados BIGINT NOT NULL,
	desm_observacoes VARCHAR(350),
	desm_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE eventoMortalidadeLote(
	mort_loteId BIGSERIAL PRIMARY KEY,
	mort_loteData DATE NOT NULL,
	mort_loteIdLote BIGINT NOT NULL REFERENCES lotes(lote_id),
	mort_loteCausaMorte VARCHAR(100),
	mort_loteObservacoes VARCHAR(350),
	mort_loteStatusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE eventoMortalidadeFemea(
	mort_femeaId BIGSERIAL PRIMARY KEY,
	mort_femeaData DATE NOT NULL,
	mort_femeaIdMatriz BIGINT NOT NULL REFERENCES maternidade(mater_id),
	mort_femeaCausaMorte VARCHAR(100),
	mort_femeaObservacoes VARCHAR(350),
	mort_femeaStatusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE contratos(
	cont_id BIGSERIAL PRIMARY KEY,
	cont_fornecedor VARCHAR(50),
	cont_objeto VARCHAR(100) NOT NULL,
	cont_dataInicio DATE NOT NULL,
	cont_dataVencimento DATE NOT NULL,
	cont_status TYPE_STATUSCONTRATO NOT NULL,

	cont_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE financeiro(
	finan_id BIGSERIAL PRIMARY KEY,
	finan_data DATE,
	finan_descricao VARCHAR(350),
	finan_valor FLOAT4,
	finan_tipo TYPE_FINANCEIROTIPO NOT NULL,
	finan_categoria TYPE_FINANCEIROCATEGORIA NOT NULL,

	finan_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tarefas (
	tar_id BIGSERIAL PRIMARY KEY,
	tar_titulo VARCHAR(100) NOT NULL,
	tar_descricao VARCHAR(350) NULL,
	tar_usuarioResponsavel VARCHAR(50) NOT NULL REFERENCES usuarios(user_nome),
	tar_prioridade TYPE_TAREFAPRIORIDADE NOT NULL DEFAULT 'baixa',
	tar_status TYPE_TAREFASTATUS NOT NULL DEFAULT 'pendente',
	tar_statusRegistro BOOLEAN NOT NULL DEFAULT TRUE
);

