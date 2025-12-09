import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Turma from '../controllers/TurmaController.js'

router.get('/listar/:id', auth, Turma.listar);
router.get('/get/:id', auth, Turma.get);
router.get('/diarios/:id', auth, Turma.diarios);
router.get('/matriculas/:id', auth, Turma.matriculas);

export default router