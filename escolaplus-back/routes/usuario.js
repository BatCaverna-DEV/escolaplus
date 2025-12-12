import express from 'express'
const router = express.Router()
import Usuario from '../controllers/UsuarioController.js'
import auth from '../helpers/auth.js'

router.post('/login', Usuario.login)
router.get('/gerar/:senha', Usuario.gerar)
router.get('/get/:id', auth, Usuario.get)
router.put('/senha', auth, Usuario.senha)
router.get('/acesso/:id', auth, Usuario.acesso)

export default router