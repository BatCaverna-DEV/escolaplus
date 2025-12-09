import banco from '../config/banco.js'

const Calendario = banco.sequelize.define('calendarios', {
    id:{
        type: banco.Sequelize.UUID,
        defaultValue: banco.Sequelize.UUIDV4,
        primaryKey: true,
    },
    descricao: {
        type: banco.Sequelize.STRING(100),
    },
    ano: {
        type: banco.Sequelize.INTEGER,
    },
    status:{
        type: banco.Sequelize.INTEGER,
    },
    media:{
        type: banco.Sequelize.DECIMAL(5,2),
    },
    etapas:{
        type: banco.Sequelize.INTEGER,
    },
    notas:{
        type: banco.Sequelize.INTEGER,
    }
})

export default Calendario