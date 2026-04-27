<script setup>
import { apiFetch } from "@/services/http.js";
import { ref, onMounted, computed } from "vue";
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

const ehProfessor = computed(() => Number(funcionario.value?.usuario?.categoria) === 2)

onMounted(async () => { await carregar() })

async function carregar() {
  try {
    const resposta    = await apiFetch("/funcionario/get/" + route.params.id);
    funcionario.value = await resposta.json();
  } catch (err) {
    alert(err.message)
  }
}

async function gerarUsuario() {
  try {
    salvando.value = true
    const resposta = await apiFetch('/funcionario/gerar-usuario/' + funcionario.value.id, {
      method: 'POST',
      body: { categoria: novaCategoria.value },
    })
    const dados    = await resposta.json()
    msg.value      = { texto: dados.message, tipo: resposta.ok ? 'success' : 'warning' }
    await carregar()
  } catch (err) {
    msg.value = { texto: err.message, tipo: 'danger' }
  } finally {
    salvando.value = false
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
const diarios           = ref([])
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

const novaCategoria = ref(1)

// ── Modal vincular diários ────────────────────────────────────────
const modalAberto       = ref(false)
const diariosDisponiveis = ref([])
const selecionados      = ref([])
const salvandoDiario    = ref(false)

async function abrirModal() {
  selecionados.value = []
  modalAberto.value  = true
  const r = await apiFetch('/diario/listar')
  if (r.ok) {
    const todos = await r.json()
    const jaVinculados = new Set(diarios.value.map(d => d.id))
    diariosDisponiveis.value = todos.filter(d => d.status == 1 && !jaVinculados.has(d.id))
  }
}

async function vincularDiarios() {
  if (!selecionados.value.length) return
  salvandoDiario.value = true
  try {
    for (const d of selecionados.value) {
      const r = await apiFetch('/diario/editar', {
        method: 'PUT',
        body: { id: d.id, descricao: d.descricao, status: d.status, funcionario_id: route.params.id },
      })
      if (r.ok) {
        const atualizado = await r.json()
        diarios.value.push(atualizado)
      }
    }
    diarios.value.sort((a, b) => a.descricao.localeCompare(b.descricao))
    modalAberto.value = false
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
        <button v-if="!salvando && funcionario.usuario_id && funcionario.usuario_id !== user.usuario_id"
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
      <li class="nav-item" v-if="ehProfessor">
        <button class="nav-link" :class="{ active: aba === 'diarios' }" @click="abrirAba('diarios')">
          <font-awesome-icon icon="fa-solid fa-book-open" class="me-1" />Diários
          <span class="badge bg-secondary rounded-pill ms-1">{{ diarios.length || '' }}</span>
        </button>
      </li>
    </ul>

    <!-- Aba: Acesso -->
    <div v-if="aba === 'dados'" class="card border-0 shadow-sm rounded-top-0">
      <div class="card-body">

        <!-- Sem usuário vinculado -->
        <div v-if="!funcionario.usuario_id" class="py-3">
          <div class="d-flex align-items-center gap-2 text-warning mb-3">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="fs-5" />
            <span class="small">Este funcionário ainda não possui acesso ao sistema.</span>
          </div>
          <div class="row g-3 align-items-end">
            <div class="col-sm-3">
              <label class="form-label small fw-semibold text-muted">Tipo de Usuário</label>
              <select v-model="novaCategoria" class="form-select form-select-sm">
                <option :value="1">Secretaria</option>
                <option :value="2">Professor</option>
              </select>
            </div>
            <div class="col-auto">
              <button class="btn btn-success btn-sm" :disabled="salvando" @click="gerarUsuario">
                <span v-if="salvando">
                  <span class="spinner-border spinner-border-sm me-1"></span>Gerando…
                </span>
                <span v-else>
                  <font-awesome-icon icon="fa-solid fa-user-plus" class="me-1" />Gerar Usuário
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Com usuário vinculado -->
        <div v-else class="row g-3">
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

    <!-- Modal: Vincular Diários -->
    <template v-if="modalAberto">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">

            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold">
                <font-awesome-icon icon="fa-solid fa-book-open" class="me-2 text-success" />
                Adicionar Diários
              </h5>
              <button type="button" class="btn-close" @click="modalAberto = false"></button>
            </div>

            <div class="modal-body pt-2">
              <p class="text-muted small mb-2">Selecione os diários ativos para vincular a <strong>{{ funcionario.nome }}</strong>:</p>

              <div v-if="diariosDisponiveis.length === 0" class="text-center py-4 text-muted">
                <font-awesome-icon icon="fa-solid fa-inbox" class="fs-3 d-block mx-auto mb-2 opacity-25" />
                <p class="small mb-0">Nenhum diário ativo disponível para vincular</p>
              </div>

              <div v-else class="list-group list-group-flush border rounded">
                <label v-for="d in diariosDisponiveis" :key="d.id"
                  class="list-group-item list-group-item-action d-flex align-items-center gap-2 py-2">
                  <input type="checkbox" class="form-check-input m-0" :value="d" v-model="selecionados" />
                  <span class="flex-grow-1">
                    <span class="fw-semibold">{{ d.descricao }}</span>
                    <span class="text-muted small ms-2">{{ d.turma?.descricao }}</span>
                  </span>
                </label>
              </div>
            </div>

            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary" @click="modalAberto = false">Cancelar</button>
              <button class="btn btn-success px-4" :disabled="salvandoDiario || !selecionados.length" @click="vincularDiarios">
                <span v-if="salvandoDiario">
                  <span class="spinner-border spinner-border-sm me-1"></span>Salvando…
                </span>
                <span v-else>
                  <font-awesome-icon icon="fa-solid fa-link" class="me-1" />Vincular {{ selecionados.length || '' }}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </template>

  </div>
</template>
