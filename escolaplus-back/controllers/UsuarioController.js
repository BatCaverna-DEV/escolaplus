import Usuario from "../models/Usuario.js";
import Funcionario from "../models/Funcionario.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import {enviarMensagem, mascararEmail} from "../helpers/email.js";
import dotenv from 'dotenv'
import usuario from "../models/Usuario.js";
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
            console.log(user)
            const token = jwt.sign({usuario_id: user.id, funcionario_id: funcionario.id, categoria: user.categoria}, secret, {expiresIn: expire} )
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
        const {senha, novasenha, repetida, usuario_id} = req.body
        try{
            const usuario = await Usuario.findByPk(usuario_id)
            const isMatch = await bcrypt.compare(senha, usuario.password)
            if(isMatch){
                if(novasenha === repetida){
                    const salt = await bcrypt.genSalt(10)
                    const password = await bcrypt.hash(novasenha, salt)
                    await usuario.update({
                        password: password,
                        status: 1
                    })
                    return res.status(200).json({message: 'Senha alterada com sucesso!'})
                }else{
                    return res.status(400).json({message: 'Repita a mesma senha!'})
                }
            }else{
                return res.status(400).json({message: 'Senha atual incorreta!'})
            }
        }catch(err){
            return res.status(500).json({message: err.message})
        }
    }

    acesso = async (req, res) => {
        try{
            const id = req.params.id
            const usuario = await Usuario.findByPk(id)
            const funcionario = await Funcionario.findOne({
                where: {usuario_id: usuario.id}
            })
            const senha = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(senha, salt)
            await usuario.update({
                password: password,
                status: 1
            })
            await enviarMensagem({
                to: funcionario.email,
                subject: 'Nova Senha - EscolaPlus',
                text: 'Sua nova senha é '+senha+', altere-a quando acessar o EscolaPlus.',
                html: `Sua nova senha é <strong>${senha}</strong>, altere-a quando acessar o EscolaPlus.`
            })
            return res.status(200).json({message: 'Senha reenviada para o email: '+funcionario.email})
        }catch(err){
            return res.status(500).json({message: err.message})
        }
    }

    gerar = async (req, res) => {

        const salt = await bcrypt.genSalt(10)
        const senha = req.params.senha
        const password = await bcrypt.hash(senha, salt)
        res.status(200).send({'senha': password})

    }

}//Fim do Controller

export default new UsuarioController();