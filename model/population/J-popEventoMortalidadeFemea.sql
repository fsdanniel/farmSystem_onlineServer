
DELETE FROM eventoMortalidadeFemea;

INSERT INTO eventoMortalidadeFemea (mort_femeaData, mort_femeaIdMatriz, mort_femeaCausaMorte, mort_femeaObservacoes) 
		VALUES ('2025-02-04', 2, 'causa 1', 'encontrada morta'),
			   ('2024-11-12', 5, 'causa 2', 'encontrada morrendo de infarto');
