import banco from '../config/banco.js'
import Calendario from './Calendario.js'

const Turma = banco.sequelize.define('turmas', {

    id:{
        type: banco.Sequelize.UUID,
        defaultValue: banco.Sequelize.UUID,
        primaryKey: true
    },

    descricao:{
        type: banco.Sequelize.STRING(100),
    },

    sigla:{
        type: banco.Sequelize.STRING(20),
    },

    status:{
        type: banco.Sequelize.INTEGER
    }

})

Turma.belongsTo(Calendario, {
    foreignKey: 'calendario_id',
    onDelete: 'CASCADE',
    constraints: true,
    as: 'calendario',
})

export default Turma