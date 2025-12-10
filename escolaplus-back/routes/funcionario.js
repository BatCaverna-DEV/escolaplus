import express from 'express';
const router = express.Router();
import Funcionario from '../controllers/FuncionarioController.js'
import auth from '../helpers/auth.js'

router.get('/listar', auth, Funcionario.listar)

export default router;