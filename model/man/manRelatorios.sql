
--funcoes que retornam os inteiros dos dados iniciais da pagina relatorios:

SELECT quantidadeGeneticasAtivas();

SELECT quantidadeLotesAtivos();

SELECT quantidadeAnimaisAtivos();

SELECT quantidadeLotesQuarentenados();

SELECT quantidadeLeitoesBercario();

SELECT quantidadePorcasGestantes();

SELECT quantidadePorcasLactantes();

SELECT quantidadeInseminacoesPendentes();


-- Listagem do relatorio da busca disponibilizada ao final da pagina relatorios:

SELECT relatorioPaginaRelatorios(tipo VARCHAR(20), dataIni DATE, dataFim DATE);
-- dataIni e dataFim aceitam os valores NULL na busca, e o tipo apenas 'desmames' e 'partos'

--SELECT * FROM buscaRelatorios('partos', '1012-09-01', '2025-10-10');
--SELECT * FROM buscaRelatorios('desmames', '2012-09-01', '2025-10-10');
