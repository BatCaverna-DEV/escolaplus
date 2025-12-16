import express from 'express';
const router = express.Router();
import Funcionario from '../controllers/FuncionarioController.js'
import auth from '../helpers/auth.js'
import {categoria, allow} from '../helpers/permissao.js'

router.post('/salvar', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Funcionario.salvar)
router.get('/listar', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Funcionario.listar)
router.get('/get/:id', auth, allow(categoria.ADMIN, categoria.SECRETARIA, categoria.PROFESSOR), Funcionario.get)
router.put('/editar', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Funcionario.editar)

export default router;