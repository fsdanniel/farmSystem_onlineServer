
DELETE FROM usuarios;

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('adm', 'adminAdmin', MD5('123'), 'adm@administrador.com', 'administrador'),
('claudio.finan', 'claudinho123', MD5('Financas@25'), 'claudio.finan@fazenda.com', 'administrador');

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('vet', 'vetvet123', MD5('123'), 'vet@veterinaria.com', 'veterinario'),
('dr.carlos.saude', 'carcarlinhos', MD5('CarlosVet2'), 'carlos.saude@fazenda.com', 'veterinario'),
('vet.marcia.manejo', 'mariazote', MD5('MarciaV3'), 'marcia.manejo@fazenda.com', 'veterinario');

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('func', 'funczinho', MD5('123'), 'func@funcionario.com', 'funcionario'),
('bruna.b02', 'brunaaaa', MD5('bruna2'), 'bruna.b02@fazenda.com', 'funcionario'),
('cesar.c03', 'cesaaar', MD5('cesar3'), 'cesar.c03@fazenda.com', 'funcionario'),
('debora.d04','debor', MD5('debora4'), 'debora.d04@fazenda.com', 'funcionario'),
('eduardo.e05', 'eduard00', MD5('eduardo5'), 'eduardo.e05@fazenda.com', 'funcionario'),
('fabiana.f06', 'fabi34985', MD5('fabiana6'), 'fabiana.f06@fazenda.com', 'funcionario'),
('gabriel.g07', 'gabriel', MD5('gabriel7'), 'gabriel.g07@fazenda.com', 'funcionario');

DELETE FROM geneticas;

INSERT INTO geneticas (gen_nome, gen_descricao, gen_caracteristicas) VALUES
('Duroc', 'Raça americana conhecida pela excelente qualidade da carne.', 'Alta taxa de crescimento, carne marmorizada e boa conversão alimentar.'),
('Landrace', 'Raça originária da Dinamarca amplamente usada em cruzamentos comerciais.', 'Alta prolificidade, boa produção de leite e excelente habilidade materna.'),
('Yorkshire', 'Raça britânica muito versátil e produtiva.', 'Alta fertilidade, boa conformação e longevidade reprodutiva.'),
('Spotted', 'Raça americana com pelagem manchada.', 'Bom ganho de peso e rusticidade.'),
('Hereford', 'Raça americana facilmente reconhecida pela coloração marrom-avermelhada com branco.', 'Calmo, rústico e carne de boa qualidade.');

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

DELETE FROM bercario;

INSERT INTO bercario (ber_loteNome, ber_qtdeLeitoes,
ber_dataNascimento, ber_pesoMedio, ber_status, ber_dataDesmame)
VALUES ('A001', 12, '2025-02-02', 4, 'ativo', '2026-02-02'),
       ('B002', 5, '2021-09-08', 3, 'ativo', '2022-02-03'),
	   ('C003', 2, '2022-07-07', 3.8, 'ativo', '2020-03-06'),
	   ('D004', 1, '2023-02-01', 4.5, 'ativo', '2021-04-04');

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

DELETE FROM tarefas;

INSERT INTO tarefas (tar_titulo, tar_descricao, tar_usuarioResponsavel,
                     tar_prioridade, tar_status) 
                     VALUES ('Organizar bercario', 'gerar relatório.', 'cesar.c03', 'media', 'pendente'),
                            ('Limpar maternidade', 'gerar relatório assim que concluido.', 'func', 'alta', 'em andamento');

DELETE FROM contratos;

INSERT INTO contratos (cont_fornecedor, cont_objeto, cont_dataInicio, cont_dataVencimento, cont_status) 
			VALUES ('Pedrinho Matador', 'laminas cortantes', '2023-03-04', '2025-06-06', 'futuro'),
					('Jorge Lima', 'ração', '2024-09-01', '2025-02-01', 'futuro'),
					('Roberto Calos', 'medicamentos', '2023-09-08', '2022-02-01', 'vigente'),
					('Janio Quadros', 'produtos de limpeza', '2020-02-02', '2023-03-02', 'vigente');

DELETE FROM eventoCoberturaInseminacao;

INSERT INTO eventoCoberturaInseminacao (cobert_dataCobertura,
	cobert_matrizId, cobert_tipo, cobert_observacoes) 
	VALUES ('2025-02-03', 1, 'artificial', 'sem obsercacoes'), 
		   ('2024-01-09', 2, 'artificial', 'processo positivo'), 
		   ('2026-03-10', 4, 'natural', 'processo dificil'), 
		   ('2025-09-09', 5, 'artificial', 'evento dificil');
		   
DELETE FROM eventoDesmame;

INSERT INTO eventoDesmame (desm_data, desm_loteId, desm_quantidadeDesmamados, desm_observacoes) VALUES
('2025-04-25', 1, 20, 'Gloucestershire Old Spot: desmame realizado sem intercorrências.'),
('2025-05-19', 4, 23, 'Basco: observação de comportamento social no pós-desmame.'),
('2025-04-01', 3, 40, 'Desmame padrão Duroc, alta taxa de sobrevivência.'),
('2025-05-14', 7, 10, 'Vietnamita: monitoramento de estresse pós-desmame.');

DELETE FROM eventoMortalidadeFemea;

INSERT INTO eventoMortalidadeFemea (mort_femeaData, mort_femeaIdMatriz, mort_femeaCausaMorte, mort_femeaObservacoes) 
		VALUES ('2025-02-04', 2, 'causa 1', 'encontrada morta'),
			   ('2024-11-12', 5, 'causa 2', 'encontrada morrendo de infarto');

DELETE FROM eventoMortalidadeLote;

INSERT INTO eventoMortalidadeLote (mort_loteData, mort_loteIdLote, mort_loteCausaMorte, mort_loteObservacoes) 
			VALUES ('2023-02-05', 6, 'causa 1','encontrado embaixo da matriz'),
				   ('2025-06-06', 3, 'causa 2', 'morto pelo irmão');

DELETE FROM eventoParto;

INSERT INTO eventoParto(parto_data, parto_matrizId, parto_quantidadeNascidos, parto_observacoes) VALUES
('2022-02-04', 1, 12, 'Parto realizado com sucessso.'),
('2023-04-11', 2, 7, 'Parto rapido.'),
('2024-06-10', 3, 9, 'Parto lento.'),
('2024-02-09', 4, 11, 'Parto rapido e bem sucedido.'),
('2025-01-11', 6, 12, 'Parto lento e bem sucedido.');

DELETE FROM financeiro;

INSERT INTO financeiro (finan_data, finan_descricao, finan_valor, finan_tipo, finan_categoria) 
			VALUES ('2025-04-01', 'compra de materiais de reparo', 549.78, 'saida', 'manutencao'),
				   ('2025-04-03', 'compra de alimentos', 149.92, 'saida', 'compra de insumos'),
				   ('2025-04-10', 'venda de leitões', 1000, 'entrada', 'venda de animais'),
				   ('2025-04-23', 'compra de materiais de reparo', 15657.90, 'saida', 'manutencao');

DELETE FROM inseminacao;

INSERT INTO inseminacao (insem_brincoFemea, insem_geneticaMacho, insem_dataInseminacao, insem_tecnica,
						 insem_resultado, insem_dataVerificacao) 
						 VALUES ('F002', 'Duroc', '2024-02-09', 'tecnica Z', 'negativo', '2024-03-12'), 
						 		('F005', 'Landrace', '2025-09-08', 'tecnica X', 'positivo', '2025-12-08'), 
								('F004', 'Landrace', '2025-11-11', 'tecnica S', 'aguardando', '2026-01-11');
								
DELETE FROM insumos;

INSERT INTO insumos (insu_nome, insu_dataCompra, insu_quantidade, insu_nomeFornecedor, insu_custoTotal) 
			 VALUES ('milho(em grao)', '2023-09-07', 12, 'Robson Lourencio', 15908.32),
			 		('farelo de soja', '2024-11-02', 190, 'Laura Romilda', 123907.34),
					('nucleo crescimento', '2024-01-02', 93, 'Camareiro Ross', 9999.92),
					('medicamento x', '2025-02-03', 153, 'Vera Lori', 48902.23);

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
		