# Lista de Requisições - Equipe Modelo

| Nome da Requisição   | Objetivo                            | Entradas                                 | Saídas                                | Operação |
|----------------------|-------------------------------------|------------------------------------------|---------------------------------------|----------|
| Cadastrar Usuário    | Criar novo usuário no sistema       | nome: TEXT, email: TEXT, senha: TEXT     | id_usuario (INT), sucesso/erro        | INSERT   |
| Login de Usuário     | Autenticar usuário                  | email: TEXT, senha: TEXT                 | sucesso/erro, id_usuario (INT)        | SELECT   |
| Registrar Matriz     | Registrar nova matriz de suíno      | codigo: TEXT, data_nasc: DATE, peso: NUM | id_matriz (INT), sucesso/erro         | INSERT   |
| Listar Lotes         | Obter todos os lotes registrados    | nenhum                                   | lista (id_lote, data, qtd)            | SELECT   |
| Registrar Nascimento | Associar novos suínos a um lote     | id_lote: INT, qtd: INT, data: DATE       | sucesso/erro                          | UPDATE   |
