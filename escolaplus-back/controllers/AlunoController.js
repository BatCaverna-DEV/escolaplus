import Aluno from '../models/Aluno.js'
import Usuario from '../models/Usuario.js'
import {semfoto} from "../helpers/foto.js";
import {gerarMatricula} from "../helpers/matricula.js";

class AlunoController {

    salvar = async function (req, res) {
        try{
            const dados = req.body
            if(!dados.foto){
                dados.foto = semfoto
            }

            dados.status = 1
            dados.matricula = gerarMatricula()

            Aluno.create(dados).then((aluno)=>{
                return res.status(200).json({message:"Aluno cadastrado com sucesso", id: aluno.id})
            }).catch(err=>{
                return res.status(400).json(err)
            })
        }catch(err){
            return res.status(500).send(err);
        }
    }//Fim do salvar

    listar = async function (req, res) {
        try{
            const alunos = await Aluno.findAll({
                include:{
                    model: Usuario,
                    as: 'usuario'
                },
                order:[['nome','ASC']]
            })
            return res.status(200).json(alunos)
        }catch(err){
            return res.status(500).send(err);
        }
    }//Fim do Listar

    get = async function (req, res) {
        try{
            const id = req.params.id;
            const aluno = await Aluno.findByPk(id);
            if(!aluno){
                return res.status(404).send({message:"Aluno não encontrado!"})
            }
            return res.status(200).json(aluno)
        }catch(err){
            res.status(400).send(err);
        }
    }

}//Fim da Classe

export default new AlunoController();