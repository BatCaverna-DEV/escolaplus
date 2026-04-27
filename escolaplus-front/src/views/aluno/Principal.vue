<script setup>
import { ref, onMounted, watch } from "vue";
import { apiFetch } from "@/services/http.js";
import { dataBrasil, statusAluno } from "@/services/format.js";

const LIMITE      = 30
const alunos      = ref([])
const total       = ref(0)
const offset      = ref(0)
const buscar      = ref('')
const carregando  = ref(false)
const carregandoMais = ref(false)

onMounted(() => listar(true))

async function listar(resetar = true) {
  if (resetar) {
    offset.value = 0
    alunos.value = []
    carregando.value = true
  } else {
    carregandoMais.value = true
  }
  try {
    const termo = buscar.value.trim() || 'todos'
    const r = await apiFetch(`/aluno/listar/${encodeURIComponent(termo)}?limit=${LIMITE}&offset=${offset.value}`)
    if (r.ok) {
      const { alunos: novos, total: tot } = await r.json()
      alunos.value = resetar ? novos : [...alunos.value, ...novos]
      total.value  = tot
      offset.value = alunos.value.length
    }
  } finally {
    carregando.value     = false
    carregandoMais.value = false
  }
}

let debounce = null
watch(buscar, () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => listar(true), 400)
})
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fas fa-user-graduate" class="me-2 text-success" />Alunos
      </h4>
      <div class="page-actions">
        <RouterLink class="btn btn-success btn-sm" to="/aluno/cadastrar">
          <font-awesome-icon icon="fa-solid fa-plus" class="me-1" />Novo Aluno
        </RouterLink>
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Filtro -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body py-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-white">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-muted" />
          </span>
          <input v-model="buscar" type="text" class="form-control" placeholder="Filtrar por nome…" />
          <button v-if="buscar" class="btn btn-outline-secondary" @click="buscar = ''">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
      </div>
    </div>

    <!-- Spinner inicial -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="text-muted mt-2 small">Carregando alunos…</p>
    </div>

    <!-- Tabela -->
    <div v-if="!carregando" class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style="width:56px;"></th>
              <th>Aluno</th>
              <th>Matrícula</th>
              <th>Nascimento</th>
              <th>Status</th>
              <th style="width:56px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in alunos" :key="aluno.id">
              <td class="ps-3">
                <img :src="aluno.foto" class="avatar" alt="">
              </td>
              <td>
                <RouterLink :to="'/aluno/ficha/' + aluno.id" class="fw-semibold text-decoration-none text-dark">
                  {{ aluno.nome }}
                </RouterLink>
              </td>
              <td class="text-muted small">{{ aluno.matriculas?.[0]?.matricula ?? '—' }}</td>
              <td class="text-muted small">{{ dataBrasil(aluno.nascimento) }}</td>
              <td>
                <span class="badge rounded-pill px-2 py-1"
                  :class="aluno.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusAluno(aluno.status) }}
                </span>
              </td>
              <td class="pe-3">
                <RouterLink :to="'/aluno/ficha/' + aluno.id" class="btn btn-sm btn-outline-secondary">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </RouterLink>
              </td>
            </tr>
            <tr v-if="alunos.length === 0">
              <td colspan="6" class="text-center text-muted py-5">
                <font-awesome-icon icon="fa-solid fa-inbox" class="d-block mx-auto mb-2 fs-3" />
                Nenhum aluno encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rodapé -->
      <div v-if="alunos.length > 0" class="card-footer d-flex align-items-center justify-content-between py-2">
        <span class="text-muted small">{{ alunos.length }} de {{ total }} aluno{{ total !== 1 ? 's' : '' }}</span>
        <button v-if="alunos.length < total"
          class="btn btn-sm btn-outline-success"
          :disabled="carregandoMais"
          @click="listar(false)">
          <span v-if="carregandoMais">
            <span class="spinner-border spinner-border-sm me-1"></span>Carregando…
          </span>
          <span v-else>
            <font-awesome-icon icon="fa-solid fa-angles-down" class="me-1" />
            Carregar mais {{ Math.min(LIMITE, total - alunos.length) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
