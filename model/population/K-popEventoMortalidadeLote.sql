
DELETE FROM eventoMortalidadeLote;

INSERT INTO eventoMortalidadeLote (mort_loteData, mort_loteIdLote, mort_loteCausaMorte, mort_loteObservacoes) 
			VALUES ('2023-02-05', 6, 'causa 1','encontrado embaixo da matriz'),
				   ('2025-06-06', 3, 'causa 2', 'morto pelo irmão');
