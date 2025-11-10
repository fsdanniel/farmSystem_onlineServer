CREATE OR REPLACE FUNCTION quantidadeGeneticasAtivas()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(gen_id)
    INTO retorno
    FROM geneticas
    WHERE gen_status IS TRUE;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLotesAtivos()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(lote_id)
	INTO retorno
	FROM lotes
	WHERE lote_status = 'ativo';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeAnimaisAtivos()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT 
	INTO retorno
    COALESCE((SELECT SUM(lote_quantidade) FROM lotes), 0) +
    COALESCE((SELECT SUM(ber_qtdeLeitoes) FROM bercario), 0) +
    COALESCE((SELECT SUM(mater_qtdeLeiloes) FROM maternidade), 0) AS total_animais;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLotesQuarentenados()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(lote_id)
	INTO retorno
	FROM lotes
	WHERE lote_status = 'quarentenado';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeLeitoesBercario()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COALESCE(SUM(ber_qtdeLeitoes), 0)
	INTO retorno
	FROM bercario;
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadePorcasGestantes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) 
	INTO retorno
	FROM maternidade
	WHERE mater_status = 'gestante';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadePorcasLactantes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS total_porcas_lactantes
	INTO retorno
	FROM maternidade
	WHERE mater_status = 'lactante';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION quantidadeInseminacoesPendentes()
RETURNS INTEGER AS $$
DECLARE
    retorno INTEGER; 
BEGIN
    SELECT COUNT(*) AS total_inseminacoes_pendentes
	INTO retorno
	FROM inseminacao
	WHERE insem_resultado = 'aguardando';
RETURN retorno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION relatorioPaginaRelatorios(tipo VARCHAR(20), dataIni DATE, dataFim DATE)
RETURNS TABLE (
    dia DATE,
    loteMatriz BIGINT,
    quantidade BIGINT,
    observacoes VARCHAR(350)
)
LANGUAGE plpgsql
AS $$ 
BEGIN
    IF tipo = 'Desmames' THEN
        RETURN QUERY
        SELECT 
            desm_data AS dia,
            desm_loteId AS loteMatriz,
            desm_quantidadeDesmamados AS quantidade,
            desm_observacoes AS observacoes
        FROM eventoDesmame
        WHERE (dataIni IS NULL OR desm_data >= dataIni) AND
              (dataFim  IS NULL OR desm_data <= dataFim);
    ELSIF tipo = 'Partos' THEN
        RETURN QUERY
        SELECT 
            parto_data AS dia,
            parto_matrizId AS loteMatriz,
            parto_quantidadeNascidos AS quantidade,
            parto_observacoes AS observacoes
        FROM eventoParto
        WHERE (dataIni IS NULL OR parto_data >= dataIni) AND
              (dataFim  IS NULL OR parto_data <= dataFim);
    END IF;
END;
$$;







	


