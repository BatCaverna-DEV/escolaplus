import Funcionario from "../models/Funcionario.js";
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize";
import {semfoto} from "../helpers/foto.js";
import bcrypt from "bcrypt";
import {enviarMensagem} from "../helpers/email.js";

class FuncionarioController {

    salvar = async function (req, res) {
        try{
            const dados = req.body
            //Verifica se o cpf já está cadastrado
            const existe = await Funcionario.findOne({
                where: {
                    cpf: dados.cpf
                }
            })
            if(existe){
                return res.status(400).json({message: 'CPF '+dados.cpf+' já cadatrado'})
            }

            //Coloca foto SemFoto
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
                    as: 'usuario',
                    required: false,  // LEFT JOIN: inclui funcionários sem usuário
                },
                where: {
                    [Op.or]: [
                        { '$usuario.categoria$': { [Op.ne]: 3 } }, // não é aluno
                        { '$usuario.id$': null },                   // sem usuário vinculado
                    ]
                }
            });
            return res.status(200).json(funcionarios);
        }catch(err){
            return res.status(500).json(err);
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

    // PUT /editar — professor só pode editar o próprio registro
    editar = async function (req, res) {
        const id = req.body.id;
        const { funcionarioId, categoria: cat } = req
        try{
            if (Number(cat) === 2) { // PROFESSOR
                if (funcionarioId !== id) {
                    return res.status(403).json({ message: 'Você só pode editar seu próprio cadastro' })
                }
            }
            const funcionario = await Funcionario.findOne({ where: { id } })
            if (!funcionario) return res.status(404).json({ message: 'Funcionário não encontrado' })
            const funcionario_alterado = await funcionario.update(req.body)
            return res.status(200).json(funcionario_alterado)
        }catch(err){
            return res.status(400).json(err);
        }
    }

    // POST /funcionario/gerar-usuario/:id — cria usuário para funcionário sem acesso
    gerarUsuario = async (req, res) => {
        const { id } = req.params
        try {
            const funcionario = await Funcionario.findByPk(id)
            if (!funcionario) return res.status(404).json({ message: 'Funcionário não encontrado' })
            if (funcionario.usuario_id) return res.status(400).json({ message: 'Funcionário já possui usuário vinculado' })

            // Gera username: primeironome.ultimonome sem acentos
            const PREP = new Set(['de','da','do','dos','das','e'])
            const semAcento = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
            const partes = funcionario.nome.trim().split(/\s+/).filter(p => !PREP.has(p.toLowerCase()))
            const base   = `${semAcento(partes[0])}.${semAcento(partes[partes.length - 1])}`

            // Resolve duplicatas
            const existentes = await Usuario.findAll({ where: { username: { [Op.like]: `${base}%` } }, attributes: ['username'] })
            const usados = new Set(existentes.map(u => u.username))
            let username = base, n = 2
            while (usados.has(username)) username = `${base}${n++}`

            // Cria usuário com senha temporária
            const senha    = Math.floor(100000 + Math.random() * 900000).toString()
            const salt     = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(senha, salt)
            const usuario  = await Usuario.create({ username, categoria: 2, status: 0, password })

            await funcionario.update({ usuario_id: usuario.id })

            // Tenta enviar e-mail (falha silenciosa)
            try {
                await enviarMensagem({
                    to: funcionario.email,
                    subject: 'Acesso criado - EscolaPlus',
                    html: `Seu usuário é <strong>${username}</strong> e sua senha temporária é <strong>${senha}</strong>.`,
                })
            } catch (_) {}

            return res.status(200).json({ message: `Usuário <strong>${username}</strong> criado. Senha temporária enviada para ${funcionario.email}.` })
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // GET /funcionario/eu — professor autenticado consulta o próprio perfil
    eu = async (req, res) => {
        const { userId } = req
        try {
            const funcionario = await Funcionario.findOne({
                where: { usuario_id: userId },
                include: [{ model: Usuario, as: 'usuario' }]
            })
            if (!funcionario) return res.status(404).json({ message: 'Funcionário não encontrado' })
            return res.status(200).json(funcionario)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

}//Fim da Classe

export default new FuncionarioController();