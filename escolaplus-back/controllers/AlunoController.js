import Aluno from '../models/Aluno.js'
import Usuario from '../models/Usuario.js'
import Turma from '../models/Turma.js'
import Calendario from '../models/Calendario.js'
import Diario from '../models/Diario.js'
import Nota from '../models/Nota.js'
import {semfoto} from "../helpers/foto.js";
import {gerarMatricula} from "../helpers/matricula.js";
import Matricula from "../models/Matricula.js";


class AlunoController {

    salvar = async function (req, res) {
        try{
            const dados = req.body
            if(!dados.foto){
                dados.foto = semfoto
            }

            dados.status = 0

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
                include:[{
                    model: Usuario,
                    as: 'usuario'
                },{
                    model: Matricula,
                    as: 'matriculas'
                }],
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
            const aluno = await Aluno.findOne({
                where: {id: id},
                include:{
                    model: Matricula,
                    as: 'matriculas',
                    include: [{
                        model: Turma,
                        as: 'turma'
                    }]
                }
            });

            if(!aluno){
                return res.status(404).send({message:"Aluno não encontrado!"})
            }
            // aluno.matricula = await Matricula.findOne({
            //     where:{
            //         aluno_id: aluno.id,
            //         status: 1
            //     },
            //     include:{
            //         model: Turma,
            //         as: 'turma'
            //     }
            // })
            return res.status(200).json(aluno)
        }catch(err){
            res.status(400).send(err);
        }
    }

    matricular = async function (req, res) {

        const dados = req.body
        const turma = await Turma.findByPk(dados.turma_id);
        const aluno = await Aluno.findByPk(dados.aluno_id);
        const diarios = await Diario.findAll({
            where: {
                turma_id: turma.id
            }
        })
        const calendario = await Calendario.findOne({
            where: {
                status: 1
            }
        })

        dados.matricula = gerarMatricula(turma.sigla, turma.ordem)
        dados.status = 1

        //Atualiza a ordem da turma
        await turma.update({ordem: turma.ordem + 1})

        //cria a matrícula
        const matricula = await Matricula.create(dados)

        //Atualiza o status do aluno
        await aluno.update({status: 1})

        //Gerar as notas dos diários
        for(const diario of diarios){
            let cont = 1
            for(let i = 0; i < calendario.etapas; i++){
                for(let j = 0; j < calendario.notas; j++){
                    let n = {
                        descricao: 'N'+cont,
                        matricula_id: matricula.id,
                        diario_id: diario.id,
                        semestre: i+1
                    }
                    cont++
                    await Nota.create(n)
                }//Fim do for das notas

                //Cria as Recuperações
                let rec = {
                    descricao: 'Rec'+(i+1),
                    matricula_id: matricula.id,
                    diario_id: diario.id,
                    semestre: i+1
                }
                await Nota.create(rec)
            }//Fim do for das etapas
            //Cria a Prova Final
            let final = {
                descricao: 'Final',
                matricula_id: matricula.id,
                diario_id: diario.id,
                semestre: calendario.etapas,
            }
            await Nota.create(final)
        }//fim do for do diário

        return res.status(200).json({message:"Aluno matriculado com sucesso!", id:matricula.aluno_id})

    }//Fim do matricular

    editar = async function (req, res) {
        const id = req.body.id;
        try{
            const aluno = await Aluno.findOne({
                where: {id: id},
            })
            const dados = req.body
            const aluno_alterado = await aluno.update(dados)
            return res.status(200).json(aluno_alterado)
        }catch(err){
            return res.status(400).json(err);
        }
    }

}//Fim da Classe

export default new AlunoController();