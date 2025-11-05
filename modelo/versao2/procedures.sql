DROP PROCEDURE IF EXISTS insere_Administrador;
DROP PROCEDURE IF EXISTS remove_Administrador;
DROP PROCEDURE IF EXISTS insere_Funcionario;
DROP PROCEDURE IF EXISTS remove_Funcionario;
DROP PROCEDURE IF EXISTS insere_Veterinario;
DROP PROCEDURE IF EXISTS remove_Veterinario;
DROP PROCEDURE IF EXISTS insere_Matriz;
DROP PROCEDURE IF EXISTS remove_Matriz;
DROP PROCEDURE IF EXISTS insere_Genetica;
DROP PROCEDURE IF EXISTS atualiza_Genetica;
DROP PROCEDURE IF EXISTS remove_Genetica;
DROP PROCEDURE IF EXISTS insere_Lote;
DROP PROCEDURE IF EXISTS remove_Lote;
DROP PROCEDURE IF EXISTS insere_Gestacao;
DROP PROCEDURE IF EXISTS atualiza_Gestacao;
DROP PROCEDURE IF EXISTS insere_Maternidade;
DROP PROCEDURE IF EXISTS atualiza_Maternidade;
DROP PROCEDURE IF EXISTS insere_Creche;
DROP PROCEDURE IF EXISTS atualiza_Creche;
DROP PROCEDURE IF EXISTS insere_Macho;
DROP PROCEDURE IF EXISTS atualiza_Macho;
DROP PROCEDURE IF EXISTS insere_Suprimento;
DROP PROCEDURE IF EXISTS atualiza_Suprimento;
DROP PROCEDURE IF EXISTS insere_NutricaoMatriz;
DROP PROCEDURE IF EXISTS insere_NutricaoLote;
DROP PROCEDURE IF EXISTS insere_NutricaoMacho;

CREATE OR REPLACE PROCEDURE insere_Administrador(
	IN nome character varying,
	IN senha character varying,
	IN nascimento date,
	IN email character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Administradores (Adm_Nome, Adm_Senha, Adm_Nascimento, Adm_Email) VALUES (Nome, Senha, Nascimento, Email);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Administrador(
	IN nome character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Administradores
		SET Adm_Ativo = FALSE
		WHERE Nome = Adm_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Funcionario(
	IN nome character varying,
	IN senha character varying,
	IN nascimento date,
	IN email character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Funcionarios (Fun_Nome, Fun_Senha, Fun_Nascimento, Fun_Email) VALUES (Nome, Senha, Nascimento, Email);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Funcionario(
	IN nome character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Funcionarios
		SET Fun_Ativo = FALSE
		WHERE Nome = Fun_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Veterinario(
	IN nome character varying,
	IN senha character varying,
	IN nascimento date,
	IN email character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	-- Executa a busca e armazena o resultado em variáveis
    	INSERT INTO Veterinarios (Vet_Nome, Vet_Senha, Vet_Nascimento, Vet_Email) VALUES (Nome, Senha, Nascimento, Email);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Veterinario(
	IN nome character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Veterinarios
		SET Vet_Ativo = FALSE
		WHERE Nome = Vet_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Matriz(
	IN nascimento date,
	IN gen integer,
	IN morte date DEFAULT NULL::date)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Matrizes (Mat_Nascimento, Mat_Gen, Mat_Morte) VALUES (Nascimento, Gen, Morte);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Matriz(
	IN gen integer,
	IN morte date)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Matrizes
		SET Mat_Morte = Morte
		WHERE Mat_Id = Gen;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Genetica(
	IN nome character varying,
	IN descricao character varying DEFAULT NULL::character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	-- Executa a busca e armazena o resultado em variáveis
    	INSERT INTO Geneticas (Gen_Nome, Gen_Descricao) VALUES (Nome, Descricao);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Genetica(
	IN nome character varying,
	IN descricao character varying DEFAULT NULL::character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Geneticas
		SET Gen_Descricao = Descricao
		WHERE Nome = Gen_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Genetica(
	IN nome character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	DELETE FROM Geneticas
		WHERE Nome = Gen_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Lote(
	IN matriz integer,
	IN datainicio date,
	IN quantidade integer DEFAULT 1,
	IN datafinal date DEFAULT NULL::date)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Lotes (Lot_Matriz, Lot_DataInicio, Lot_Quantidade, Lot_DataFinal) 
		VALUES (Matriz, DataInicio, Quantidade, DataFinal);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE remove_Lote(
	LoteId INTEGER,
	DataFinal DATE)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Lotes (Lot_Id, Lot_DataFinal) 
		VALUES (LoteId, DataFinal);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Gestacao(
	Matriz INTEGER,
	DataInicio DATE,
	Genetica INTEGER,
	DataFinal DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Gestacoes (Gest_Matriz, Gest_DataInicio, Gest_Genetica, Gest_DataSaida) 
		VALUES (Matriz, DataInicio, Genetica, DataFinal);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Gestacao(
	Matriz INTEGER,
	DataInicio DATE,
	DataFinal DATE)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Gestacoes
		SET Gest_DataFinal = DataFinal
		WHERE Gest_Matriz = Matriz AND Gest_DataInicio = DataInicio;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Maternidade(
	Matriz INTEGER,
	DataEntrada DATE,
	Lote INTEGER DEFAULT NULL,
	DataSaida DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Maternidade (Mater_Matriz, Mater_DataEntrada, Mater_Lote, Mater_DataSaida)
		VALUES (matriz, DataEntrada, Lote, DataSaida);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Maternidade(
	Matriz INTEGER,
	DataEntrada DATE,
	Lote INTEGER DEFAULT NULL,
	DataSaida DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Maternidade 
		SET Mater_Lote = Lote AND Mater_DataSaida = DataSaida
		WHERE Mater_Matrix = Matriz AND Mater_DataEntrada = DataEntrada;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Creche(
	Lote INTEGER,
	DataEntrada DATE,
	DataSaida DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Creche (Cre_Lote, Cre_DataEntrada, Cre_DataSaida)
		VALUES (Lote, DataEntrada, DataSaida);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Creche(
	Lote INTEGER,
	DataSaida DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Creche
		SET Cre_DataSaida = DataSaida
		WHERE Cre_Lote = Lote;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Macho(
	Nascimento DATE,
	Genetica INTEGER,
	DataSaida DATE DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Machos (Macho_Nascimento, Macho_Genetica, Macho_Saida)
		VALUES (Nascimento, Genetica, DataSaida);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Macho(
	Identificador INTEGER,
	DataSaida DATE)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Machos 
		SET Macho_Saida = DataSaida
		WHERE Identificador = Macho_Id;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_Suprimento(
	Nome VARCHAR(50),
	Quantidade FLOAT,
	Descricao VARCHAR(50) DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Suplementos (Sup_Nome, Sup_Descricao, Sup_Quantidade_kg)
		VALUES (Nome, Descricao, Quantidade);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE atualiza_Suprimento(
	Identificador INTEGER,
	Quantidade FLOAT,
	Descricao VARCHAR(50) DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	UPDATE Suprimentos
		SET Sup_Descricao = Descricao AND Sup_Quantidade_kg = Quantidade
		WHERE Sup_Id = Identificador;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_NutricaoMatriz(
	Identificador INTEGER,
	DataOcorrencia DATE,
	Suprimento INTEGER,
	Quantidade FLOAT)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Nutricao_Matrizes (NutriMatrizes_Mat_Id, NutriMatrizes_Data, NutriMatrizes_Suprimento, NutriMatrizes_Quantidade)
		VALUES (Identificador, DataOcorrencia, Suprimento, Quantidade);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_NutricaoLote(
	Identificador INTEGER,
	DataOcorrencia DATE,
	Suprimento INTEGER,
	Quantidade FLOAT)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Nutricao_Lotes (NutriLotes_Lot_Id, NutriLotes_Data, NutriLotes_Suprimento, NutriLotes_Quantidade)
		VALUES (Identificador, DataOcorrencia, Suprimento, Quantidade);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE insere_NutricaoMacho(
	Identificador INTEGER,
	DataOcorrencia DATE,
	Suprimento INTEGER,
	Quantidade FLOAT)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	INSERT INTO Nutricao_Machos (NutriMachos_Macho_Id, NutriMachos_Data, NutriMachos_Suprimento, NutriMachos_Quantidade)
		VALUES (Identificador, DataOcorrencia, Suprimento, Quantidade);
	END;
$BODY$;