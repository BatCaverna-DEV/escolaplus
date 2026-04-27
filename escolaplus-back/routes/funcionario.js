import express from 'express';
const router = express.Router();
import Funcionario from '../controllers/FuncionarioController.js'
import auth from '../helpers/auth.js'
import { categoria, allow } from '../helpers/permissao.js'

const sec  = [categoria.SECRETARIA]
const prof = [categoria.SECRETARIA, categoria.PROFESSOR]

router.post('/salvar', auth, allow(...sec),  Funcionario.salvar)
router.get ('/listar', auth, allow(...sec),  Funcionario.listar)
router.get ('/get/:id',auth, allow(...prof), Funcionario.get)
router.put ('/editar', auth, allow(...prof), Funcionario.editar)  // professor edita só o próprio

// Professor autenticado consulta o próprio perfil
router.get('/eu', auth, allow(categoria.PROFESSOR), Funcionario.eu)

export default router;
