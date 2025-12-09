
CALL novoRegistroFinanceiro(
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA
);

CALL editarRegistroFinanceiro(
	id BIGINT,
	data DATE,
	descricao VARCHAR(350),
	valor FLOAT4,
	tipo TYPE_FINANCEIROTIPO,
	categoria TYPE_FINANCEIROCATEGORIA
);

CALL excluirRegistroFinanceiro(id BIGINT);

SELECT * FROM buscaFinanceiro();
