import banco from '../config/banco.js'
import Turma from './Turma.js'
import Funcionario from './Funcionario.js'

const Diario = banco.sequelize.define('diarios', {

    id:{
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4
    },

    descricao:{
        type: banco.Sequelize.STRING(100),
    },

    status:{
        type: banco.Sequelize.INTEGER
    }

})

Diario.belongsTo(Funcionario, {
    foreignKey: 'funcionario_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    constraints: true,
    as: 'professor'
})

Diario.belongsTo(Turma, {
    foreignKey: 'turma_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    constraints: true,
    as: 'turma'
})

export default Diario