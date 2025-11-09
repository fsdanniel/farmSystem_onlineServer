--Gerar novo lote:

INSERT INTO LOTES(lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao) VALUES ($1, $2, $3, $4);

-- Filtrar por genetica/status:
EXEC filtragemGeneticaStatus(gen, status);

-- listagem {ID 	Nome 	Genética 	Qtd. Animais 	Data Criação 	Status}
SELECT lote_id, lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao, lote_status
FROM lotes;


