import Turma from '../models/Turma.js'

class TurmaController {

    listar = async (req, res) => {

        const id = req.params.id //Calendário

        try{

            const turmas = await Turma.findAll({
                where:{
                    calendario_id: id
                }
            })

            return res.status(200).json(turmas)

        }catch(err){
            return res.status(400).send(err)
        }

    }//Fim do Listar

}

export default new TurmaController()