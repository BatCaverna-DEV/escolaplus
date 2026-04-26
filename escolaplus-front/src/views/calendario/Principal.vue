<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from "@/services/http.js";
import { statusPadrao } from "@/services/format.js";
import AlertMessage from "@/components/AlertMessage.vue";

const calendarios = ref([])
const temAtivo    = ref(false)
const erro        = ref('')

onMounted(async () => { await listar() })

async function listar() {
  try {
    const resposta = await apiFetch('/calendario/listar')
    if (resposta.ok) {
      calendarios.value = await resposta.json()
      temAtivo.value    = calendarios.value.some(c => c.status === 1)
    } else {
      const msg  = await resposta.json()
      erro.value = msg.message
    }
  } catch (err) {
    erro.value = err.message
  }
}
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-calendar-days" class="me-2 text-success" />Ano Letivo
      </h4>
      <div class="page-actions">
        <RouterLink v-if="!temAtivo" class="btn btn-success btn-sm" to="/">
          <font-awesome-icon icon="fa-solid fa-plus" class="me-1" />Novo
        </RouterLink>
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <AlertMessage :msg="erro" tipo="danger" />

    <!-- Tabela -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Descrição</th>
              <th class="text-center">Ano</th>
              <th class="text-center">Média</th>
              <th class="text-center">Etapas</th>
              <th class="text-center">Notas</th>
              <th class="text-center">Status</th>
              <th style="width:60px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cal in calendarios" :key="cal.id">
              <td class="ps-3 fw-semibold">{{ cal.descricao }}</td>
              <td class="text-center">{{ cal.ano }}</td>
              <td class="text-center">{{ cal.media }}</td>
              <td class="text-center">{{ cal.etapas }}</td>
              <td class="text-center">{{ cal.notas * 2 }}</td>
              <td class="text-center">
                <span class="badge rounded-pill px-2 py-1"
                  :class="cal.status === 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusPadrao(cal.status) }}
                </span>
              </td>
              <td class="pe-3">
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    <font-awesome-icon icon="fa-solid fa-bars" />
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                    <li>
                      <RouterLink class="dropdown-item py-2" to="#">
                        <font-awesome-icon icon="fa-solid fa-pen-to-square" class="me-2 text-muted" />Editar
                      </RouterLink>
                    </li>
                    <li><hr class="dropdown-divider my-1"></li>
                    <li>
                      <RouterLink class="dropdown-item py-2 text-danger" to="#">
                        <font-awesome-icon icon="fa-solid fa-circle-xmark" class="me-2" />Fechar
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr v-if="calendarios.length === 0">
              <td colspan="7" class="text-center text-muted py-5">
                <font-awesome-icon icon="fa-solid fa-inbox" class="d-block mx-auto mb-2 fs-3" />
                Nenhum período letivo cadastrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
