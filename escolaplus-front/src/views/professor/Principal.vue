<script setup>
import { ref, onMounted } from "vue"
import { apiFetch } from "@/services/http.js"
import { getUser } from "@/services/token.js"
import { statusPadrao } from "@/services/format.js"

const usuario    = getUser()
const diarios    = ref([])
const carregando = ref(true)

onMounted(async () => {
  const r = await apiFetch('/diario/meus')
  if (r.ok) diarios.value = await r.json()
  carregando.value = false
})
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h4 class="page-title">
          <font-awesome-icon icon="fa-solid fa-book-open" class="me-2 text-success" />
          Meus Diários
        </h4>
        <p class="text-muted small mb-0">Bem-vindo, {{ usuario?.nome }}</p>
      </div>
    </div>

    <!-- Carregando -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <!-- Sem diários -->
    <div v-else-if="diarios.length === 0" class="text-center py-5 text-muted">
      <font-awesome-icon icon="fa-solid fa-inbox" class="fs-2 mb-3 d-block mx-auto opacity-25" />
      <p class="mb-0">Nenhum diário atribuído a você no momento.</p>
    </div>

    <!-- Lista de diários -->
    <div v-else class="row g-3">
      <div v-for="d in diarios" :key="d.id" class="col-sm-6 col-xl-4">
        <div class="card border-0 shadow-sm h-100 ep-diario-card">
          <div class="card-body d-flex flex-column gap-2 p-3">

            <div class="d-flex justify-content-between align-items-start gap-2">
              <h6 class="fw-bold mb-0 lh-sm">{{ d.descricao }}</h6>
              <span
                class="badge rounded-pill px-2 flex-shrink-0"
                :class="d.status == 1 ? 'badge-ativo' : 'badge-inativo'"
              >
                {{ statusPadrao(d.status) }}
              </span>
            </div>

            <div class="text-muted small d-flex align-items-center gap-1">
              <font-awesome-icon icon="fa-solid fa-landmark" class="text-success" />
              {{ d.turma?.descricao }}
            </div>

            <div class="mt-auto pt-2">
              <RouterLink
                :to="'/diario/ficha/' + d.id"
                class="btn btn-outline-success btn-sm w-100"
              >
                <font-awesome-icon icon="fa-solid fa-arrow-right" class="me-1" />
                Abrir Diário
              </RouterLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ep-diario-card {
  transition: transform .15s, box-shadow .15s;
  border-radius: .75rem !important;
}
.ep-diario-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.1) !important;
}
</style>
