import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Diario from '../controllers/DiarioController.js'
import { allow, categoria } from '../helpers/permissao.js';

const adm    = [categoria.ADMIN, categoria.SECRETARIA]
const prof   = [categoria.ADMIN, categoria.SECRETARIA, categoria.PROFESSOR]

router.get   ('/get/:id',    auth, allow(...prof), Diario.get)
router.put   ('/editar',     auth, allow(...adm),  Diario.editar)
router.get   ('/notas/:id',  auth, allow(...prof), Diario.notas)
router.post  ('/nota',       auth, allow(...prof), Diario.salvarNota)
router.put   ('/nota',       auth, allow(...prof), Diario.editarNota)
router.delete('/nota/:id',   auth, allow(...prof), Diario.deletarNota)

export default router
