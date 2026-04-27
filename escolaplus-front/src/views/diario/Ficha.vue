<script setup>
import { apiFetch } from "@/services/http.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { statusPadrao } from "@/services/format.js";
import AlertMessage from "@/components/AlertMessage.vue";
import { getUser } from "@/services/token.js";

const usuario      = getUser()
const ehSecretaria = Number(usuario?.categoria) === 1

const route = useRoute();
const id    = route.params.id;

// ── Estado principal ──────────────────────────────────────────────
const diario       = ref({})
const funcionarios = ref([])
const carregando   = ref(false)
const alerta       = ref({ msg: '', tipo: 'success' })

// ── Edição do diário ──────────────────────────────────────────────
const editando       = ref(false)
const salvandoDiario = ref(false)
const form = ref({ id: '', descricao: '', status: 1, funcionario_id: '' })

function iniciarEdicao() {
  form.value = {
    id:             diario.value.id,
    descricao:      diario.value.descricao,
    status:         diario.value.status,
    funcionario_id: diario.value.funcionario_id,
  }
  editando.value = true
}

async function salvarDiario() {
  salvandoDiario.value = true
  try {
    const r = await apiFetch('/diario/editar', { method: 'PUT', body: form.value })
    if (r.ok) {
      diario.value   = await r.json()
      editando.value = false
      flash('Diário atualizado com sucesso!', 'success')
    } else {
      const msg = await r.json()
      flash(msg.message, 'danger')
    }
  } finally {
    salvandoDiario.value = false
  }
}

// ── Formatação de notas: "07,50" ↔ 7.5 ───────────────────────────
function formatarNota(valor) {
  if (valor === null || valor === '' || valor === undefined) return ''
  const n = parseFloat(valor)
  if (isNaN(n)) return ''
  return n.toFixed(2).replace('.', ',')  // "7,50" ou "10,00"
}

function parsearNota(str) {
  if (!str) return null
  return parseFloat(String(str).replace(',', '.'))
}

// ── Notas ─────────────────────────────────────────────────────────
const matriculas      = ref([])
const carregandoNotas = ref(false)

async function carregarNotas() {
  carregandoNotas.value = true
  try {
    const r    = await apiFetch(`/diario/notas/${id}`)
    if (!r.ok) return
    const lista = await r.json()
    if (!Array.isArray(lista)) return
    matriculas.value = lista.map(m => ({
      ...m,
      notas: m.notas.map(n => ({
        ...n,
        _display: formatarNota(n.valor),
        _salvando: false,
      })),
    }))
  } finally {
    carregandoNotas.value = false
  }
}

// Salva ao tirar foco do campo de valor
async function onBlurNota(nota) {
  const vazio = nota._display === '' || nota._display === null || nota._display === undefined
  const novo  = vazio ? null : parsearNota(nota._display)

  // Valor inválido (não vazio, mas fora do intervalo 0–10)
  if (!vazio && (isNaN(novo) || novo < 0 || novo > 10)) {
    nota._display = formatarNota(nota.valor)
    return
  }

  // Sem alteração
  const semMudanca = vazio
    ? (nota.valor === null || nota.valor === '')
    : novo === parseFloat(nota.valor)
  if (semMudanca) {
    nota._display = formatarNota(nota.valor)
    return
  }

  nota._salvando = true
  nota.valor     = novo
  try {
    const r = await apiFetch('/diario/nota', {
      method: 'PUT',
      body: { id: nota.id, descricao: nota.descricao, valor: novo, semestre: nota.semestre },
    })
    if (!r.ok) {
      const msg = await r.json()
      flash(msg.message, 'danger')
    }
  } finally {
    nota._salvando   = false
    nota._display    = formatarNota(nota.valor)
  }
}


// ── Média ─────────────────────────────────────────────────────────
function media(notas) {
  const validas = notas.filter(n => n.valor !== null && n.valor !== '')
  if (!validas.length) return null
  return (validas.reduce((s, n) => s + parseFloat(n.valor), 0) / validas.length).toFixed(1)
}

function classeMedia(v) {
  if (v === null) return 'ep-media-vazio'
  return parseFloat(v) >= 7 ? 'ep-media-ok' : 'ep-media-baixa'
}

// ── Helper ────────────────────────────────────────────────────────
function flash(msg, tipo) {
  alerta.value = { msg, tipo }
  setTimeout(() => { alerta.value.msg = '' }, 4000)
}

// ── Montagem ──────────────────────────────────────────────────────
onMounted(async () => {
  carregando.value = true
  try {
    const r = await apiFetch(`/diario/get/${id}`)
    if (r.ok) diario.value = await r.json()
  } finally {
    carregando.value = false
  }

  // carrega funcionários para o select de edição (falha silenciosa)
  apiFetch('/funcionario/listar').then(r => {
    if (r.ok) r.json().then(lista => { funcionarios.value = lista })
  }).catch(() => {})

  await carregarNotas()
})
</script>

<template>
  <div>
    <!-- Spinner inicial -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <template v-if="!carregando">

      <!-- ── Cabeçalho ── -->
      <div class="page-header">
        <div>
          <h4 class="page-title">
            <font-awesome-icon icon="fa-solid fa-book-open" class="me-2 text-success" />
            Diário — {{ diario.descricao }}
          </h4>
          <p class="text-muted small mb-0">{{ diario.turma?.descricao }}</p>
        </div>
        <div class="page-actions">
          <template v-if="ehSecretaria && !editando">
            <button class="btn btn-sm btn-primary" @click="iniciarEdicao">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" class="me-1" />Editar
            </button>
          </template>
          <template v-else-if="ehSecretaria && editando">
            <button class="btn btn-sm btn-success" @click="salvarDiario" :disabled="salvandoDiario">
              <span v-if="salvandoDiario">
                <span class="spinner-border spinner-border-sm me-1"></span>Salvando…
              </span>
              <span v-else>
                <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />Salvar
              </span>
            </button>
            <button class="btn btn-sm btn-outline-secondary" @click="editando = false">Cancelar</button>
          </template>
          <RouterLink :to="'/turma/ficha/' + diario.turma_id" class="btn btn-sm btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
          </RouterLink>
        </div>
      </div>

      <AlertMessage :msg="alerta.msg" :tipo="alerta.tipo" />

      <!-- ── Dados do diário ── -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-circle-info" class="me-2 text-success" />Dados do Diário
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-6">
              <label class="form-label small fw-semibold text-muted">Descrição</label>
              <input v-if="editando" v-model="form.descricao" type="text" class="form-control" />
              <input v-else :value="diario.descricao" type="text" class="form-control" disabled />
            </div>
            <div class="col-sm-4">
              <label class="form-label small fw-semibold text-muted">Professor</label>
              <select v-if="editando" v-model="form.funcionario_id" class="form-select">
                <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
              </select>
              <input v-else :value="diario.professor?.nome" type="text" class="form-control" disabled />
            </div>
            <div class="col-sm-2">
              <label class="form-label small fw-semibold text-muted">Status</label>
              <select v-if="editando" v-model="form.status" class="form-select">
                <option :value="1">Ativo</option>
                <option :value="0">Inativo</option>
              </select>
              <div v-else class="mt-2">
                <span class="badge rounded-pill px-2 py-1"
                  :class="diario.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusPadrao(diario.status) }}
                </span>
              </div>
            </div>
            <div class="col-sm-4">
              <label class="form-label small fw-semibold text-muted">Turma</label>
              <input :value="diario.turma?.descricao" type="text" class="form-control" disabled />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Planilha de Notas ── -->
      <div class="card border-0 shadow-sm">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-star-half-stroke" class="me-2 text-success" />
          Notas dos Alunos
          <span class="badge bg-secondary ms-2 rounded-pill">{{ matriculas.length }}</span>
        </div>

        <div class="card-body p-0">

          <div v-if="carregandoNotas" class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
            <p class="text-muted mt-2 small">Carregando alunos e notas…</p>
          </div>

          <div v-else-if="matriculas.length === 0" class="text-center py-5 text-muted">
            <font-awesome-icon icon="fa-solid fa-inbox" class="fs-2 mb-2 d-block mx-auto opacity-25" />
            <p class="small">Nenhum aluno matriculado nesta turma</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-bordered align-middle ep-planilha mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ep-th-aluno">Aluno</th>
                  <th>Notas</th>
                  <th class="ep-th-media text-center">Média</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in matriculas" :key="m.id">

                  <!-- Coluna: aluno -->
                  <td class="ep-col-aluno">
                    <div class="d-flex align-items-center gap-2">
                      <img :src="m.aluno?.foto" class="avatar" alt="" />
                      <div>
                        <div class="fw-semibold lh-sm">{{ m.aluno?.nome }}</div>
                        <div class="text-muted" style="font-size:.68rem;">Mat. {{ m.matricula }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Coluna: notas -->
                  <td class="ep-col-notas">
                    <div class="ep-notas-linha">

                      <!-- Nota existente: descrição fixa + valor editável ao perder foco -->
                      <div v-for="nota in m.notas" :key="nota.id" class="ep-nota-card">
                        <div class="ep-nota-info">
                          <span class="ep-nota-desc-texto">{{ nota.descricao }}</span>
                          <span class="badge rounded-pill ep-badge-sem">{{ nota.semestre }}º</span>
                        </div>
                        <div class="ep-nota-valor-wrap">
                          <input
                            v-model="nota._display"
                            v-mask="['#,##', '##,##']"
                            type="text"
                            inputmode="numeric"
                            class="form-control form-control-sm text-center ep-nota-val-input"
                            :class="{
                              'ep-nota-ok':     parsearNota(nota._display) >= 7,
                              'ep-nota-fail':   parsearNota(nota._display) < 7 && nota._display !== '',
                              'ep-nota-saving': nota._salvando,
                            }"
                            @blur="onBlurNota(nota)"
                          />
                          <span v-if="nota._salvando" class="ep-nota-spinner">
                            <span class="spinner-border spinner-border-sm text-success"></span>
                          </span>
                        </div>
                      </div>

                      <!-- Sem notas -->
                      <span v-if="m.notas.length === 0" class="text-muted" style="font-size:.75rem;">
                        Nenhuma nota lançada
                      </span>

                    </div>
                  </td>

                  <!-- Coluna: média -->
                  <td class="text-center ep-col-media">
                    <div :class="['ep-media', classeMedia(media(m.notas))]">
                      <span class="ep-media-label">Média</span>
                      <span class="ep-media-valor">{{ media(m.notas) ?? '—' }}</span>
                    </div>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
/* ── Planilha ── */
.ep-planilha {
  font-size: .82rem;
}
.ep-planilha thead th {
  font-size: .68rem;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #6c757d;
  white-space: nowrap;
}

.ep-th-aluno { width: 210px; white-space: nowrap; }
.ep-th-media { width: 90px; }

.ep-col-aluno { vertical-align: middle !important; white-space: nowrap; }
.ep-col-notas { vertical-align: top !important; padding: .5rem .75rem !important; }
.ep-col-media { vertical-align: middle !important; }

/* ── Linha de notas (sem quebra, scroll horizontal) ── */
.ep-notas-linha {
  display: flex;
  flex-wrap: nowrap;
  gap: .5rem;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 2px;
}

/* ── Cartão de nota ── */
.ep-nota-card {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: .375rem;
  padding: .3rem .4rem;
  width: 100px;
  flex-shrink: 0;
}


/* Linha descrição + semestre */
.ep-nota-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .25rem;
  margin-bottom: .3rem;
}

.ep-nota-desc-texto {
  font-size: .68rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 52px;
}

.ep-badge-sem {
  font-size: .6rem;
  background: #e2e8f0;
  color: #475569;
  flex-shrink: 0;
}

/* Campo de valor */
.ep-nota-valor-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.ep-nota-val-input {
  font-size: .78rem !important;
  font-weight: 700;
  letter-spacing: .03em;
  padding-left: .2rem !important;
  padding-right: .2rem !important;
  transition: border-color .15s, box-shadow .15s;
  width: 100% !important;
}

.ep-nota-ok   { border-color: #22c55e !important; color: #15803d; }
.ep-nota-fail { border-color: #ef4444 !important; color: #b91c1c; }
.ep-nota-saving { opacity: .6; }

.ep-nota-spinner {
  position: absolute;
  right: .3rem;
  font-size: .6rem;
}


/* ── Média ── */
.ep-media {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: .25rem .6rem;
  border-radius: .5rem;
  text-align: center;
}
.ep-media-label {
  font-size: .58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  opacity: .7;
}
.ep-media-valor { font-size: 1rem; font-weight: 800; line-height: 1.2; }

.ep-media-ok    { background: #d1fae5; color: #065f46; }
.ep-media-baixa { background: #fee2e2; color: #991b1b; }
.ep-media-vazio { background: #f1f5f9; color: #94a3b8; }
</style>
