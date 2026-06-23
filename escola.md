# EscolaPlus — Documentação do Sistema

Sistema de Gestão Escolar (SGE) fullstack para pequenas e médias escolas. Gerencia alunos, turmas, matrículas, professores, diários de classe, notas e relatórios em PDF.

---

## Arquitetura

Monorepo com duas aplicações independentes:

```
escolaplus/
├── escolaplus-back/    # API REST (Node.js + Express + Sequelize)
└── escolaplus-front/   # SPA (Vue 3 + Vite + Bootstrap 5)
```

---

## Stack Tecnológica

### Backend (`escolaplus-back/`)
| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | ^20.19 / >=22.12 | Runtime |
| Express | ^5.2.1 | Framework HTTP |
| Sequelize | ^6.37.7 | ORM |
| MySQL / mysql2 | ^3.15.3 | Banco de dados |
| jsonwebtoken | ^9.0.3 | Autenticação JWT |
| bcrypt | ^6.0.0 | Hash de senhas |
| Nodemailer | ^7.0.11 | Envio de emails |
| Puppeteer | ^24.33.0 | Geração de PDF (headless Chrome) |
| dotenv | ^17.2.3 | Variáveis de ambiente |
| cors | ^2.8.5 | CORS |

### Frontend (`escolaplus-front/`)
| Tecnologia | Versão | Papel |
|---|---|---|
| Vue 3 | ^3.5.25 | Framework UI |
| Vite | ^7.2.4 | Build tool |
| Vue Router | ^4.6.3 | Roteamento SPA |
| Bootstrap | ^5.3.8 | CSS framework |
| Font Awesome | (SVG core + Vue) | Ícones |
| vue-the-mask | ^0.11.1 | Máscaras de input (CPF, telefone, CEP) |

---

## Configuração de Ambiente

### Backend (`.env`)
```env
PORT=3002
NODE_ENV=development

# Banco de Dados
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=escolaplus

# JWT
JWT_SECRET=troque_por_uma_string_segura_e_aleatoria
JWT_EXPIRE=3h

# Email (Nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_USER=seu@email.com
EMAIL_PASS=sua_senha
EMAIL_PORT=465
EMAIL_SECURE=true

LOG_LEVEL=debug
```

### Frontend (`.env`)
```env
VITE_API_BASE=http://localhost:3002
# Produção: VITE_API_BASE=https://seu-dominio.com/api-escolaplus
```

---

## Modelos do Banco de Dados

### Entidades Principais

**Usuario** — Conta de acesso ao sistema
- `id` (UUID), `username`, `password` (bcrypt hash), `categoria` (1/2/3), `status` (0=primeiro acesso, 1=ativo), `codigo`

**Aluno** — Dados do estudante
- `id`, `nome`, `nascimento`, `cpf`, `email`, `foto` (base64/TEXT)
- Endereço: `cep`, `endereco`, `numero`, `bairro`, `cidade`, `estado`
- Responsáveis: `pai`, `mae`, `cpf_pai`, `cpf_mae`, `telefone`, `telefone2`
- Saúde: `obs`, `saude`, `hospital`, `alergia`
- `status` (ativo/inativo)
- FK: `usuario_id` → Usuario

**Funcionario** — Professores e demais funcionários
- `id`, `nome`, `cpf`, `email`, `telefone`, `foto` (base64/TEXT), `status`
- FK: `usuario_id` → Usuario

**Calendario** — Ano letivo
- `id`, `descricao`, `ano`, `status` (apenas 1 ativo por vez)
- `media` — nota mínima para aprovação
- `etapas` — número de etapas por semestre
- `notas` — número de avaliações por etapa

**Turma** — Série/classe
- `id`, `descricao`, `sigla`, `status`, `ordem`
- FK: `calendario_id` → Calendario

**Matricula** — Vínculo aluno ↔ turma
- `id`, `matricula` (código), `status`, `resultado`
- `responsavel`, `cpf`, `telefone` — dados do responsável financeiro
- FK: `aluno_id` → Aluno, `turma_id` → Turma

**Diario** — Diário de classe (disciplina por turma)
- `id`, `descricao` (nome da disciplina), `status`
- FK: `funcionario_id` → Funcionario, `turma_id` → Turma

**Nota** — Registro de avaliação
- `id`, `descricao` (ex: "N1", "N2", "Recuperação"), `valor`, `semestre`, `ordem`
- FK: `matricula_id` → Matricula, `diario_id` → Diario

**Escola** — Dados da instituição
- `id`, `nome`, `endereco`, `bairro`, `cidade`, `estado`, `email`, `telefone`, `instagram`, `inep`, `logo`

### Relacionamentos
```
Aluno 1──N Matricula N──1 Turma N──1 Calendario
Matricula 1──N Nota N──1 Diario N──1 Turma
Diario N──1 Funcionario
Aluno 1──1 Usuario
Funcionario 1──1 Usuario
```

---

## API REST — Rotas

Todas as rotas são prefixadas com a base configurada em `VITE_API_BASE`.  
Autenticação via header `Authorization: Bearer <token>`.  
Middleware `allow(categorias[])` controla acesso por perfil.

### Autenticação (`/usuario`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/usuario/login` | Público | Login, retorna JWT |
| POST | `/usuario/senha` | Autenticado | Alterar senha (muda status para 1) |
| GET | `/usuario/acesso/:id` | Secretaria | Reenviar senha por email ao funcionário |

### Alunos (`/aluno`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/aluno/salvar` | Secretaria | Cadastrar aluno |
| GET | `/aluno/listar/:busca` | Secretaria | Listar com paginação (30/página) |
| POST | `/aluno/buscar` | Secretaria | Buscar por nome |
| GET | `/aluno/get/:id` | Secretaria | Detalhes + matrículas |
| POST | `/aluno/matricular` | Secretaria | Matricular em turma (gera notas automaticamente) |
| PUT | `/aluno/editar` | Secretaria | Editar dados |
| PUT | `/aluno/transferir` | Secretaria | Transferir para outra turma |
| GET | `/aluno/eu` | Aluno | Consultar próprio perfil |

### Turmas (`/turma`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/turma/listar/:id` | Secretaria/Professor | Turmas de um calendário |
| GET | `/turma/get/:id` | Secretaria/Professor | Detalhes da turma |
| GET | `/turma/diarios/:id` | Todos | Diários da turma |
| GET | `/turma/matriculas/:id` | Secretaria/Professor | Matrículas da turma |

### Diários (`/diario`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/diario/criar` | Professor | Criar novo diário |
| GET | `/diario/listar` | Secretaria | Listar todos os diários |
| GET | `/diario/get/:id` | Todos | Detalhes do diário |
| GET | `/diario/meus` | Professor/Aluno | Diários do professor logado / turmas do aluno |
| PUT | `/diario/editar` | Professor | Editar diário |
| GET | `/diario/notas/:id` | Professor/Aluno | Notas do diário (filtrado por acesso) |
| POST | `/diario/nota` | Professor | Lançar nota |
| PUT | `/diario/nota` | Professor | Editar nota |
| DELETE | `/diario/nota/:id` | Professor | Deletar nota |
| GET | `/diario/boletim` | Aluno | Boletim completo (todas as notas) |

### Funcionários (`/funcionario`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/funcionario/salvar` | Secretaria | Cadastrar funcionário |
| GET | `/funcionario/listar` | Secretaria | Listar funcionários |
| GET | `/funcionario/get/:id` | Secretaria | Detalhes do funcionário |
| PUT | `/funcionario/editar` | Secretaria | Editar funcionário |
| POST | `/funcionario/gerar-usuario` | Secretaria | Gerar login para funcionário |
| GET | `/funcionario/eu` | Professor | Consultar próprio perfil |

### Calendário (`/calendario`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/calendario/salvar` | Secretaria | Criar ano letivo |
| GET | `/calendario/ativo` | Todos | Retorna o calendário ativo (status=1) |
| GET | `/calendario/listar` | Secretaria | Listar todos os anos letivos |

### Impressão (`/impressao`)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/impressao/ficha/:id` | Secretaria | Gera PDF da ficha do aluno via Puppeteer |

---

## Controle de Acesso

### Categorias de Usuário
| Categoria | Perfil | Permissões |
|---|---|---|
| `1` | Secretaria/Admin | Acesso total: CRUD de alunos, turmas, funcionários, calendário, matrículas |
| `2` | Professor | Criar/editar diários próprios, lançar notas, ver turmas e matrículas |
| `3` | Aluno | Visualizar próprias notas, boletim e dados pessoais |

### Fluxo de Autenticação
1. `POST /usuario/login` → retorna `{ token: "..." }`
2. Frontend armazena token e faz decode Base64 do payload para extrair `{ id, categoria, nome }`
3. Todas as requisições enviam `Authorization: Bearer <token>`
4. Backend valida JWT e checa categoria via middleware `allow([1, 2])` (exemplo: rotas de professor)
5. Funcionário novo tem `status=0` → ao fazer login pela primeira vez é redirecionado para trocar senha → status muda para `1`

---

## Estrutura do Frontend

### Rotas (Vue Router)
```
/login                      — Tela de autenticação
/usuario/senha              — Alterar senha

# Secretaria
/aluno/principal            — Lista de alunos (busca + paginação)
/aluno/cadastrar            — Formulário de novo aluno
/aluno/editar/:id           — Editar aluno
/aluno/ficha/:id            — Ficha: dados + matrículas + ações
/aluno/foto/:id             — Upload/visualização de foto
/aluno/imprimir/:id         — Preview/geração de PDF

/funcionario/principal      — Lista de funcionários
/funcionario/cadastrar      — Cadastrar funcionário
/funcionario/ficha/:id      — Ficha do funcionário

/turma/principal            — Gerenciamento de turmas
/calendario/principal       — Gerenciamento de anos letivos

# Professor
/professor/principal        — Dashboard do professor (meus diários)
/diario/ficha/:id           — Lançamento de notas da disciplina
```

### Componentes Reutilizáveis
- `Menu.vue` — Navegação lateral (adapta itens por categoria)
- `NavAdmin.vue` — Barra superior com nome do usuário e logout
- `Matricula.vue` — Modal de matrícula de aluno em turma
- `AlertMessage.vue` — Componente de alertas/notificações
- `Conteudo.vue` — Container de conteúdo das páginas
- `Perfil.vue` — Card de exibição de perfil
- `NotFound.vue` — Página 404

### Serviços (`src/services/`)
- `http.js` — Instância Axios configurada com base URL e interceptors de token
- `auth.js` — Funções de autenticação (login, logout, verificar token)
- `token.js` — Decode do JWT e acesso às informações do usuário logado

---

## Funcionalidades de Negócio

### Matrícula e Geração de Notas
Ao matricular um aluno em uma turma, o sistema gera automaticamente todos os registros de `Nota` baseados na configuração do `Calendario` ativo:
- Para cada `Diario` da turma × `etapas` × `notas` → cria registro de nota vazio
- A estrutura inclui notas de semestre, etapa, avaliação (N1, N2...), recuperação e prova final
- Transferência de turma: usa **transação** para deletar notas antigas e recriar na turma nova

### Calendário Acadêmico
Define a estrutura de avaliação para o ano letivo:
- `etapas`: quantas etapas por semestre (ex: 2 bimestres = 2 etapas)
- `notas`: quantas avaliações por etapa (ex: 2 provas = 2 notas)
- `media`: nota mínima para aprovação (ex: 6.0)
- Apenas **um** calendário pode estar ativo (`status=1`) por vez

### Diários de Classe
- Professor cria diário associando-se a uma turma e nomeando a disciplina
- Ao abrir o diário, vê a lista de alunos matriculados com campos de nota
- Notas são salvas individualmente por aluno
- Aluno só enxerga suas próprias notas

### Geração de PDF
- Rota `/impressao/ficha/:id` usa Puppeteer (headless Chrome) para abrir uma view HTML e gerar PDF
- Inclui: dados pessoais do aluno, endereço, responsáveis, foto, turma atual

### Email
- Ao criar um funcionário com usuário, o sistema envia a senha temporária por email via Nodemailer
- Secretaria pode reenviar o email de acesso (`GET /usuario/acesso/:id`)
- Configuração via variáveis `EMAIL_*` no `.env`

---

## Convenções do Projeto

### Backend
- Controllers ficam em `escolaplus-back/controllers/` (ex: `alunoController.js`)
- Rotas em `escolaplus-back/routes/` importam os controllers
- Models Sequelize em `escolaplus-back/models/` com associações definidas no próprio arquivo
- Migrations em `escolaplus-back/migrations/`
- Helpers em `escolaplus-back/helpers/` (ex: `auth.js`, `email.js`, `pdf.js`)
- Servidor principal: `escolaplus-back/index.js`

### Frontend
- Views em `escolaplus-front/src/views/` (subdivididas por perfil: `admin/`, `professor/`, `aluno/`)
- Componentes globais em `escolaplus-front/src/components/`
- Serviços HTTP em `escolaplus-front/src/services/`
- Rotas definidas em `escolaplus-front/src/router/index.js`
- Assets estáticos em `escolaplus-front/src/assets/`

### Padrões de Código
- IDs são UUID (gerados pelo Sequelize)
- Respostas de erro seguem `{ message: "..." }` com status HTTP adequado
- Fotos são armazenadas como base64 diretamente no banco (campo TEXT)
- Paginação de alunos: 30 por página com offset via parâmetro de rota
