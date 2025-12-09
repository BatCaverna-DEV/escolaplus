import Aluno from '../models/Aluno.js'
import Usuario from '../models/Usuario.js'
import Turma from '../models/Turma.js'
import Calendario from '../models/Calendario.js'
import Diario from '../models/Diario.js'
import Nota from '../models/Nota.js'
import {semfoto} from "../helpers/foto.js";
import {gerarMatricula} from "../helpers/matricula.js";
import Matricula from "../models/Matricula.js";
import diario from "../models/Diario.js";

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
            const aluno = await Aluno.findOne({
                where: {id: id},
                include:{
                    model: Matricula,
                    as: 'matriculas',
                    required: false
                }
            });
            console.log(aluno);
            if(!aluno){
                return res.status(404).send({message:"Aluno não encontrado!"})
            }
            return res.status(200).json(aluno)
        }catch(err){
            res.status(400).send(err);
        }
    }

    matricular = async function (req, res) {

        const dados = req.body
        const turma = await Turma.findByPk(dados.turma_id);
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

        return res.status(200).json({message:"Aluno matriculado com sucesso!"})

    }//Fim do matricular

}//Fim da Classe

export default new AlunoController();