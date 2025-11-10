CREATE OR REPLACE PROCEDURE novaOcorrencia(
    dia DATE, hora TIME, lote BIGINT, tipo TYPE_OCORRTIPO,
	prioridade TYPE_OCORRPRIORIDADE, titulo VARCHAR(100),
	status TYPE_OCORRSTATUS, usuario VARCHAR(50),
	registro BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ocorrencias (ocor_data, ocor_hora, ocor_lote, ocor_tipo, ocor_prioridade, 
	ocor_titulo, ocor_status, ocor_user, ocor_registro) VALUES (dia, hora, lote, tipo,
	prioridade, titulo, status, usuario, registro);
END;
$$;

