
CREATE OR REPLACE FUNCTION verificaLogin(nickname VARCHAR(50), senha VARCHAR(50))
RETURNS TYPE_USERTIPO
LANGUAGE plpgsql
AS $$
DECLARE 
    resultado TYPE_USERTIPO;
BEGIN
    SELECT user_tipo INTO resultado
    FROM usuarios
    WHERE user_nickname = nickname
      AND user_senha = MD5(senha)
      AND user_statusRegistro = TRUE;

    RETURN resultado; 
END;
$$;
