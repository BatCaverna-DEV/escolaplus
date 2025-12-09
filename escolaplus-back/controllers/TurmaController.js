import Turma from '../models/Turma.js'
import Calendario from '../models/Calendario.js'
import Diario from '../models/Diario.js'
import Funcionario from '../models/Funcionario.js'
import Aluno from '../models/Aluno.js'
import Matricula from '../models/Matricula.js'

class TurmaController {

    listar = async (req, res) => {

        const id = req.params.id //Calendário

        try{

            const turmas = await Turma.findAll({
                where:{
                    calendario_id: id
                },
                include:{
                    model: Calendario,
                    as: 'calendario',
                }
            })

            return res.status(200).json(turmas)

        }catch(err){
            return res.status(400).send(err)
        }

    }//Fim do Listar

    get = async (req, res) => {
        const id = req.params.id
        try{
            const turma = await Turma.findOne({
                where:{
                    id: id
                },
                include:{
                    model: Calendario,
                    as: 'calendario',
                }
            })
            if(!turma){
                return res.status(404).send('Turma not found')
            }
            return res.status(200).json(turma)
        }catch(err){
            return res.status(400).send(err)
        }
    }//fim do get

    diarios = async (req, res) => {
        try{
            const id = req.params.id
            const diarios = await Diario.findAll({
                where:{
                    turma_id: id
                },
                include:[
                    {
                        model: Funcionario,
                        as: 'professor',
                    },
                    {
                        model: Turma,
                        as: 'turma',
                    }]
            })
            return res.status(200).json(diarios)
        }catch(err){
            return res.status(400).send(err)
        }
    }//Fim dos Diários

    matriculas = async (req, res) => {

        try{

            const id = req.params.id
            const matriculas = await Matricula.findAll({
                where:{
                    turma_id: id
                },
                include:{
                    model: Aluno,
                    as: 'aluno',
                }
            })
            return res.status(200).json(matriculas)
        }catch(err){
            return res.status(400).send(err)
        }

    }//fim dos alunos

}//Fim da Classe

export default new TurmaController()