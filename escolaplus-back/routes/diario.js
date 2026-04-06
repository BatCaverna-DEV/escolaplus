import express from 'express';
const router = express.Router();
import auth from '../helpers/auth.js';
import Diario from '../controllers/DiarioController.js'

router.get('/get/:id', auth, Diario.get);

export default router