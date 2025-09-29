CREATE OR REPLACE PROCEDURE public.insere_administrador(
	IN nome character varying,
	IN senha character varying,
	IN nascimento date,
	IN email character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	-- Executa a busca e armazena o resultado em variáveis
    	INSERT INTO Administradores (Adm_Nome, Adm_Senha, Adm_Nascimento, Adm_Email) VALUES (Nome, Senha, Nascimento, Email);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.remove_administrador(
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

CREATE OR REPLACE PROCEDURE public.insere_funcionario(
	IN nome character varying,
	IN senha character varying,
	IN nascimento date,
	IN email character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	-- Executa a busca e armazena o resultado em variáveis
    	INSERT INTO Funcionarios (Fun_Nome, Fun_Senha, Fun_Nascimento, Fun_Email) VALUES (Nome, Senha, Nascimento, Email);
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.remove_funcionario(
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

CREATE OR REPLACE PROCEDURE public.insere_veterinario(
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

CREATE OR REPLACE PROCEDURE public.remove_veterinario(
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

CREATE OR REPLACE PROCEDURE public.insere_matriz(
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

CREATE OR REPLACE PROCEDURE public.morte_matriz(
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

CREATE OR REPLACE PROCEDURE public.insere_genetica(
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

CREATE OR REPLACE PROCEDURE public.atualiza_genetica(
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

CREATE OR REPLACE PROCEDURE public.remove_genetica(
	IN nome character varying)
LANGUAGE 'plpgsql'
AS $BODY$
		DECLARE
	BEGIN
    	DELETE FROM Geneticas
		WHERE Nome = Gen_Nome;
	END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.nascimento_lote(
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
