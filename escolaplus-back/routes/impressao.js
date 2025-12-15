import express from "express";
const router = express.Router();
import Impressao from "../controllers/ImpressaoController.js";
import auth from "../helpers/auth.js";

router.get('/ficha/:id', auth, Impressao.ficha)

export default router