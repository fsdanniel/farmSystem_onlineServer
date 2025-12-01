
--verificar login:

SELECT * FROM verificaLogin(nickname VARCHAR(50), senha VARCHAR(50));

-- modo de uso:

-- chamar: 'CALL verificaLogin('adm', '123');'
-- caso o registro de usuário já exista, a funcao retorna o tipo de usuario,
-- 'funcionario', 'veterinario' ou 'administrador'. Caso nao exista, retorna 'NULL'.

-- observação: a própria função já compara com a criptografia MD5, ou seja, caso a 
-- 			   senha do usuario seja '123', basta inserir '123' na função, como exemplificado;
