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

	PRIMARY KEY(Mat_Id, Mat_Nascimento),
	FOREIGN KEY (Mat_Gen) REFERENCES Geneticas(Gen_Id)
);

CREATE TABLE Lotes
(
	Lot_Id BIGSERIAL UNIQUE,
	Lot_Matriz BIGSERIAL UNIQUE NOT NULL,
	Lot_Nascimento DATE NOT NULL,
	Lot_Quantidade INT NOT NULL,
	
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

	PRIMARY KEY (Gest_Matriz, Gest_DataInicio),
	FOREIGN KEY (Gest_Matriz) REFERENCES Matrizes (Mat_Id),
	FOREIGN KEY (Gest_Genetica) REFERENCES Geneticas (Gen_Id)
);

CREATE TABLE Maternidade
(
	Mater_Matriz BIGSERIAL,
	Mater_DataInicio DATE,
	Mater_Lote BIGSERIAL,

	PRIMARY KEY (Mater_Matriz, Mater_DataInicio),
	FOREIGN KEY (Mater_Matriz) REFERENCES Matrizes (Mat_Id),
	FOREIGN KEY (Mater_Matriz) REFERENCES Lotes (Lot_Id)
);

CREATE TABLE Creche
(
	Cre_Lotes BIGSERIAL,
	Cre_DataEntrada DATE,
	
	PRIMARY KEY (Cre_Lotes, Cre_DataEntrada),
	FOREIGN KEY (Cre_Lotes) REFERENCES Lotes (Lot_Id)
	
);

-- fase 3:

-- Nutricao, Estatisticas, Machos



