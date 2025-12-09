
DELETE FROM bercario;

INSERT INTO bercario (ber_loteNome, ber_qtdeLeitoes,
ber_dataNascimento, ber_pesoMedio, ber_status, ber_dataDesmame)
VALUES ('A001', 12, '2025-02-02', 4, 'ativo', '2026-02-02'),
       ('B002', 5, '2021-09-08', 3, 'ativo', '2022-02-03'),
	   ('C003', 2, '2022-07-07', 3.8, 'ativo', '2020-03-06'),
	   ('D004', 1, '2023-02-01', 4.5, 'ativo', '2021-04-04');
