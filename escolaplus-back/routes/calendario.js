import express from 'express';
const router = express.Router();
import Calendario from '../controllers/CalendarioController.js';
import auth from '../helpers/auth.js';

router.post('/salvar', auth, Calendario.salvar);
router.get('/ativo', auth, Calendario.ativo);
router.get('/listar', auth, Calendario.listar);

export default router