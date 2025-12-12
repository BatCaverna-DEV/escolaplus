import Funcionario from "../models/Funcionario.js";
import Usuario from "../models/Usuario.js";
import {semfoto} from "../helpers/foto.js";
import bcrypt from "bcrypt";
import {enviarMensagem} from "../helpers/email.js";

class FuncionarioController {

    salvar = async function (req, res) {
        try{
            const dados = req.body
            if(!dados.foto){
                dados.foto = semfoto
            }

            dados.status = 1

            //Gerar Senha Temporária
            const salt = await bcrypt.genSalt(10)
            let senha = Math.floor(100000 + Math.random() * 900000).toString();
            const password = await bcrypt.hash(senha, salt)

            const usuario = await Usuario.create({
                username: dados.cpf.replace(/\D/g,''),
                categoria: dados.categoria,
                status: 0,
                password: password
            })
            dados.usuario_id = usuario.id

            Funcionario.create(dados).then(async (funcionario)=>{

                //Envia a senha temporária para o E-mail
                let msg = `Sua senha temporária é <strong>${senha}</strong>.`;
                await enviarMensagem({
                    to: funcionario.email,
                    subject: 'Senha Temporária - EscolaPlus',
                    text: msg,
                    html: `<h4>${msg}</h4>`,
                })
                console.log('Email foi enviado!')

                return res.status(200).json({message:"Funcionario cadastrado com sucesso! Senha Enviada para o E-mail cadastrado!", id: funcionario.id})
            }).catch(err=>{
                return res.status(400).json(err)
            })
        }catch(err){
            return res.status(500).send(err);
        }
    }//Fim do salvar

    listar = async (req, res) => {
        try{
            const funcionarios = await Funcionario.findAll({
                order:[['nome', 'ASC']],
                include:{
                    model: Usuario,
                    as: 'usuario'
                }
            });
            return res.status(200).json(funcionarios);
        }catch(err){
            return res.status(500).json(error);
        }
    }

    get = async (req, res) => {
        try{
            const id = req.params.id;
            const funcionario = await Funcionario.findOne({
                where: {id: id},
                include: [{
                    model: Usuario,
                    as: "usuario",
                }]
            });

            if(!funcionario){
                return res.status(404).send({message:"Funcionario não encontrado!"})
            }

            return res.status(200).json(funcionario)
        }catch(err){
            res.status(400).send(err);
        }
    }



    editar = async function (req, res) {
        const id = req.body.id;
        try{
            const funcionario = await Funcionario.findOne({
                where: {id: id},
            })
            const dados = req.body
            const funcionario_alterado = await funcionario.update(dados)
            return res.status(200).json(funcionario_alterado)
        }catch(err){
            return res.status(400).json(err);
        }
    }

}//Fim da Classe

export default new FuncionarioController();