import express from 'express';
const router = express.Router();
import Funcionario from '../controllers/FuncionarioController.js'
import auth from '../helpers/auth.js'

router.post('/salvar', auth, Funcionario.salvar)
router.get('/listar', auth, Funcionario.listar)
router.get('/get/:id', auth, Funcionario.get)
router.put('/editar', auth, Funcionario.editar)

export default router;