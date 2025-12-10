import Funcionario from "../models/Funcionario.js";
import Usuario from "../models/Usuario.js";

class FuncionarioController {

    listar = async (req, res) => {
        try{
            const funcionarios = await Funcionario.findAll({
                order:[['nome', 'ASC']]
            });
            return res.status(200).json(funcionarios);
        }catch(err){
            return res.status(500).json(error);
        }
    }

}//Fim da Classe

export default new FuncionarioController();