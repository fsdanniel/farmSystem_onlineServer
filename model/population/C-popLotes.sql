
DELETE FROM lotes;

INSERT INTO lotes (lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao, lote_status) VALUES
('A001', 'Duroc', 45, '2025-01-01', 'quarentenado'),
('B002', 'Landrace', 60, '2025-01-05', 'inativo'),
('C003', 'Yorkshire', 55, '2025-01-10', 'quarentenado'),
('D004', 'Spotted', 30, '2025-01-15', 'ativo'),
('E005', 'Hereford', 40, '2025-01-20', 'quarentenado');

INSERT INTO lotes (lote_nome, lote_genetica, lote_quantidade, lote_dataCriacao) VALUES
('G007', 'Duroc', 50, '2025-01-30'),
('H008', 'Landrace', 35, '2025-02-04'),
('F006', 'Yorkshire', 25, '2025-01-25'),
('I009', 'Spotted', 20, '2025-02-09'),
('J010', 'Hereford', 15, '2025-02-14');
