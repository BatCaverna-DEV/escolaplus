<script setup>
import { apiFetch } from "@/services/http.js";
import { onMounted, ref } from "vue";

const calendario = ref({})
const turmas     = ref([])

onMounted(async () => {
  const r1      = await apiFetch('/calendario/ativo')
  calendario.value = await r1.json()

  const r2  = await apiFetch('/turma/listar/' + calendario.value.id)
  turmas.value = await r2.json()
})
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <div>
        <h4 class="page-title">
          <font-awesome-icon icon="fa-solid fa-landmark" class="me-2 text-success" />Turmas
        </h4>
        <p class="text-muted small mb-0">{{ calendario.descricao }}</p>
      </div>
      <div class="page-actions">
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Tabela -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Sigla</th>
              <th>Descrição</th>
              <th class="text-center">Ano</th>
              <th style="width:56px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turma in turmas" :key="turma.id">
              <td class="ps-3">
                <span class="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 rounded">
                  {{ turma.sigla }}
                </span>
              </td>
              <td class="fw-semibold">{{ turma.descricao }}</td>
              <td class="text-center text-muted">{{ turma.calendario?.ano }}</td>
              <td class="pe-3">
                <RouterLink :to="'/turma/ficha/' + turma.id" class="btn btn-sm btn-outline-secondary">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </RouterLink>
              </td>
            </tr>
            <tr v-if="turmas.length === 0">
              <td colspan="4" class="text-center text-muted py-5">
                <font-awesome-icon icon="fa-solid fa-inbox" class="d-block mx-auto mb-2 fs-3" />
                Nenhuma turma encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
