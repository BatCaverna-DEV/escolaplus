import Diario from '../models/Diario.js'
import Funcionario from '../models/Funcionario.js'
import Turma from '../models/Turma.js'
import Matricula from '../models/Matricula.js'
import Aluno from '../models/Aluno.js'
import Nota from '../models/Nota.js'

class DiarioController {

    get = async (req, res) => {
        const id = req.params.id
        try {
            const diario = await Diario.findOne({
                where: { id },
                include: [
                    { model: Turma,       as: 'turma'    },
                    { model: Funcionario, as: 'professor' },
                ]
            })
            if (!diario) return res.status(404).json({ message: 'Diário não encontrado' })
            return res.status(200).json(diario)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    editar = async (req, res) => {
        const { id, descricao, status, funcionario_id } = req.body
        try {
            await Diario.update({ descricao, status, funcionario_id }, { where: { id } })
            const diario = await Diario.findOne({
                where: { id },
                include: [
                    { model: Turma,       as: 'turma'    },
                    { model: Funcionario, as: 'professor' },
                ]
            })
            return res.status(200).json(diario)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // Retorna todas as matrículas da turma do diário com suas notas neste diário
    notas = async (req, res) => {
        const diario_id = req.params.id
        try {
            const diario = await Diario.findOne({ where: { id: diario_id } })
            if (!diario) return res.status(404).json({ message: 'Diário não encontrado' })

            const [matriculas, notas] = await Promise.all([
                Matricula.findAll({
                    where: { turma_id: diario.turma_id, status: 1 },
                    include: [{ model: Aluno, as: 'aluno' }],
                    order: [[{ model: Aluno, as: 'aluno' }, 'nome', 'ASC']]
                }),
                Nota.findAll({ where: { diario_id } })
            ])

            const resultado = matriculas.map(m => ({
                ...m.toJSON(),
                notas: notas.filter(n => n.matricula_id === m.id)
            }))

            return res.status(200).json(resultado)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    salvarNota = async (req, res) => {
        const { matricula_id, diario_id, descricao, valor, semestre } = req.body
        try {
            const nota = await Nota.create({ matricula_id, diario_id, descricao, valor, semestre })
            return res.status(200).json(nota)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    editarNota = async (req, res) => {
        const { id, descricao, valor, semestre } = req.body
        try {
            await Nota.update({ descricao, valor, semestre }, { where: { id } })
            const nota = await Nota.findOne({ where: { id } })
            return res.status(200).json(nota)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    deletarNota = async (req, res) => {
        const { id } = req.params
        try {
            await Nota.destroy({ where: { id } })
            return res.status(200).json({ message: 'Nota removida com sucesso' })
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export default new DiarioController()
