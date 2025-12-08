import express from 'express'
const router = express.Router()
import Usuario from '../controllers/UsuarioController.js'
import auth from '../helpers/auth.js'

router.post('/login', Usuario.login)
router.get('/senha/:senha', Usuario.senha)
router.get('/get/:id', auth, Usuario.get)

export default router