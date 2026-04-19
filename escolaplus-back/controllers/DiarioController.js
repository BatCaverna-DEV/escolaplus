import Diario from '../models/Diario.js'
import Funcionario from '../models/Funcionario.js'
import Turma from '../models/Turma.js'

class DiarioController {

    get = async (req, res) => {
        const id = req.params.id
        try{
            const diario = await Diario.findOne({
                where:{
                    id: id
                },
                include:[
                    {
                        model: Turma,
                        as: 'turma',
                    },
                    {
                        model: Funcionario,
                        as: 'professor',
                    }]
            })
            if(!diario){
                return res.status(404).send('Diario não encontrado')
            }
            console.log(diario)
            return res.status(200).json(diario)
        }catch(err){
            console.log(err)
            return res.status(400).send(err)
        }
    }//fim do get

}

export default new DiarioController()