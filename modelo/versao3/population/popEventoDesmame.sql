DELETE FROM eventoDesmame;

-- verificar o loteid gerado por bigserial atualmente antes de inserir os dados de eventoDesmame
SELECT * FROM lotes;

INSERT INTO eventoDesmame (desm_data, desm_loteId, desm_quantidadeDesmamados, desm_observacoes) VALUES
('2025-04-25', 2, 20, 'Gloucestershire Old Spot: desmame realizado sem intercorrências.'),
('2025-05-19', 54, 23, 'Basco: observação de comportamento social no pós-desmame.'),
('2025-04-01', 12, 40, 'Desmame padrão Duroc, alta taxa de sobrevivência.'),
('2025-05-14', 92, 10, 'Vietnamita: monitoramento de estresse pós-desmame.');

-- verificar a insercao
SELECT * FROM eventoDesmame;