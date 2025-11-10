DELETE FROM eventoParto;

-- Verificar os Id's das matrizes registradas para adicionar o registro de eventoParto:
SELECT * FROM maternidade;

INSERT INTO eventoParto(parto_data, parto_matrizId, parto_quantidadeNascidos, parto_observacoes) VALUES
('2022-02-04',3, 12, 'Parto realizado com sucessso.'),
('2023-04-11',5, 7, 'Parto rapido.'),
('2024-06-10',7, 9, 'Parto lento.'),
('2024-02-09',5, 11, 'Parto rapido e bem sucedido.'),
('2025-01-11',8, 12, 'Parto lento e bem sucedido.');

-- Verificar os registros de partos:
SELECT * FROM eventoParto;