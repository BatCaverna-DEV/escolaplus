import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Turma from '../controllers/TurmaController.js'

router.get('/listar/:id', auth, Turma.listar);

export default router