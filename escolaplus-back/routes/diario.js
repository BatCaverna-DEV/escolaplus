import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Diario from '../controllers/DiarioController.js'
import { allow, categoria } from '../helpers/permissao.js';

const sec   = [categoria.SECRETARIA]
const prof  = [categoria.SECRETARIA, categoria.PROFESSOR]
const todos = [categoria.SECRETARIA, categoria.PROFESSOR, categoria.ALUNO]

router.get   ('/meus',       auth, allow(...todos), Diario.meus)       // professor: seus diários; aluno: suas turmas
router.get   ('/boletim',    auth, allow(categoria.ALUNO), Diario.boletim)  // aluno: todas as notas
router.get   ('/get/:id',    auth, allow(...todos), Diario.get)
router.put   ('/editar',     auth, allow(...sec),   Diario.editar)
router.get   ('/notas/:id',  auth, allow(...todos), Diario.notas)      // aluno vê só as próprias notas
router.post  ('/nota',       auth, allow(...prof),  Diario.salvarNota)
router.put   ('/nota',       auth, allow(...prof),  Diario.editarNota)
router.delete('/nota/:id',   auth, allow(...prof),  Diario.deletarNota)

export default router
