--Gerar nova genetica:

INSERT INTO geneticas(gen_nome, gen_descricao, gen_caracteristicas) VALUES ($1, $2, $3);

--Filtrar por nome:

SELECT gen_id, gen_nome, gen_descricao, gen_caracteristicas, gen_status
FROM geneticas
WHERE gen_nome = /*gen nome $1*/;

--listagem {id, nome, descricao, caracteristicas, status}

SELECT gen_id, gen_nome, gen_descricao, gen_caracteristicas, gen_status
FROM geneticas
WHERE gen_status = 'ativo'
ORDER BY gen_id
LIMIT 5 OFFSET 0;