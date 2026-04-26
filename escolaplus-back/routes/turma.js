import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import { allow, categoria } from '../helpers/permissao.js';
import Turma from '../controllers/TurmaController.js'

const sec   = [categoria.SECRETARIA]
const prof  = [categoria.SECRETARIA, categoria.PROFESSOR]
const todos = [categoria.SECRETARIA, categoria.PROFESSOR, categoria.ALUNO]

router.get('/listar/:id',   auth, allow(...sec),   Turma.listar)
router.get('/get/:id',      auth, allow(...todos),  Turma.get)
router.get('/diarios/:id',  auth, allow(...todos),  Turma.diarios)
router.get('/matriculas/:id', auth, allow(...prof), Turma.matriculas)

export default router
