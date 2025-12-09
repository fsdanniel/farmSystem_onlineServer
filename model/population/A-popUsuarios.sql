
DELETE FROM usuarios;

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('adm', 'adminAdmin', MD5('123'), 'adm@administrador.com', 'administrador'),
('claudio.finan', 'claudinho123', MD5('Financas@25'), 'claudio.finan@fazenda.com', 'administrador');

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('vet', 'vetvet123', MD5('123'), 'vet@veterinaria.com', 'veterinario'),
('dr.carlos.saude', 'carcarlinhos', MD5('CarlosVet2'), 'carlos.saude@fazenda.com', 'veterinario'),
('vet.marcia.manejo', 'mariazote', MD5('MarciaV3'), 'marcia.manejo@fazenda.com', 'veterinario');

INSERT INTO usuarios (user_nome, user_nickname, user_senha, user_email, user_tipo) VALUES
('func', 'funczinho', MD5('123'), 'func@funcionario.com', 'funcionario'),
('bruna.b02', 'brunaaaa', MD5('bruna2'), 'bruna.b02@fazenda.com', 'funcionario'),
('cesar.c03', 'cesaaar', MD5('cesar3'), 'cesar.c03@fazenda.com', 'funcionario'),
('debora.d04','debor', MD5('debora4'), 'debora.d04@fazenda.com', 'funcionario'),
('eduardo.e05', 'eduard00', MD5('eduardo5'), 'eduardo.e05@fazenda.com', 'funcionario'),
('fabiana.f06', 'fabi34985', MD5('fabiana6'), 'fabiana.f06@fazenda.com', 'funcionario'),
('gabriel.g07', 'gabriel', MD5('gabriel7'), 'gabriel.g07@fazenda.com', 'funcionario');
