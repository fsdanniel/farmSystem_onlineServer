Lista de requisições - Equipe Controle  
Nome da requisição | Objetivo | Entradas | Saídas  
--- | --- | --- | ---  
relatorios/listarRelatorios | Consultar todos os relatórios de partos e desmames registrados. | (Nenhuma) | { success: bool, relatorios: array[{ id, tipo, data, animal, funcionarioId }], error: string }  
relatorios/listarPorFuncionario | Consultar relatórios de partos e desmames por funcionário. | funcionarioId: string (param) | { success: bool, relatorios: array[{ id, tipo, data, animal }], error: string }  
lotes/registrarLote | Registrar novo lote de animais. | nome: string, quantidade: int, especie: string, funcionarioId: string | { success: bool, loteId: int, error: string }  
lotes/listarLotes | Consultar lista de lotes cadastrados. | (Nenhuma) | { success: bool, lotes: array[{ id, nome, quantidade, especie }], error: string }  
lotes/atualizarLote | Atualizar informações de um lote. | id: int (param), nome: string, quantidade: int, especie: string | { success: bool, loteAtualizado: object, error: string }  
lotes/removerLote | Remover um lote existente. | id: int (param) | { success: bool, message: string, error: string }  
setores/atualizarSetor | Atualizar informações de um setor (ex: Berçário, Creche, Maternidade). | id: int, nome: string, responsavel: string | { success: bool, setorAtualizado: object, error: string }  
setores/removerSetor | Remover setor do sistema. | id: int | { success: bool, message: string, error: string }  
eventos/registrarEvento | Registrar cobertura, inseminação, parto, desmame ou mortalidade. | tipo: string, data: date, animal: string, funcionarioId: string | { success: bool, eventoId: int, error: string }  
eventos/listarEventos | Consultar eventos reprodutivos e sanitários. | (Nenhuma) | { success: bool, eventos: array[{ id, tipo, data, animal }], error: string }  
