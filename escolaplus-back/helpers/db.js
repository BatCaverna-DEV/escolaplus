import Usuario from '../models/Usuario.js';
import Funcionario from '../models/Funcionario.js';
import Calendario from '../models/Calendario.js';
import Aluno from '../models/Aluno.js';
import Turma from '../models/Turma.js';
import Diario from '../models/Diario.js'
import Matricula from '../models/Matricula.js'
import Nota from '../models/Nota.js';
import Escola from '../models/Escola.js'

await Usuario.sync()
await Funcionario.sync()
await Calendario.sync()
await Aluno.sync()
await Turma.sync()
await Diario.sync()
await Matricula.sync()
await Nota.sync()
await Escola.sync()