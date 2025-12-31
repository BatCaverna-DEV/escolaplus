import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js'
import Aluno from '../controllers/AlunoController.js';
import {allow, categoria} from "../helpers/permissao.js";

router.post('/salvar', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Aluno.salvar)
router.get('/listar/:busca', auth, allow(categoria.ADMIN, categoria.SECRETARIA), Aluno.listar);
router.get('/get/:id', auth, allow(categoria.ADMIN, categoria.SECRETARIA, categoria.PROFESSOR), Aluno.get);
router.post('/matricular', auth, allow(categoria.ADMIN, categoria.SECRETARIA), Aluno.matricular);
router.put('/editar', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Aluno.editar);

export default router