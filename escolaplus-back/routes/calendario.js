import express from 'express';
const router = express.Router();
import Calendario from '../controllers/CalendarioController.js';
import auth from '../helpers/auth.js';
import { categoria, allow } from "../helpers/permissao.js";

const sec  = [categoria.SECRETARIA]
const prof = [categoria.SECRETARIA, categoria.PROFESSOR]

router.post('/salvar', auth, allow(...sec),  Calendario.salvar)
router.get ('/ativo',  auth, allow(...prof), Calendario.ativo)   // professor precisa para matrícula
router.get ('/listar', auth, allow(...sec),  Calendario.listar)

export default router
