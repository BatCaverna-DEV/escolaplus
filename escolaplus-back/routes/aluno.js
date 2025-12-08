import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js'
import Aluno from '../controllers/AlunoController.js';

router.post('/salvar', auth, Aluno.salvar)
router.get('/listar', auth, Aluno.listar);
router.get('/get/:id', auth, Aluno.get);

export default router