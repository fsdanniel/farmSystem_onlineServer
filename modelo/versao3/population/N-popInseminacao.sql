
DELETE FROM inseminacao;

INSERT INTO inseminacao (insem_brincoFemea, insem_geneticaMacho, insem_dataInseminacao, insem_tecnica,
						 insem_resultado, insem_dataVerificacao) 
						 VALUES ('F002', 'Duroc', '2024-02-09', 'tecnica Z', 'negativo', '2024-03-12'), 
						 		('F005', 'Landrace', '2025-09-08', 'tecnica X', 'positivo', '2025-12-08'), 
								('F004', 'Landrace', '2025-11-11', 'tecnica S', 'aguardando', '2026-01-11');
								