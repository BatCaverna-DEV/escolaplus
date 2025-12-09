import banco from '../config/banco.js'
import Turma from './Turma.js'
import Aluno from './Aluno.js'

const Matricula = banco.sequelize.define('matriculas', {

    id:{
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4
    },
    matricula:{
        type: banco.Sequelize.STRING(20),
        unique: true,
        allowNull: false
    },
    status:{
        type: banco.Sequelize.INTEGER,
    },
    resultado:{
        type: banco.Sequelize.STRING(10),
    }
})

Matricula.belongsTo(Turma, {
    foreignKey: 'turma_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    constraints: true,
    as: 'turma',
})

Matricula.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    constraints: true,
    as: 'aluno',
})

export default Matricula