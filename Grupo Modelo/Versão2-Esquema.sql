-- Fase 0:

DROP TABLE IF EXISTS Administradores;
DROP TABLE IF EXISTS Funcionarios;
DROP TABLE IF EXISTS Veterinarios;

CREATE TABLE Administradores
(
    Adm_Id BIGSERIAL,
    Adm_Nome character varying,
	Adm_Senha VARCHAR(32) NOT NULL,
    Adm_Nascimento date,
    Adm_Email character varying,
	Adm_Ativo BOOLEAN DEFAULT TRUE,
	
    PRIMARY KEY (Adm_Nome, Adm_Email)
);

CREATE TABLE Funcionarios
(
    Fun_Id BIGSERIAL,
    Fun_Nome character varying,
	Fun_Senha VARCHAR(32) NOT NULL,
    Fun_Nascimento date,
    Fun_Email character varying,
	Fun_Ativo BOOLEAN DEFAULT TRUE,
	
    PRIMARY KEY (Fun_Nome, Fun_Email)
);

CREATE TABLE Veterinarios
(
    Vet_Id BIGSERIAL,
    Vet_Nome character varying,
	Vet_Senha VARCHAR(32) NOT NULL,
    Vet_Nascimento DATE,
    Vet_Email character varying,
	Vet_Ativo BOOLEAN DEFAULT TRUE,
	
    PRIMARY KEY (Vet_Nome, Vet_Email)
);

SELECT * FROM Administradores;
SELECT * FROM Funcionarios;
SELECT * FROM Veterinarios;

DELETE FROM Administradores;
DELETE FROM Funcionarios;
DELETE FROM Veterinarios;

-- Fase 1:

DROP TABLE IF EXISTS Geneticas;
DROP TABLE IF EXISTS Matrizes;
DROP TABLE IF EXISTS Lotes;

CREATE TABLE Geneticas
(
	Gen_Id SERIAL UNIQUE,
	Gen_Nome character varying UNIQUE,
	Gen_Descricao character varying NULL,
	
	PRIMARY KEY(Gen_Nome)
);

CREATE TABLE Matrizes
(
	Mat_Id BIGSERIAL UNIQUE,
	Mat_Nascimento DATE,
	Mat_Gen SERIAL UNIQUE,
	Mat_Ativo BOOLEAN DEFAULT TRUE,

	PRIMARY KEY(Mat_Id, Mat_Nascimento),
	FOREIGN KEY (Mat_Gen) REFERENCES Geneticas(Gen_Id)
);

CREATE TABLE Lotes
(
	Lot_Id BIGSERIAL UNIQUE,
	Lot_Matriz BIGSERIAL UNIQUE NOT NULL,
	Lot_Nascimento DATE NOT NULL,
	Lot_Quantidade INT NOT NULL,
	Lot_Ativo BOOLEAN DEFAULT TRUE,
	
	FOREIGN KEY (Lot_Matriz) REFERENCES Matrizes(Mat_Id)
);

DELETE FROM Geneticas;
DELETE FROM Edificios;
DELETE FROM Matrizes;
DELETE FROM Lotes;

-- Fase 2:

DROP TABLE IF EXISTS Gestacoes;
DROP TABLE IF EXISTS Maternidade;
DROP TABLE IF EXISTS Creche;

CREATE TABLE Gestacoes
(
	Gest_Matriz BIGSERIAL,
	Gest_DataInicio DATE,
	Gest_Genetica SERIAL,
	Gest_Ativo BOOLEAN DEFAULT TRUE,

	PRIMARY KEY (Gest_Matriz, Gest_DataInicio),
	FOREIGN KEY (Gest_Matriz) REFERENCES Matrizes (Mat_Id),
	FOREIGN KEY (Gest_Genetica) REFERENCES Geneticas (Gen_Id)
);

CREATE TABLE Maternidade
(
	Mater_Matriz BIGSERIAL,
	Mater_DataInicio DATE,
	Mater_Lote BIGSERIAL,
	Mater_Ativo BOOLEAN DEFAULT TRUE,

	PRIMARY KEY (Mater_Matriz, Mater_DataInicio),
	FOREIGN KEY (Mater_Matriz) REFERENCES Matrizes (Mat_Id),
	FOREIGN KEY (Mater_Matriz) REFERENCES Lotes (Lot_Id)
);

CREATE TABLE Creche
(
	Cre_Lotes BIGSERIAL,
	Cre_DataEntrada DATE,
	Cre_Ativo BOOLEAN DEFAULT TRUE,
	
	PRIMARY KEY (Cre_Lotes, Cre_DataEntrada),
	FOREIGN KEY (Cre_Lotes) REFERENCES Lotes (Lot_Id)
	
);

-- fase 3:
-- Nutricao, Machos

CREATE TABLE Machos
(
	Macho_Id BIGSERIAL UNIQUE,
	Macho_Nascimento DATE UNIQUE,
	Macho_Genetica SERIAL,
	Macho_Ativo BOOLEAN DEFAULT TRUE,

	PRIMARY KEY (Macho_Id, Macho_Nascimento),
	FOREIGN KEY (Macho_Genetica) REFERENCES Geneticas (Gen_Id)
);

CREATE TABLE Suprimentos
(	
	Sup_Id BIGSERIAL UNIQUE,
	Sup_Nome VARCHAR(50) NOT NULL,
	Sup_Descricao VARCHAR(50) NULL,
	Sup_Quantidade_kg FLOAT NOT NULL,

	PRIMARY KEY(Sup_Id, Sup_Nome, Sup_Quantidade_kg)
);

CREATE TABLE Nutricao_Matrizes
(
	NutriMatrizes_Mat_Id BIGSERIAL,
	NutriMatrizes_Data DATE,
	NutriMatrizes_Suprimento BIGSERIAL,
	NutriMatrizes_Quantidade FLOAT,

	PRIMARY KEY (NutriMatrizes_Mat_Id, NutriMatrizes_Data),
	FOREIGN KEY (NutriMatrizes_Suprimento) REFERENCES Suprimentos (Sup_Id),
	FOREIGN KEY (NutriMatrizes_Mat_Id) REFERENCES Matrizes (Mat_Id)
);

CREATE TABLE Nutricao_Lotes
(
	NutriLotes_Lot_Id BIGSERIAL,
	NutriLotes_Data DATE,
	NutriLotes_Suprimento BIGSERIAL,
	NutriLotes_Quantidade FLOAT,

	PRIMARY KEY (NutriLotes_Lot_Id, NutriLotes_Data),
	FOREIGN KEY (NutriLotes_Suprimento) REFERENCES Suprimentos (Sup_Id),
	FOREIGN KEY (NutriLotes_Lot_Id) REFERENCES Lotes (Lot_Id)
);

CREATE TABLE Nutricao_Machos
(
	NutriMachos_Macho_Id BIGSERIAL UNIQUE,
	NutriMachos_Data DATE UNIQUE,
	NutriMachos_Suprimento BIGSERIAL,
	NutriMachos_Quantidade FLOAT,

	PRIMARY KEY (NutriMachos_Macho_Id, NutriMachos_Data),
	FOREIGN KEY (NutriMachos_Suprimento) REFERENCES Suprimentos (Sup_Id),
	FOREIGN KEY (NutriMachos_Macho_Id) REFERENCES Machos (Macho_Id)
);

DROP TABLE IF EXISTS Machos;
DROP TABLE IF EXISTS Suprimentos;
DROP TABLE IF EXISTS Nutricao_Matrizes;
DROP TABLE IF EXISTS Nutricao_Lotes;
DROP TABLE IF EXISTS Nutricao_Machos;

-- fase 4:
-- estatisticas



