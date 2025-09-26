DROP TABLE IF EXISTS Administradores;
DROP TABLE IF EXISTS Funcionarios;
DROP TABLE IF EXISTS Veterinarios;
DROP TABLE IF EXISTS Geneticas;
DROP TABLE IF EXISTS Edificio;

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
    Vet_Nascimento date,
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


SELECT COUNT(*) FROM Administradores
WHERE Adm_Ativo = TRUE AND Adm_Senha = MD5('WLEF7YTE') AND Adm_Nome = 'Aeronautics Barata';

CREATE TABLE Geneticas
(
	Gen_Id SERIAL,
	Gen_Nome character varying,
	Gen_Descricao character varying NULL,
	PRIMARY KEY(Gen_Nome)
);

CREATE TABLE Edificio
(
	Edi_Id SERIAL,
	Edi_Nome character varying,
	Edi_Descricao character varying NULL,
	PRIMARY KEY(Edi_NOME)
);




