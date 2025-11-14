const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Controle de Usuários! Acesse /api/users/:userType para interagir com os dados.' });
});

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
