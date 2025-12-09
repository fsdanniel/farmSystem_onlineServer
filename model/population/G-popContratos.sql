
DELETE FROM contratos;

INSERT INTO contratos (cont_fornecedor, cont_objeto, cont_dataInicio, cont_dataVencimento, cont_status) 
			VALUES ('Pedrinho Matador', 'laminas cortantes', '2023-03-04', '2025-06-06', 'futuro'),
					('Jorge Lima', 'ração', '2024-09-01', '2025-02-01', 'futuro'),
					('Roberto Calos', 'medicamentos', '2023-09-08', '2022-02-01', 'vigente'),
					('Janio Quadros', 'produtos de limpeza', '2020-02-02', '2023-03-02', 'vigente');
