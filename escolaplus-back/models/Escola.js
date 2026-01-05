import banco from "../config/banco.js";

const Escola  = banco.sequelize.define("escolas", {

    id:{
        type: banco.Sequelize.UUID,
        primaryKey: true,
        defaultValue: banco.Sequelize.UUIDV4
    },

    nome:{
        type: banco.Sequelize.STRING(100),
    },

    endereco: {
        type: banco.Sequelize.STRING(100),
    },

    bairro:{
        type: banco.Sequelize.STRING(100),
    },
    cidade:{
        type: banco.Sequelize.STRING(100),
    },
    estado:{
        type: banco.Sequelize.STRING(100),
    },
    email: {
        type: banco.Sequelize.STRING(100),
    },
    telefone:{
        type: banco.Sequelize.STRING(25),
    },
    instagram:{
        type: banco.Sequelize.STRING(25),
    },
    inep:{
        type: banco.Sequelize.INTEGER,
    },
    logo:{
        type: banco.Sequelize.TEXT('long'),
    },
})

export default Escola