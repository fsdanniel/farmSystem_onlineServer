-- Conta a quantidade de genéticas ativas:
SELECT COUNT(gen_id)
FROM geneticas
WHERE gen_status IS TRUE;

-- Conta a quantidade de loter ativos:
SELECT COUNT(lote_id)
FROM lotes
WHERE lote_status = 'ativo';

-- Soma a quantidade de totos os animais:
SELECT 
    COALESCE((SELECT SUM(lote_quantidade) FROM lotes), 0) +
    COALESCE((SELECT SUM(ber_qtdeLeitoes) FROM bercario), 0) +
    COALESCE((SELECT SUM(mater_qtdeLeiloes) FROM maternidade), 0) AS total_animais;

-- soma a quantidade de lotes em quarentena:
SELECT COUNT(lote_id)
FROM lotes
WHERE lote_status = 'quarentenado';

-- soma a quantidade de leitoes no bercario:
SELECT COALESCE(SUM(ber_qtdeLeitoes), 0) AS total_leitoes_bercario
FROM bercario;

-- soma a quantidade de porcas gestantes:
SELECT COUNT(*) AS total_porcas_gestantes
FROM maternidade
WHERE mater_status = 'gestante';

-- soma a quantidade de porcas lactantes:
SELECT COUNT(*) AS total_porcas_lactantes
FROM maternidade
WHERE mater_status = 'lactante';

-- soma a quantidade de inseminacoes pendentes:
SELECT COUNT(*) AS total_inseminacoes_pendentes
FROM inseminacao
WHERE insem_resultado = 'aguardando';

-- gerador de relatorios {partos, desmames} com dataInicial e data_Final:

-- relatorio do tipo parto:
SELECT 
    evento_data        AS data,
    evento_lote        AS lote_ou_matriz,
    evento_quantidade  AS quantidade,
    evento_observacoes AS observacoes
FROM eventos
WHERE evento_tipo = 'parto'
  AND evento_data BETWEEN /*dataInicial$1*/ AND /*dataFinal$2*/
ORDER BY evento_data;

-- gerador do tipo desmame:

SELECT 
    evento_data        AS data,
    evento_lote        AS lote_ou_matriz,
    evento_quantidade  AS quantidade,
    evento_observacoes AS observacoes
FROM eventos
WHERE evento_tipo = 'desmame'
  AND evento_data BETWEEN /*dataInicial$1*/ AND /*dataFinal$2*/
ORDER BY evento_data;



	
