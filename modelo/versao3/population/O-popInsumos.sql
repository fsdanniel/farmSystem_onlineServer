
DELETE FROM insumos;

INSERT INTO insumos (insu_nome, insu_dataCompra, insu_quantidade, insu_nomeFornecedor, insu_custoTotal) 
			 VALUES ('milho(em grao)', '2023-09-07', 12, 'Robson Lourencio', 15908.32),
			 		('farelo de soja', '2024-11-02', 190, 'Laura Romilda', 123907.34),
					('nucleo crescimento', '2024-01-02', 93, 'Camareiro Ross', 9999.92),
					('medicamento x', '2025-02-03', 153, 'Vera Lori', 48902.23);
