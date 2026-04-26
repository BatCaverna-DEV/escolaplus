import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js'
import Aluno from '../controllers/AlunoController.js';
import { allow, categoria } from "../helpers/permissao.js";

const sec  = [categoria.SECRETARIA]
const prof = [categoria.SECRETARIA, categoria.PROFESSOR]

router.post('/salvar',       auth, allow(...sec),  Aluno.salvar)
router.get ('/listar/:busca',auth, allow(...sec),  Aluno.listar)
router.post('/buscar',       auth, allow(...sec),  Aluno.buscar)
router.get ('/get/:id',      auth, allow(...prof), Aluno.get)
router.post('/matricular',   auth, allow(...sec),  Aluno.matricular)
router.put ('/editar',       auth, allow(...sec),  Aluno.editar)

// Aluno autenticado consulta o próprio perfil
router.get('/eu', auth, allow(categoria.ALUNO), Aluno.eu)

export default router
