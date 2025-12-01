
DELETE FROM tarefas;

INSERT INTO tarefas (tar_titulo, tar_descricao, tar_usuarioResponsavel,
                     tar_prioridade, tar_status) 
                     VALUES ('Organizar bercario', 'gerar relatório.', 'cesar.c03', 'media', 'pendente'),
                            ('Limpar maternidade', 'gerar relatório assim que concluido.', 'func', 'alta', 'em andamento');
