export const allow = (...tiposPermitidos) => {
    return (req, res, next) => {
        console.log('CATEGORIA: '+req.categoria)
        if (req.categoria == null) {
            return res.status(403).json({ message: "Tipo de usuário não identificado" });
        }

        // garante comparação numérica
        const tipo = Number(req.categoria);
        console.log('TIPO: '+tipo);
        console.log(tiposPermitidos);
        if (!tiposPermitidos.includes(tipo)) {
            console.log('Não permitido!')
            return res.status(401).json({ message: "Você não tem permissão para acessar essa funcionalidade!" });
        }
        console.log('Chegou ao final!')
        next();
    };
};

export const categoria = {
    ADMIN: 1,
    SECRETARIA: 2,
    PROFESSOR: 3,
    ALUNO: 4
}