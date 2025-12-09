import banco from '../config/banco.js'
import Diario from './Diario.js'
import Matricula from './Matricula.js'

const Nota = banco.sequelize.define('notas', {

    id:{
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4,
    },

    descricao:{
        type: banco.Sequelize.STRING(20)
    },

    valor:{
        type: banco.Sequelize.DECIMAL(5,2),
    },

    semestre:{
        type: banco.Sequelize.INTEGER,
    },

})

Nota.belongsTo(Matricula, {
    foreignKey: 'matricula_id',
    constraints: true,
    onDelete: 'CASCADE',
    as: 'matricula'
})

Nota.belongsTo(Diario, {
    foreignKey: 'diario_id',
    onDelete: 'CASCADE',
    constraints: true,
    as: 'diario'
})

export default Nota