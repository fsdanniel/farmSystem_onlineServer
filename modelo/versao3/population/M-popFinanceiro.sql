
DELETE FROM financeiro;

INSERT INTO financeiro (finan_data, finan_descricao, finan_valor, finan_tipo, finan_categoria) 
			VALUES ('2025-04-01', 'compra de materiais de reparo', 549.78, 'saida', 'manutencao'),
				   ('2025-04-03', 'compra de alimentos', 149.92, 'saida', 'compra de insumos'),
				   ('2025-04-10', 'venda de leitões', 1000, 'entrada', 'venda de animais'),
				   ('2025-04-23', 'compra de materiais de reparo', 15657.90, 'saida', 'manutencao');
