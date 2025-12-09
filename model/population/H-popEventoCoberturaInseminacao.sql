
DELETE FROM eventoCoberturaInseminacao;

INSERT INTO eventoCoberturaInseminacao (cobert_dataCobertura,
	cobert_matrizId, cobert_tipo, cobert_observacoes) 
	VALUES ('2025-02-03', 1, 'artificial', 'sem obsercacoes'), 
		   ('2024-01-09', 2, 'artificial', 'processo positivo'), 
		   ('2026-03-10', 4, 'natural', 'processo dificil'), 
		   ('2025-09-09', 5, 'artificial', 'evento dificil');
		   