import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Diario from '../controllers/DiarioController.js'
import {allow, categoria} from "../helpers/permissao.js";

router.get('/get/:id', auth, allow(categoria.ADMIN, categoria.SECRETARIA), Diario.get);

export default router