import banco from '../config/banco.js'
import Usuario from './Usuario.js'

const Funcionario = banco.sequelize.define('funcionarios', {

    id:{
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4
    },

    nome:{
        type: banco.Sequelize.STRING(150),
    },

    telefone1:{
        type: banco.Sequelize.STRING(20),
    },

    telefone2:{
        type: banco.Sequelize.STRING(20),
    },

    cpf:{
        type: banco.Sequelize.STRING(20),
    },

    email:{
        type: banco.Sequelize.STRING(150),
    },

    foto:{
        type: banco.Sequelize.TEXT('long'),
    },
    status:{
        type: banco.Sequelize.INTEGER
    }
})

Funcionario.belongsTo(Usuario,{
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    constraints: true,
    as: 'usuario'
})

export default Funcionario