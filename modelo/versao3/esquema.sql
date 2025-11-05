DROP TABLE IF EXISTS contratoFornecimento;
DROP TABLE IF EXISTS fornecedores;
DROP TABLE IF EXISTS administradores;
DROP TABLE IF EXISTS ocorrencias;
DROP TABLE IF EXISTS veterinarios;
DROP TABLE IF EXISTS funcionarios;
DROP TABLE IF EXISTS bercario;
DROP TABLE IF EXISTS maternidade;
DROP TABLE IF EXISTS inseminacao;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS geneticas;
DROP TABLE IF EXISTS lotes;

DROP TYPE IF EXISTS TYPE_LOTESTATUS;
DROP TYPE IF EXISTS TYPE_OCORRTIPO;
DROP TYPE IF EXISTS TYPE_OCORRPRIORIDADE;
DROP TYPE IF EXISTS TYPE_OCORRSTATUS;
DROP TYPE IF EXISTS TYPE_INSUMOS;
DROP TYPE IF EXISTS TYPE_EVENTOS;
DROP TYPE IF EXISTS TYPE_BERSTATUS;
DROP TYPE IF EXISTS TYPE_MATERSTATUS;
DROP TYPE IF EXISTS TYPE_INSEMRESULTADO;

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

CREATE TABLE fornecedores (
    forn_id BIGSERIAL PRIMARY KEY,
    forn_nome VARCHAR(50) NOT NULL,
    forn_cnpj VARCHAR(30) NOT NULL,
    forn_contato VARCHAR(30) NOT NULL,
	forn_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE contratoFornecimento(
	con_id BIGSERIAL PRIMARY KEY,
	con_fornId BIGINT NOT NULL REFERENCES fornecedores(forn_Id),
	con_descricao VARCHAR(150),
	con_dataInicio DATE,
	con_dataFIM DATE,
	con_valorTotal FLOAT4,
	con_status BOOLEAN DEFAULT TRUE
);

CREATE TABLE administradores (
	adm_id BIGSERIAL PRIMARY KEY,
	adm_nome VARCHAR(50) UNIQUE NOT NULL,
	adm_senha VARCHAR(25) NOT NULL,
	adm_email VARCHAR(50) NOT NULL,
	adm_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE veterinarios (
	vet_id BIGSERIAL PRIMARY KEY,
	vet_nome VARCHAR(50) UNIQUE NOT NULL,
	vet_senha VARCHAR(25) NOT NULL,
	vet_email VARCHAR(50) NOT NULL,
	vet_ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE funcionarios (
	fun_id BIGSERIAL PRIMARY KEY,
	fun_nome VARCHAR(50) UNIQUE NOT NULL,
	fun_senha VARCHAR(25) NOT NULL,
	fun_email VARCHAR(50) NOT NULL,
	fun_ativo BOOLEAN DEFAULT TRUE
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

CREATE TABLE insumos (
	insu_id BIGSERIAL PRIMARY KEY,
    insu_nome TYPE_INSUMOS NOT NULL,
	insu_dataCompra DATE,
	insu_quantidade FLOAT4,
	insu_nomeFornecedor VARCHAR(50),
	insu_custoTotal FLOAT4
);

CREATE TABLE ocorrencias (
	ocor_id BIGSERIAL PRIMARY KEY,
	ocor_data DATE,
	ocor_hora TIME,
	ocor_lote BIGINT NOT NULL,
	ocor_tipo TYPE_OCORRTIPO,
	ocor_prioridade TYPE_OCORRPRIORIDADE,
	ocor_status TYPE_OCORRSTATUS,
	ocor_veterinario VARCHAR(50) NOT NULL,
	ocor_registro BOOLEAN DEFAULT TRUE,

	FOREIGN KEY (ocor_lote) REFERENCES lotes(lote_id),
	FOREIGN KEY (ocor_veterinario) REFERENCES veterinarios(vet_nome)
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
