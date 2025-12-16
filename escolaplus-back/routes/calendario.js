import express from 'express';
const router = express.Router();
import Calendario from '../controllers/CalendarioController.js';
import auth from '../helpers/auth.js';
import {categoria, allow} from "../helpers/permissao.js";

router.post('/salvar', auth, allow(categoria.ADMIN),Calendario.salvar);
router.get('/ativo', auth, allow(categoria.ADMIN, categoria.SECRETARIA),Calendario.ativo);
router.get('/listar', auth, allow(categoria.ADMIN), Calendario.listar);

export default router