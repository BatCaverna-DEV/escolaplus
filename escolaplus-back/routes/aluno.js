import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js'
import Aluno from '../controllers/AlunoController.js';
import {allow, categoria} from "../helpers/permissao.js";

router.post('/salvar', auth,Aluno.salvar)
router.get('/listar', auth, allow(categoria.ADMIN, categoria.SECRETARIA), Aluno.listar);
router.get('/get/:id', auth, Aluno.get);
router.post('/matricular', auth, Aluno.matricular);
router.post('/editar', auth, Aluno.editar);

export default router