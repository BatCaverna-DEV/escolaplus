import mysql  from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: '', database: 'escolaplus',
  charset: 'utf8mb4',
})

// ── Funcionários sem usuário ──────────────────────────────────────
const [funcionarios] = await conn.execute(
  `SELECT id, nome FROM funcionarios WHERE usuario_id IS NULL ORDER BY nome`
)

// ── Usernames já existentes ───────────────────────────────────────
const [users] = await conn.execute(`SELECT username FROM usuarios`)
const usados  = new Set(users.map(u => u.username))

// ── Helpers ───────────────────────────────────────────────────────
const PREPOSICOES = new Set(['de','da','do','dos','das','e'])

function semAcento(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function gerarUsername(nome) {
  const partes = nome.trim().split(/\s+/).filter(p => !PREPOSICOES.has(p.toLowerCase()))
  const primeiro = semAcento(partes[0])
  const ultimo   = semAcento(partes[partes.length - 1])
  return `${primeiro}.${ultimo}`
}

function usernameUnico(base) {
  let username = base, n = 2
  while (usados.has(username)) username = `${base}${n++}`
  usados.add(username)
  return username
}

// ── Criar usuários e vincular funcionários ────────────────────────
const salt = await bcrypt.genSalt(10)

for (const f of funcionarios) {
  const base     = gerarUsername(f.nome)
  const username = usernameUnico(base)
  const senha    = Math.floor(100000 + Math.random() * 900000).toString()
  const hash     = await bcrypt.hash(senha, salt)
  const userId   = randomUUID()

  await conn.execute(
    `INSERT INTO usuarios (id, username, categoria, status, password, createdAt, updatedAt)
     VALUES (?, ?, 2, 0, ?, NOW(), NOW())`,
    [userId, username, hash]
  )

  await conn.execute(
    `UPDATE funcionarios SET usuario_id = ? WHERE id = ?`,
    [userId, f.id]
  )

  console.log(`✔  ${f.nome.padEnd(45)} → ${username.padEnd(25)} senha: ${senha}`)
}

await conn.end()
console.log(`\n${funcionarios.length} usuário(s) criado(s).`)
