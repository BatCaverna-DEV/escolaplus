import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const secret = process.env.JWT_SECRET
const expire = process.env.JWT_EXPIRE

class UsuarioController {

    login = async (req, res) => {

        try{
            let username = req.body.username
            let password = req.body.password
            const user = await Usuario.findOne({
                where:{
                    username: username
                },
            })

            if (!user) {
                return res.status(401).json({'message': 'Usuário não encontrado!'})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(401).json({'message': 'Senha Incorreta!'})
            }

            const funcionario = await Funcionario.findOne({
                where:{
                    usuario_id: user.id,
                }
            })

            const token = jwt.sign({id: user.id, nome:funcionario.nome,username: user.username, email: user.email}, secret, {expiresIn: expire} )

            return res.status(200).json({'value': token})
        }catch(err){
            return res.status(500).json({'message': err})
        }

    }//Fim do Login

    get = async (req, res) => {
        const id = req.params.id
        try{
            const usuario = await Usuario.findByPk(id)
            if(!usuario){
                return res.status(200).json(usuario)
            }
            return res.status(500).json({message: 'Usuário não encontrado!'})
        }catch(err){
            return res.status(500).json({'message': err.message})
        }
    }

    senha = async (req, res) => {

        const salt = await bcrypt.genSalt(10)
        const senha = req.params.senha
        const password = await bcrypt.hash(senha, salt)
        res.status(200).send({'senha': password})

    }

}

export default new UsuarioController();