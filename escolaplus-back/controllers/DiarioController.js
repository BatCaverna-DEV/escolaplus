import Diario from '../models/Diario.js'
import Funcionario from '../models/Funcionario.js'
import Turma from '../models/Turma.js'
import Matricula from '../models/Matricula.js'
import Aluno from '../models/Aluno.js'
import Nota from '../models/Nota.js'
import { categoria } from '../helpers/permissao.js'

class DiarioController {

    // Verifica se o professor logado é dono do diário (usa funcionarioId do token)
    #verificarProfessor = async (funcionarioId, diario_id) => {
        const diario = await Diario.findOne({ where: { id: diario_id } })
        return !!(diario && diario.funcionario_id === funcionarioId)
    }

    // GET /get/:id
    get = async (req, res) => {
        const id = req.params.id
        const { userId, funcionarioId, categoria: cat } = req
        try {
            const diario = await Diario.findOne({
                where: { id },
                include: [
                    { model: Turma,       as: 'turma'    },
                    { model: Funcionario, as: 'professor' },
                ]
            })
            if (!diario) return res.status(404).json({ message: 'Diário não encontrado' })

            if (Number(cat) === categoria.PROFESSOR) {
                if (diario.funcionario_id !== funcionarioId)
                    return res.status(403).json({ message: 'Acesso negado a este diário' })
            }

            if (Number(cat) === categoria.ALUNO) {
                const aluno = await Aluno.findOne({ where: { usuario_id: userId } })
                const matricula = aluno && await Matricula.findOne({ where: { aluno_id: aluno.id, turma_id: diario.turma_id } })
                if (!matricula) return res.status(403).json({ message: 'Você não está matriculado nesta turma' })
            }

            return res.status(200).json(diario)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // PUT /editar — secretaria apenas
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

    // GET /notas/:id
    notas = async (req, res) => {
        const diario_id = req.params.id
        const { userId, categoria: cat } = req
        try {
            const diario = await Diario.findOne({ where: { id: diario_id } })
            if (!diario) return res.status(404).json({ message: 'Diário não encontrado' })

            if (Number(cat) === categoria.ALUNO) {
                const aluno = await Aluno.findOne({ where: { usuario_id: userId } })
                if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' })
                const matricula = await Matricula.findOne({
                    where: { aluno_id: aluno.id, turma_id: diario.turma_id },
                    include: [{ model: Aluno, as: 'aluno' }],
                })
                if (!matricula) return res.status(403).json({ message: 'Você não está matriculado nesta turma' })
                const notas = await Nota.findAll({ where: { diario_id, matricula_id: matricula.id } })
                return res.status(200).json([{ ...matricula.toJSON(), notas }])
            }

            const [matriculas, notas] = await Promise.all([
                Matricula.findAll({
                    where: { turma_id: diario.turma_id, status: 1 },
                    include: [{ model: Aluno, as: 'aluno' }],
                    order: [[{ model: Aluno, as: 'aluno' }, 'nome', 'ASC']]
                }),
                Nota.findAll({ where: { diario_id } })
            ])

            return res.status(200).json(
                matriculas.map(m => ({ ...m.toJSON(), notas: notas.filter(n => n.matricula_id === m.id) }))
            )
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // POST /nota
    salvarNota = async (req, res) => {
        const { matricula_id, diario_id, descricao, valor, semestre } = req.body
        const { funcionarioId, categoria: cat } = req
        try {
            if (Number(cat) === categoria.PROFESSOR) {
                const ok = await this.#verificarProfessor(funcionarioId, diario_id)
                if (!ok) return res.status(403).json({ message: 'Acesso negado a este diário' })
            }
            const nota = await Nota.create({ matricula_id, diario_id, descricao, valor, semestre })
            return res.status(200).json(nota)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // PUT /nota
    editarNota = async (req, res) => {
        const { id, descricao, valor, semestre } = req.body
        const { funcionarioId, categoria: cat } = req
        try {
            if (Number(cat) === categoria.PROFESSOR) {
                const nota = await Nota.findOne({ where: { id } })
                if (!nota) return res.status(404).json({ message: 'Nota não encontrada' })
                const ok = await this.#verificarProfessor(funcionarioId, nota.diario_id)
                if (!ok) return res.status(403).json({ message: 'Acesso negado a este diário' })
            }
            await Nota.update({ descricao, valor, semestre }, { where: { id } })
            const nota = await Nota.findOne({ where: { id } })
            return res.status(200).json(nota)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // DELETE /nota/:id
    deletarNota = async (req, res) => {
        const { id } = req.params
        const { funcionarioId, categoria: cat } = req
        try {
            if (Number(cat) === categoria.PROFESSOR) {
                const nota = await Nota.findOne({ where: { id } })
                if (!nota) return res.status(404).json({ message: 'Nota não encontrada' })
                const ok = await this.#verificarProfessor(funcionarioId, nota.diario_id)
                if (!ok) return res.status(403).json({ message: 'Acesso negado a este diário' })
            }
            await Nota.destroy({ where: { id } })
            return res.status(200).json({ message: 'Nota removida com sucesso' })
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // GET /meus
    meus = async (req, res) => {
        const { userId, funcionarioId, categoria: cat } = req
        try {
            if (Number(cat) === categoria.PROFESSOR) {
                const diarios = await Diario.findAll({
                    where: { funcionario_id: funcionarioId },
                    include: [
                        { model: Turma,       as: 'turma'    },
                        { model: Funcionario, as: 'professor' },
                    ]
                })
                return res.status(200).json(diarios)
            }

            if (Number(cat) === categoria.ALUNO) {
                const aluno = await Aluno.findOne({ where: { usuario_id: userId } })
                if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' })
                const matriculas = await Matricula.findAll({ where: { aluno_id: aluno.id, status: 1 } })
                const turmaIds   = [...new Set(matriculas.map(m => m.turma_id))]
                const diarios    = await Diario.findAll({
                    where: { turma_id: turmaIds },
                    include: [
                        { model: Turma,       as: 'turma'    },
                        { model: Funcionario, as: 'professor' },
                    ]
                })
                return res.status(200).json(diarios)
            }

            return res.status(403).json({ message: 'Acesso negado' })
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

    // GET /boletim — aluno: todas as suas notas agrupadas por turma → diário
    boletim = async (req, res) => {
        const { userId } = req
        try {
            const aluno = await Aluno.findOne({ where: { usuario_id: userId } })
            if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' })

            const matriculas = await Matricula.findAll({
                where: { aluno_id: aluno.id, status: 1 },
                include: [{ model: Turma, as: 'turma' }],
            })

            const resultado = await Promise.all(matriculas.map(async m => {
                const diarios = await Diario.findAll({
                    where: { turma_id: m.turma_id },
                    include: [{ model: Funcionario, as: 'professor' }],
                })
                const diariosComNotas = await Promise.all(diarios.map(async d => {
                    const notas = await Nota.findAll({ where: { diario_id: d.id, matricula_id: m.id } })
                    return { ...d.toJSON(), notas }
                }))
                return { ...m.toJSON(), diarios: diariosComNotas }
            }))

            return res.status(200).json(resultado)
        } catch(err) {
            return res.status(400).json({ message: err.message })
        }
    }

}

export default new DiarioController()
