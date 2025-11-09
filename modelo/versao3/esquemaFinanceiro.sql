DROP TABLE IF EXISTS movimentacoesFinanceiras;

CREATE TABLE movimentacoesFinanceiras(
	mov_id BIGSERIAL PRIMARY KEY,
	mov_tipo VARCHAR(50),
	mov_descricao VARCHAR(150) NULL,
	mov_valor FLOAT4,
	mov_usuarioId BIGINT REFERENCES usuarios(user_id),
	mov_data DATE,
	mov_referenciaId BIGINT
);
