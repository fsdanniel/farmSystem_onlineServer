DROP TABLE IF EXISTS fornecedores;
DROP TABLE IF EXISTS ocorrencias;
DROP TABLE IF EXISTS veterinarios;
DROP TABLE IF EXISTS bercario;
DROP TABLE IF EXISTS maternidade;
DROP TABLE IF EXISTS inseminacao;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS geneticas;
DROP TABLE IF EXISTS lotes;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS MovimentacoesFinanceiras;
DROP TABLE IF EXISTS usuarios;

DROP TYPE IF EXISTS TYPE_LOTESTATUS;
DROP TYPE IF EXISTS TYPE_OCORRTIPO;
DROP TYPE IF EXISTS TYPE_OCORRPRIORIDADE;
DROP TYPE IF EXISTS TYPE_OCORRSTATUS;
DROP TYPE IF EXISTS TYPE_INSUMOS;
DROP TYPE IF EXISTS TYPE_EVENTOS;
DROP TYPE IF EXISTS TYPE_BERSTATUS;
DROP TYPE IF EXISTS TYPE_MATERSTATUS;
DROP TYPE IF EXISTS TYPE_INSEMRESULTADO;
DROP TYPE IF EXISTS TYPE_USERTIPO;

CREATE TYPE TYPE_LOTESTATUS AS ENUM ('ativo', 'inativo', 'quarentenado');
CREATE TYPE TYPE_OCORRTIPO AS ENUM ('sanitaria', 'alimentacao', 'medicamento',
'transferencia', 'observacao', 'vacina', 'morte');
CREATE TYPE TYPE_OCORRPRIORIDADE AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE TYPE_OCORRSTATUS AS ENUM ('pendente', 'em andamento', 'resolvida');
CREATE TYPE TYPE_INSUMOS AS ENUM('milho(em grao)', 'farelo de soja', 'nucleo crescimento',
'complexo vitaminico', 'medicamento x');
CREATE TYPE TYPE_EVENTOS AS ENUM ('cobertura/inseminacao', 'parto', 'desmame', 'mortalidade');
CREATE TYPE TYPE_BERSTATUS AS ENUM ('ativo', 'desmamado', 'transferido');
CREATE TYPE TYPE_MATERSTATUS AS ENUM ('gestante', 'lactante', 'disponivel', 'recuperacao');
CREATE TYPE TYPE_INSEMRESULTADO AS ENUM ('aguardando', 'positivo', 'negativo');
CREATE TYPE TYPE_USERTIPO AS ENUM ('administrador', 'funcionario', 'veterinario');

CREATE TABLE insumos (
	insu_id BIGSERIAL PRIMARY KEY,
    insu_nome TYPE_INSUMOS NOT NULL,
	insu_dataCompra DATE,
	insu_quantidade FLOAT4 NOT NULL,
	insu_nomeFornecedor VARCHAR(50),
	insu_custoTotal FLOAT4,
	insu_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios (
	user_id BIGSERIAL PRIMARY KEY,
	user_nome VARCHAR(50) UNIQUE NOT NULL,
	user_senha VARCHAR(25) NOT NULL,
	user_email VARCHAR(50) NULL,
	user_tipo TYPE_USERTIPO NOT NULL DEFAULT 'funcionario',
	user_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE geneticas (
	gen_id BIGSERIAL PRIMARY KEY, 
	gen_nome VARCHAR(50) NOT NULL UNIQUE,
	gen_descricao VARCHAR(150),
	gen_caracteristicas VARCHAR(150),
	gen_status BOOLEAN DEFAULT TRUE
);

CREATE TABLE lotes (
	lote_id BIGSERIAL,
	lote_nome VARCHAR(50) UNIQUE,
	lote_genetica VARCHAR(50) NOT NULL REFERENCES geneticas(gen_nome), 
	lote_quantidade INT,
	lote_dataCriacao DATE,
	lote_status TYPE_LOTESTATUS NOT NULL DEFAULT 'ativo',

	PRIMARY KEY (lote_id)
);

CREATE TABLE bercario (
	ber_id BIGSERIAL,
	ber_loteNome VARCHAR(50) NOT NULL,
	ber_qtdeLeitoes INT,
	ber_dataNascimento DATE,
	ber_pesoMedio FLOAT4,
	ber_status TYPE_BERSTATUS NOT NULL,
	ber_dataDesmame DATE,

	FOREIGN KEY (ber_loteNome) REFERENCES lotes(lote_nome)
);

CREATE TABLE maternidade (
	mater_id BIGSERIAL,
	mater_brincoFemea VARCHAR(30) NOT NULL,
	mater_genetica BIGINT NOT NULL,
	mater_dataCobertura DATE,
	mater_dataPartoPrevisto DATE,
	mater_qtdeLeiloes INT,
	mater_status TYPE_MATERSTATUS NOT NULL,

	FOREIGN KEY (mater_genetica) REFERENCES geneticas(gen_id)
);

CREATE TABLE inseminacao (
	insem_id BIGSERIAL,
	insem_brincoFemea VARCHAR(30) NOT NULL,
	insem_geneticaMacho BIGINT NOT NULL,
	insem_dataInseminacao DATE NOT NULL,
	insem_tecnica VARCHAR(30),
	insem_resultado TYPE_INSEMRESULTADO NOT NULL,
	insem_dataVerificacao DATE,
 
	FOREIGN KEY (insem_geneticaMacho) REFERENCES geneticas (gen_id)
);

CREATE TABLE ocorrencias (
	ocor_id BIGSERIAL PRIMARY KEY,
	ocor_data DATE,
	ocor_hora TIME,
	ocor_lote BIGINT NOT NULL,
	ocor_tipo TYPE_OCORRTIPO,
	ocor_prioridade TYPE_OCORRPRIORIDADE,
	ocor_status TYPE_OCORRSTATUS,
	ocor_user VARCHAR(50) NOT NULL,
	ocor_registro BOOLEAN DEFAULT TRUE,

	FOREIGN KEY (ocor_lote) REFERENCES lotes(lote_id),
	FOREIGN KEY (ocor_user) REFERENCES usuarios(user_nome)
);

CREATE TABLE eventos (
	evento_id BIGSERIAL PRIMARY KEY,
	evento_tipo TYPE_EVENTOS NOT NULL,
	evento_data DATE,
	evento_lote BIGINT NOT NULL,
	evento_quantidade BIGINT,
	evento_observacoes VARCHAR(150),

	FOREIGN KEY (evento_lote) REFERENCES lotes(lote_id)
);
