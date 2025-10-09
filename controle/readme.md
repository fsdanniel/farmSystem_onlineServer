# Lista de requisições - Equipe controle
| Nome da requisição | Objetivo | Entradas | Saídas |
|:---|:---|:---|:---|
| **login/criarUsuario** | Criar novo usuário no sistema | `username`: string, `senha`: string | `{ success: bool, userId: int, error: string }` |
| **login/login** | Fazer o login do usuário no sistema | `username`: string, `senha`: string | `{ success: bool, userId: int, error: string }` |
| **contratos/registrarFornecedor** | Cadastrar um novo fornecedor. | `nome`: string, `cnpj`: string, `contato`: string | `{ success: bool, fornecedorId: int, error: string }` |
| **contratos/registrarContrato** | Lançar um novo contrato de fornecimento. | `fornecedorId`: int, `descricao`: string, `dataInicio`: date, `dataFim`: date/null, `valorTotal`: float, `status`: string | `{ success: bool, contratoId: int, error: string }` |
| **contratos/consultarContratos** | Consultar a lista de contratos (com filtro de status). | `statusFiltro`: string (Ex: 'Ativo', 'Encerrado', null) | `{ success: bool, contratos: array[{...}], error: string }` |
| **estoque/registrarInsumo** | Cadastrar um novo tipo de insumo (ex: Ração, Vacina). | `nome`: string, `unidadeMedida`: string (Ex: 'kg', 'Litro') | `{ success: bool, insumoId: int, error: string }` |
| **estoque/registrarMovimentacaoEstoque** | Registrar entrada (compra) ou saída (uso) de insumos. | `insumoId`: int, `tipoMovimento`: string (Ex: 'Entrada_Compra', 'Saída_Uso'), `quantidade`: float, `usuarioId`: int, `observacao`: string/null | `{ success: bool, movimentoId: int, error: string }` |
| **estoque/consultarEstoqueAtual** | Calcular e retornar o estoque consolidado de todos os insumos. | (Nenhuma) | `{ success: bool, estoque: array[{nome, quantidade_atual}], error: string }` |
| **financeiro/lancarMovimentacao** | Registrar um gasto (valor negativo) ou uma receita (valor positivo). | `tipoMovimentacao`: string, `descricao`: string, `valor`: float, `usuarioId`: int, `dataMovimento`: date, `referenciaId`: int/null | `{ success: bool, movimentoId: int, error: string }` |
| **financeiro/consultarExtrato** | Retornar o histórico de movimentações financeiras. | `tipo`: string/null, `dataInicio`: date/null, `dataFim`: date/null | `{ success: bool, extrato: array[{...}], error: string }` |
| **financeiro/calcularSaldoTotal** | Calcular o saldo total atual (Receita - Gasto). | (Nenhuma) | `{ success: bool, saldo: float, error: string }` |