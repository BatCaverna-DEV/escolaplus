import banco from '../config/banco.js'
import Usuario from './Usuario.js'

const Aluno = banco.sequelize.define('alunos', {

    id: {
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4
    },

    nome: {
        type: banco.Sequelize.STRING(150)
    },

    cep: {
        type: banco.Sequelize.STRING(15)
    },

    endereco: {
        type: banco.Sequelize.STRING(150)
    },

    numero: {
        type: banco.Sequelize.INTEGER,
    },

    bairro: {
        type: banco.Sequelize.STRING(150)
    },

    cidade: {
        type: banco.Sequelize.STRING(150)
    },

    estado: {
        type: banco.Sequelize.STRING(100)
    },

    nascimento: {
        type: banco.Sequelize.DATE
    },

    pai: {
        type: banco.Sequelize.STRING(150)
    },

    cpf_pai: {
        type: banco.Sequelize.STRING(30)
    },

    mae: {
        type: banco.Sequelize.STRING(150)
    },

    cpf_mae: {
        type: banco.Sequelize.STRING(30)
    },

    telefone1: {
        type: banco.Sequelize.STRING(15)
    },

    telefone2: {
        type: banco.Sequelize.STRING(15)
    },

    telefone3: {
        type: banco.Sequelize.STRING(15)
    },

    obs: {
        type: banco.Sequelize.TEXT
    },

    saude:{
        type: banco.Sequelize.STRING(20),
    },
    hospital: {
        type: banco.Sequelize.STRING(20),
    },
    sozinho:{
        type: banco.Sequelize.STRING(20),
    },
    alergia:{
        type: banco.Sequelize.STRING(20),
    },
    redes:{
        type: banco.Sequelize.STRING(20),
    },
    status: {
        type: banco.Sequelize.STRING(45)
    },

    foto: {
        type: banco.Sequelize.TEXT('long')
    }

})


// RELACIONAMENTO: aluno pertence a um usuário
Aluno.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    as: 'usuario'
})

export default Aluno
