SELECT * FROM Administradores;
SELECT * FROM Funcionarios;
SELECT * FROM Veterinarios;
SELECT * FROM Geneticas;
SELECT * FROM Matrizes;
SELECT * FROM Lotes;
SELECT * FROM Gestacoes;
SELECT * FROM Maternidade;
SELECT * FROM Creche;
SELECT * FROM Machos;
SELECT * FROM Suprimentos;
SELECT * FROM Nutricao_Matrizes;
SELECT * FROM Nutricao_Lotes;
SELECT * FROM Nutricao_Machos;

CALL insere_Administrador('Nome', 'Senha', '2000-08-23', 'Nome@email.com');
CALL remove_Administrador('Nome');

CALL insere_Funcionario('Nome', 'Senha', '2000-08-23', 'Nome@email.com');
CALL remove_Funcionario('Nome');

CALL insere_Veterinario('Nome', 'Senha', '2000-08-23', 'Nome@email.com');
CALL remove_Veterinario('Nome');

CALL insere_Genetica('Gen A');
CALL insere_Genetica('Gen C');
CALL insere_Genetica('Gen B', 'description');
CALL atualiza_Genetica('Gen C', 'descricione');
CALL remove_Genetica('Gen A');
CALL remove_Genetica('Gen B');
CALL remove_Genetica('Gen C');

CALL insere_Matriz('2025-09-21', 4);
CALL remove_Matriz(3, '2025-09-25');

CALL insere_Lote(3, '2025-09-21');
CALL insere_Lote(3, '2025-09-25', 10);
CALL insere_Lote(3, '2025-09-25', 10, '2025-09-25');
CALL remove_Lote(5, '0010-02-03');