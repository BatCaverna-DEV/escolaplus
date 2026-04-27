<script setup>
import { apiFetch } from "@/services/http.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { categoriaFuncionario, statusPadrao } from "@/services/format.js";
import { getUser } from "@/services/token.js";
import AlertMessage from "@/components/AlertMessage.vue";

const route       = useRoute();
const funcionario = ref({});
const salvando    = ref(false);
const user        = getUser()
const msg         = ref({ texto: '', tipo: 'warning' })
const aba         = ref('dados')

onMounted(async () => { await carregar() })

async function carregar() {
  try {
    const resposta    = await apiFetch("/funcionario/get/" + route.params.id);
    funcionario.value = await resposta.json();
  } catch (err) {
    alert(err.message)
  }
}

async function resetarSenha() {
  try {
    salvando.value = true
    const resposta = await apiFetch('/usuario/acesso/' + funcionario.value.usuario_id)
    const dados    = await resposta.json()
    msg.value      = { texto: dados.message, tipo: resposta.ok ? 'success' : 'warning' }
    await carregar()
  } catch (err) {
    msg.value = { texto: err.message, tipo: 'danger' }
  } finally {
    salvando.value = false
  }
}

// ── Aba de Diários ────────────────────────────────────────────────
const diarios        = ref([])
const carregandoDiarios = ref(false)

async function carregarDiarios() {
  if (diarios.value.length) return
  carregandoDiarios.value = true
  try {
    const r = await apiFetch(`/diario/listar?funcionario_id=${route.params.id}`)
    if (r.ok) diarios.value = await r.json()
  } finally {
    carregandoDiarios.value = false
  }
}

function abrirAba(nome) {
  aba.value = nome
  if (nome === 'diarios') carregarDiarios()
}

// ── Modal novo diário ─────────────────────────────────────────────
const modalAberto  = ref(false)
const turmas       = ref([])
const salvandoDiario = ref(false)
const formDiario   = ref({ descricao: '', turma_id: '', status: 1 })

async function abrirModal() {
  formDiario.value = { descricao: '', turma_id: '', status: 1 }
  modalAberto.value = true
  if (turmas.value.length) return
  // carrega turmas via calendário ativo
  const r1 = await apiFetch('/calendario/ativo')
  if (r1.ok) {
    const cal = await r1.json()
    const r2  = await apiFetch(`/turma/listar/${cal.id}`)
    if (r2.ok) turmas.value = await r2.json()
  }
}

async function criarDiario() {
  salvandoDiario.value = true
  try {
    const r = await apiFetch('/diario/criar', {
      method: 'POST',
      body: { ...formDiario.value, funcionario_id: route.params.id },
    })
    if (r.ok) {
      const novo = await r.json()
      diarios.value.push(novo)
      diarios.value.sort((a, b) => a.descricao.localeCompare(b.descricao))
      modalAberto.value = false
    } else {
      const erro = await r.json()
      alert(erro.message)
    }
  } finally {
    salvandoDiario.value = false
  }
}
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2 text-success" />Ficha do Funcionário
      </h4>
      <div class="page-actions">
        <button v-if="!salvando && funcionario.usuario_id !== user.usuario_id"
          @click="resetarSenha" class="btn btn-sm btn-warning">
          <font-awesome-icon icon="fa-solid fa-key" class="me-1" />Resetar Acesso
        </button>
        <RouterLink :to="'/funcionario/editar/' + funcionario.id" class="btn btn-sm btn-primary">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="me-1" />Editar
        </RouterLink>
        <RouterLink to="/funcionario/principal" class="btn btn-sm btn-outline-secondary">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Spinner reset -->
    <div v-if="salvando" class="text-center py-4">
      <div class="spinner-border text-success" role="status"></div>
      <p class="text-muted mt-2 small">Criando acesso para {{ funcionario.nome }}…</p>
    </div>

    <AlertMessage :msg="msg.texto" :tipo="msg.tipo" />

    <!-- Card principal -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body">
        <div class="row g-3 align-items-start">

          <!-- Foto -->
          <div class="col-sm-2 text-center">
            <img :src="funcionario.foto" class="rounded-3 w-100" style="max-width:110px; aspect-ratio:3/4; object-fit:cover;" alt="Foto">
            <div class="mt-2">
              <RouterLink :to="'/funcionario/foto/' + funcionario.id" class="btn btn-sm btn-outline-secondary">
                <font-awesome-icon icon="fa-solid fa-camera" class="me-1" />Alterar Foto
              </RouterLink>
            </div>
          </div>

          <!-- Dados -->
          <div class="col-sm-10">
            <div class="row g-3">
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">CPF</label>
                <input type="text" :value="funcionario.cpf" class="form-control" disabled />
              </div>
              <div class="col-sm-10">
                <label class="form-label small fw-semibold text-muted">Nome do Funcionário</label>
                <input type="text" :value="funcionario.nome" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Telefone 1</label>
                <input type="text" :value="funcionario.telefone1" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Telefone 2</label>
                <input type="text" :value="funcionario.telefone2" class="form-control" disabled />
              </div>
              <div class="col-sm-6">
                <label class="form-label small fw-semibold text-muted">E-mail</label>
                <input type="text" :value="funcionario.email" class="form-control" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Abas -->
    <ul class="nav nav-tabs mb-0">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: aba === 'dados' }" @click="abrirAba('dados')">
          <font-awesome-icon icon="fa-solid fa-shield-halved" class="me-1" />Acesso
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: aba === 'diarios' }" @click="abrirAba('diarios')">
          <font-awesome-icon icon="fa-solid fa-book-open" class="me-1" />Diários
          <span class="badge bg-secondary rounded-pill ms-1">{{ diarios.length || '' }}</span>
        </button>
      </li>
    </ul>

    <!-- Aba: Acesso -->
    <div v-if="aba === 'dados'" class="card border-0 shadow-sm rounded-top-0">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-sm-3">
            <label class="form-label small fw-semibold text-muted">Usuário</label>
            <input type="text" :value="funcionario?.usuario?.username" disabled class="form-control" />
          </div>
          <div class="col-sm-3">
            <label class="form-label small fw-semibold text-muted">Categoria</label>
            <input type="text" :value="categoriaFuncionario(funcionario?.usuario?.categoria)" disabled class="form-control" />
          </div>
          <div class="col-sm-3">
            <label class="form-label small fw-semibold text-muted">Status</label>
            <div class="mt-2">
              <span class="badge rounded-pill px-2 py-1"
                :class="funcionario?.usuario?.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                {{ statusPadrao(funcionario?.usuario?.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aba: Diários -->
    <div v-if="aba === 'diarios'" class="card border-0 shadow-sm rounded-top-0">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>
          <font-awesome-icon icon="fa-solid fa-book-open" class="me-2 text-success" />
          Diários de {{ funcionario.nome?.split(' ')[0] }}
        </span>
        <button class="btn btn-success btn-sm" @click="abrirModal">
          <font-awesome-icon icon="fa-solid fa-plus" class="me-1" />Adicionar Diário
        </button>
      </div>

      <div class="card-body p-0">

        <div v-if="carregandoDiarios" class="text-center py-5">
          <div class="spinner-border text-success" role="status"></div>
        </div>

        <div v-else-if="diarios.length === 0" class="text-center py-5 text-muted">
          <font-awesome-icon icon="fa-solid fa-inbox" class="fs-2 mb-2 d-block mx-auto opacity-25" />
          <p class="small mb-0">Nenhum diário atribuído a este professor</p>
        </div>

        <table v-else class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Diário</th>
              <th>Turma</th>
              <th class="text-center">Status</th>
              <th style="width:56px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in diarios" :key="d.id">
              <td class="fw-semibold">{{ d.descricao }}</td>
              <td class="text-muted small">{{ d.turma?.descricao }}</td>
              <td class="text-center">
                <span class="badge rounded-pill px-2"
                  :class="d.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusPadrao(d.status) }}
                </span>
              </td>
              <td>
                <RouterLink :to="'/diario/ficha/' + d.id" class="btn btn-sm btn-outline-secondary">
                  <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <!-- Modal: Novo Diário -->
    <template v-if="modalAberto">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">

            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold">
                <font-awesome-icon icon="fa-solid fa-book-open" class="me-2 text-success" />
                Novo Diário
              </h5>
              <button type="button" class="btn-close" @click="modalAberto = false"></button>
            </div>

            <form @submit.prevent="criarDiario">
              <div class="modal-body pt-2">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label small fw-semibold">Professor</label>
                    <input type="text" :value="funcionario.nome" disabled class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-semibold">Turma <span class="text-danger">*</span></label>
                    <select v-model="formDiario.turma_id" class="form-select" required>
                      <option value="">Selecione uma turma…</option>
                      <option v-for="t in turmas" :key="t.id" :value="t.id">{{ t.descricao }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-semibold">Descrição <span class="text-danger">*</span></label>
                    <input v-model="formDiario.descricao" type="text" class="form-control" placeholder="Ex: Matemática, Português…" required />
                  </div>
                  <div class="col-sm-4">
                    <label class="form-label small fw-semibold">Status</label>
                    <select v-model="formDiario.status" class="form-select">
                      <option :value="1">Ativo</option>
                      <option :value="0">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="modal-footer border-0 pt-0">
                <button type="button" class="btn btn-outline-secondary" @click="modalAberto = false">Cancelar</button>
                <button type="submit" class="btn btn-success px-4" :disabled="salvandoDiario">
                  <span v-if="salvandoDiario">
                    <span class="spinner-border spinner-border-sm me-1"></span>Salvando…
                  </span>
                  <span v-else>
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />Salvar
                  </span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </template>

  </div>
</template>
