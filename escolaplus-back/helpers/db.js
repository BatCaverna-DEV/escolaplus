import Usuario from '../models/Usuario.js';
import Funcionario from '../models/Funcionario.js';
import Calendario from '../models/Calendario.js';
import Aluno from '../models/Aluno.js';

await Usuario.sync()
await Funcionario.sync()
await Calendario.sync()
await Aluno.sync()