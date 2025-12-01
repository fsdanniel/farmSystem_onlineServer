
DELETE FROM maternidade;

INSERT INTO maternidade(mater_brincoFemea, mater_genetica, mater_dataCobertura,
mater_dataPartoPrevisto, mater_qtdeLeitoes, mater_status) VALUES 
('F001', 'Landrace', '2025-06-15', '2025-10-07', 14, 'recuperacao'),
('F002', 'Duroc', '2025-07-01', '2025-10-23', 10, 'lactante'),
('F003', 'Yorkshire', '2025-08-10', '2025-12-02', 4, 'gestante'),
('F004', 'Duroc', '2025-08-25', '2025-12-17', 6, 'gestante'),
('F005', 'Hereford', '2025-09-01', '2025-12-24', 9, 'disponivel'),
('F006', 'Spotted', '2025-09-15', '2026-01-07', 13, 'disponivel'),
('F007', 'Yorkshire', '2025-09-30', '2026-01-22', 8, 'disponivel'),
('F008', 'Yorkshire', '2025-10-10', '2026-02-01', 11, 'recuperacao'),
('F009', 'Hereford', '2025-10-20', '2026-02-11', 9, 'gestante'),
('F010', 'Landrace', '2025-11-05', '2026-02-27', NULL, 'lactante');
