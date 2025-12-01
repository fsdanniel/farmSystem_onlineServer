
DELETE FROM ocorrencias;

INSERT INTO ocorrencias (
	ocor_loteNome,
	ocor_tipo,
	ocor_prioridade,
	ocor_dia,
	ocor_hora,
	ocor_titulo,
	ocor_descricao,
	ocor_quantidadeAnimaisAfetados,
	ocor_medicamentoAplicado,
	ocor_dosagem,
	ocor_responsavel,
	ocor_proximasAcoes,
	ocor_status
) VALUES ('C003', 'sanitaria', 'media', '2023-10-23', '23:09:06', 'Vazamento de esgoto', 'cano estourado', 23, NULL, NULL, 'func', 'limpar tudo', 'pendente'),
		('D004', 'sanitaria', 'media', '2024-11-23', '03:01:07', 'Vazamento de esgoto', 'cano estourado', 25, NULL, NULL, 'func', 'limpar ', 'em andamento'),
		('F006', 'sanitaria', 'baixa', '2022-10-21', '09:09:00', 'Vazamento de esgoto', 'cano estourado', 28, NULL, NULL, 'func', 'limpar tudo', 'pendente');
		