DROP TABLE IF EXISTS ocorrencias;
DROP TABLE IF EXISTS bercario;
DROP TABLE IF EXISTS maternidade;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS contratos;
DROP TABLE IF EXISTS financeiro;
DROP TABLE IF EXISTS eventoParto;
DROP TABLE IF EXISTS eventoDesmame;
DROP TABLE IF EXISTS eventoMortalidadeLote;
DROP TABLE IF EXISTS eventoMortalidadeFemea;
DROP TABLE IF EXISTS eventoCoberturaInseminacao;
DROP TABLE IF EXISTS inseminacao;
DROP TABLE IF EXISTS lotes;
DROP TABLE IF EXISTS geneticas;
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS matriz;

CREATE TABLE matriz(
	matriz_id BIGSERIAL PRIMARY KEY,
	matriz_brinco varchar(50) NOT NULL UNIQUE,
	matriz_dataEntrada DATE NULL,
	matriz_ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios(
	user_id BIGSERIAL PRIMARY KEY,
	user_nome VARCHAR(50) UNIQUE NOT NULL,
	user_senha VARCHAR(50) NOT NULL,
	user_email VARCHAR(50) NULL,
	user_tipo TYPE_USERTIPO NOT NULL DEFAULT 'funcionario',
	user_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE geneticas(
	gen_id BIGSERIAL PRIMARY KEY, 
	gen_nome VARCHAR(50) NOT NULL UNIQUE,
	gen_descricao VARCHAR(150),
	gen_caracteristicas VARCHAR(150),
	gen_status BOOLEAN DEFAULT TRUE
);

CREATE TABLE lotes(
	lote_id BIGSERIAL PRIMARY KEY,
	lote_nome VARCHAR(50) UNIQUE,
	lote_genetica VARCHAR(50) NOT NULL REFERENCES geneticas(gen_nome), 
	lote_quantidade INT,
	lote_dataCriacao DATE NULL,
	lote_status TYPE_LOTESTATUS NOT NULL DEFAULT 'ativo'
);

CREATE TABLE ocorrencias(
	ocor_id BIGSERIAL PRIMARY KEY,
	ocor_data DATE,
	ocor_hora TIME,
	ocor_lote BIGINT NOT NULL,
	ocor_tipo TYPE_OCORRTIPO,
	ocor_prioridade TYPE_OCORRPRIORIDADE,
	ocor_titulo VARCHAR(100),
	ocor_status TYPE_OCORRSTATUS,
	ocor_user VARCHAR(50) NOT NULL,
	ocor_registro BOOLEAN DEFAULT TRUE,

	FOREIGN KEY (ocor_lote) REFERENCES lotes(lote_id),
	FOREIGN KEY (ocor_user) REFERENCES usuarios(user_nome)
);

CREATE TABLE insumos(
	insu_id BIGSERIAL PRIMARY KEY,
    insu_nome TYPE_INSUMOS NOT NULL,
	insu_dataCompra DATE,
	insu_quantidade FLOAT4 NOT NULL,
	insu_nomeFornecedor VARCHAR(50),
	insu_custoTotal FLOAT4,
	insu_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE bercario(
	ber_id BIGSERIAL,
	ber_loteNome VARCHAR(50) NOT NULL,
	ber_qtdeLeitoes INT,
	ber_dataNascimento DATE,
	ber_pesoMedio FLOAT4,
	ber_status TYPE_BERSTATUS NOT NULL,
	ber_dataDesmame DATE,

	FOREIGN KEY (ber_loteNome) REFERENCES lotes(lote_nome)
);

CREATE TABLE maternidade(
	mater_id BIGSERIAL PRIMARY KEY,
	mater_brincoFemea VARCHAR(30) NOT NULL REFERENCES matriz(matriz_brinco),
	mater_genetica BIGINT NOT NULL,
	mater_dataCobertura DATE,
	mater_dataPartoPrevisto DATE,
	mater_qtdeLeiloes INT,
	mater_status TYPE_MATERSTATUS NOT NULL,

	FOREIGN KEY (mater_genetica) REFERENCES geneticas(gen_id)
);

CREATE TABLE inseminacao(
	insem_id BIGSERIAL PRIMARY KEY,
	insem_brincoFemea VARCHAR(30) NOT NULL REFERENCES matriz(matriz_brinco),
	insem_geneticaMacho BIGINT NOT NULL,
	insem_dataInseminacao DATE NOT NULL,
	insem_tecnica VARCHAR(30),
	insem_resultado TYPE_INSEMRESULTADO NOT NULL,
	insem_dataVerificacao DATE NULL,
 
	FOREIGN KEY (insem_geneticaMacho) REFERENCES geneticas (gen_id)
);

CREATE TABLE eventoCoberturaInseminacao(
	cobert_id BIGSERIAL PRIMARY KEY,
	cobert_data DATE NOT NULL,
	cobert_inseminacaoId BIGINT NOT NULL REFERENCES inseminacao(insem_id),
	cobert_observacoes VARCHAR(350) NOT NULL
);

CREATE TABLE eventoParto(
	parto_id BIGSERIAL PRIMARY KEY,
	parto_data DATE NOT NULL,
	part_brincoFemea VARCHAR(30) NOT NULL REFERENCES matriz(matriz_brinco),
	parto_quantidadeNascidos BIGINT NOT NULL,
	parto_observacoes VARCHAR(350) NOT NULL

);

CREATE TABLE eventoDesmame(
	desm_id BIGSERIAL PRIMARY KEY,
	desm_loteId BIGINT NOT NULL REFERENCES lotes(lote_id),
	desm_quantidadeDesmamados BIGINT NOT NULL,
	desm_observacoes VARCHAR(350)
);

CREATE TABLE eventoMortalidadeLote(
	mort_id BIGSERIAL PRIMARY KEY,
	mort_data DATE NOT NULL,
	mort_idLote BIGINT NOT NULL REFERENCES lotes(lote_id),
	mort_observacoes VARCHAR(350)
);

CREATE TABLE eventoMortalidadeFemea(
	mort_id BIGSERIAL PRIMARY KEY,
	mort_data DATE NOT NULL,
	mort_brincoFemea VARCHAR(30) NOT NULL REFERENCES matriz(matriz_brinco),
	mort_observacoes VARCHAR(350)
);

CREATE TABLE contratos(
	cont_id BIGSERIAL PRIMARY KEY,
	cont_fornecedor VARCHAR(50),
	cont_objeto VARCHAR(100) NOT NULL,
	cont_dataInicio DATE NOT NULL,
	cont_dataVencimento DATE NOT NULL,
	cont_satus TYPE_STATUSCONTRATO NOT NULL
);

CREATE TABLE financeiro(
	fin_id BIGSERIAL PRIMARY KEY,
	finan_data DATE,
	finan_descricao VARCHAR(350),
	finan_valor FLOAT4,
	finan_tipo TYPE_FINANCEIROTIPO NOT NULL,
	finan_categoria TYPE_FINANCEIROCATEGORIA NOT NULL
);

CREATE TABLE tarefas (
	tar_id BIGSERIAL PRIMARY KEY,
	tar_atribuidoNome VARCHAR(50) NOT NULL REFERENCES usuarios(user_nome),
	tar_prioridade TYPE_TAREFAPRIORIDADE NOT NULL DEFAULT 'baixa',
	tar_status TYPE_TAREFASTATUS NOT NULL DEFAULT 'pendente'
);

