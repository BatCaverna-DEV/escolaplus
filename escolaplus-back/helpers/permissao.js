export const allow = (...tiposPermitidos) => {
    return (req, res, next) => {
        console.log('CATEGORIA: '+req.categoria)
        if (req.categoria == null) {
            return res.status(403).json({ message: "Tipo de usuário não identificado" });
        }

        // garante comparação numérica
        const tipo = Number(req.categoria);

        if (!tiposPermitidos.includes(tipo)) {
            return res.status(403).json({ message: "Você não tem permissão para acessar essa funcionalidade!" });
        }

        next();
    };
};

export const categoria = {
    ADMIN: 1,
    SECRETARIA: 2,
    PROFESSOR: 3,
    ALUNO: 4
}