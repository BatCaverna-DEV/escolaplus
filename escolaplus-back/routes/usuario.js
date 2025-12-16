import express from 'express'
const router = express.Router()
import Usuario from '../controllers/UsuarioController.js'
import auth from '../helpers/auth.js'
import {categoria, allow} from '../helpers/permissao.js'

router.post('/login', Usuario.login)
router.get('/gerar/:senha', Usuario.gerar)
router.get('/get/:id', auth, Usuario.get)
router.put('/senha', auth, allow(categoria.ADMIN, categoria.SECRETARIA, categoria.PROFESSOR), Usuario.senha)
router.get('/acesso/:id', auth, allow(categoria.ADMIN), Usuario.acesso)

export default router