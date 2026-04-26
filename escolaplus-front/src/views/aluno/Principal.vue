<script setup>
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/http.js";
import { dataBrasil, statusAluno } from "@/services/format.js";

const alunos     = ref([])
const buscar     = ref('')
const carregando = ref(false)

onMounted(async () => {
  carregando.value = true
  await inicializacao()
  carregando.value = false
})

async function inicializacao() {
  try {
    const resposta = await apiFetch('/aluno/buscar', {
      method: 'POST',
      body: { chave: '', status: 1 }
    })
    if (resposta.status === 200) alunos.value = await resposta.json()
    else alert(resposta.message)
  } catch (error) {
    alert(error.message)
  }
}

async function listar() {
  try {
    carregando.value = true
    const resposta = await apiFetch('/aluno/listar/' + buscar.value)
    if (resposta.ok) {
      alunos.value     = await resposta.json()
      carregando.value = false
    } else {
      const msg = await resposta.json()
      alert(resposta.status + ' - ' + msg.message)
      carregando.value = false
    }
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <div>
    <!-- Cabeçalho da página -->
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
        <form @submit.prevent="listar" class="d-flex align-items-end gap-2">
          <div class="flex-grow-1">
            <label for="busca" class="form-label small fw-semibold mb-1">Buscar por nome</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-muted" />
              </span>
              <input v-model="buscar" type="text" id="busca" class="form-control" placeholder="Nome do aluno…" />
            </div>
          </div>
          <div>
            <button type="submit" class="btn btn-primary btn-sm">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="me-1" />Buscar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Spinner -->
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
    </div>
  </div>
</template>
