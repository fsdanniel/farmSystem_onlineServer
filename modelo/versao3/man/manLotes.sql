
CALL novoLote(nome, genetica, quantidade, dataCriacao, status);

CALL editaLote(idL, nome, genetica, quantidade, dataCriacao, status);
	
CALL excluirLote(idL);

-- GENETICANOMELOTE PODE SER NULL E STATUS LOTE TAMBEM, nesse caso listaria todos nomes e todos os status
SELECT buscaPaginaLotes(geneticaNomeLote, statusLote);
SELECT * FROM listaNomesGeneticas(); -- para a busca 
