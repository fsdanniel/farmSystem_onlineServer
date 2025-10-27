const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas para gerenciar usuários (funcionários, administradores, veterinários)
router.post('/users/:userType', userController.createUser);
router.get('/users/:userType', userController.getUsers);
router.get('/users/:userType/:id', userController.getUserById);
router.put('/users/:userType/:id', userController.updateUser);
router.delete('/users/:userType/:id', userController.deleteUser);

module.exports = router;
