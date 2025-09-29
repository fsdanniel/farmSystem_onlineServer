SELECT * FROM Administradores;
SELECT * FROM Funcionarios;
SELECT * FROM Veterinarios;

CALL insere_Administrador('Zeze', 'sduvierai', '2001-02-08', 'zeze@gmail.com');
CALL remove_Administrador('Zeze');
CALL insere_Administrador('Pepelegal', 'sscadcduvierai', '2009-02-01', 'adjcvseuycg@gmail.com');
CALL remove_Administrador('Pepelegal');

CALL insere_Funcionario('Zeze', 'sduvierai', '2001-02-08', 'zeze@gmail.com');
CALL remove_Funcionario('Zeze');

CALL insere_Veterinario('Zeze', 'sduvierai', '2001-02-08', 'zeze@gmail.com');
CALL remove_Veterinario('Zeze');

SELECT * FROM Geneticas;

CALL insere_Genetica('Gen A');
CALL insere_Genetica('Gen B', 'teste');
CALL insere_Genetica('Gen C', 'teste2');
CALL remove_Genetica('Gen C');
CALL atualiza_Genetica('Gen C');
CALL atualiza_Genetica('Gen B', 'acho que da certo');

CALL insere_matri









