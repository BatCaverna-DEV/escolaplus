export const allow = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (req.categoria == null) {
            return res.status(403).json({ message: "Tipo de usuário não identificado" });
        }
        const tipo = Number(req.categoria);
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(401).json({ message: "Você não tem permissão para acessar essa funcionalidade!" });
        }
        next();
    };
};

// Tipo 1 – Secretaria: acesso total
// Tipo 2 – Professor:  seus diários, seus dados, lançar/editar notas
// Tipo 3 – Aluno:      seus diários, seu boletim, suas notas
export const categoria = {
    SECRETARIA: 1,
    PROFESSOR:  2,
    ALUNO:      3,
}
