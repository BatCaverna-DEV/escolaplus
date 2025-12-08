import Calendario from '../models/Calendario.js';

class CalendarioController{

    salvar = async (req, res) => {
        const {descricao, ano} = req.body;
        const dados = {
            descricao: descricao,
            ano: ano,
            status: 1
        }
        const ativo = await Calendario.findOne({
            where: {
                status: 1
            }
        })
        if(ativo){
            return res.status(400).json({message: 'Já existe um calendário ativo!'})
        }
        Calendario.create(dados).then((calendario) => {
            return res.status(200).json(calendario);
        }).catch((err) => {
            return res.status(400).json(err);
        })
    }//Fim do salvar

    ativo = async (req, res) => {
        try{
            const calendario = await Calendario.findOne({
                where: {
                    status: 1
                }
            })
            if(calendario){
                return res.status(200).json(calendario);
            }else{
                return res.status(404).json({message: 'Não existe calendário ativo!'})
            }
        }catch(err){
            return res.status(400).json(err);
        }
    }

    listar = async (req, res) => {
        try{
            const calendarios = await Calendario.findAll({
                order: [['status', 'DESC']]
            })
            return res.status(200).json(calendarios);
        }catch(err){
            return res.status(400).json(err);
        }
    }//Fim do Listar

}//Fim da classe

export default new CalendarioController();