
CALL novoRegistroBercario(
	loteNome VARCHAR(50), qtdeLeitoes INT, dataNascimento DATE, pesoMedio FLOAT4,
	dataDesmame DATE, status TYPE_BERSTATUS DEFAULT 'ativo');
	
CALL editarRegistroBercario(
	loteNome VARCHAR(50),
	qtdeLeitoes INT,
	dataNascimento DATE,
	pesoMedio FLOAT4,
	dataDesmame DATE,
	status TYPE_BERSTATUS DEFAULT 'ativo',
)

CALL excluirRegistroBercario(loteNome VARCHAR(50))

SELECT * FROM buscaBercario(nome VARCHAR(50), stat TYPE_BERSTATUS);

