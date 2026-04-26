<script setup>
import { apiFetch } from "@/services/http.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { dataBrasil, statusPadrao } from "@/services/format.js";

const route      = useRoute();
const turma      = ref({})
const diarios    = ref([])
const matriculas = ref([])
const id         = route.params.id
const carregando = ref(false)

onMounted(async () => {
  carregando.value = true
  const [r1, r2, r3] = await Promise.all([
    apiFetch(`/turma/get/${id}`),
    apiFetch(`/turma/diarios/${id}`),
    apiFetch(`/turma/matriculas/${id}`),
  ])
  turma.value      = await r1.json()
  diarios.value    = await r2.json()
  matriculas.value = await r3.json()
  carregando.value = false
})
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-landmark" class="me-2 text-success" />
        Turma — {{ turma.descricao }}
      </h4>
      <div class="page-actions">
        <RouterLink class="btn btn-sm btn-primary" :to="'/turma/editar/' + turma.id">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="me-1" />Editar
        </RouterLink>
        <RouterLink class="btn btn-sm btn-outline-secondary" to="/turma/principal">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <div v-if="!carregando">
      <!-- Info da turma -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-2">
              <label class="form-label small fw-semibold text-muted">Sigla</label>
              <input type="text" :value="turma.sigla" class="form-control" disabled />
            </div>
            <div class="col-sm-7">
              <label class="form-label small fw-semibold text-muted">Descrição</label>
              <input type="text" :value="turma.descricao" class="form-control" disabled />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold text-muted">Status</label>
              <div class="mt-2">
                <span class="badge rounded-pill px-2 py-1"
                  :class="turma.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusPadrao(turma.status) }}
                </span>
              </div>
            </div>
            <div class="col-sm-2">
              <label class="form-label small fw-semibold text-muted">Alunos</label>
              <input type="text" :value="matriculas.length" class="form-control" disabled />
            </div>
            <div class="col-sm-6">
              <label class="form-label small fw-semibold text-muted">Calendário</label>
              <input type="text" :value="turma.calendario?.descricao" class="form-control" disabled />
            </div>
            <div class="col-sm-2">
              <label class="form-label small fw-semibold text-muted">Ano</label>
              <input type="text" :value="turma.calendario?.ano" class="form-control" disabled />
            </div>
          </div>
        </div>
      </div>

      <!-- Abas -->
      <div class="card border-0 shadow-sm">
        <div class="card-header p-0">
          <ul class="nav nav-tabs border-0 px-3 pt-2">
            <li class="nav-item">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-diarios" type="button">
                <font-awesome-icon icon="fa-solid fa-book-open" class="me-1" />Diários
                <span class="badge bg-secondary ms-1 rounded-pill">{{ diarios.length }}</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-matriculas" type="button">
                <font-awesome-icon icon="fas fa-user-graduate" class="me-1" />Alunos Matriculados
                <span class="badge bg-secondary ms-1 rounded-pill">{{ matriculas.length }}</span>
              </button>
            </li>
          </ul>
        </div>
        <div class="card-body p-0">
          <div class="tab-content">

            <!-- Diários -->
            <div class="tab-pane fade show active" id="tab-diarios">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Professor</th>
                      <th>Turma</th>
                      <th style="width:56px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="d in diarios" :key="d.id">
                      <td class="ps-3 fw-semibold">{{ d.descricao }}</td>
                      <td>{{ d.professor?.nome }}</td>
                      <td class="text-muted small">{{ d.turma?.descricao }}</td>
                      <td class="pe-3">
                        <RouterLink :to="'/diario/ficha/' + d.id" class="btn btn-sm btn-outline-secondary">
                          <font-awesome-icon icon="fa-solid fa-eye" />
                        </RouterLink>
                      </td>
                    </tr>
                    <tr v-if="diarios.length === 0">
                      <td colspan="4" class="text-center text-muted py-4">Nenhum diário encontrado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Matriculados -->
            <div class="tab-pane fade" id="tab-matriculas">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th style="width:56px;"></th>
                      <th>Matrícula</th>
                      <th>Nome</th>
                      <th>Nascimento</th>
                      <th style="width:56px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in matriculas" :key="m.id">
                      <td class="ps-3">
                        <img :src="m.aluno?.foto" class="avatar" alt="">
                      </td>
                      <td class="text-muted small">{{ m.matricula }}</td>
                      <td class="fw-semibold">{{ m.aluno?.nome }}</td>
                      <td class="text-muted small">{{ dataBrasil(m.aluno?.nascimento) }}</td>
                      <td class="pe-3">
                        <RouterLink target="_blank" :to="'/aluno/ficha/' + m.aluno?.id" class="btn btn-sm btn-outline-secondary">
                          <font-awesome-icon icon="fa-solid fa-eye" />
                        </RouterLink>
                      </td>
                    </tr>
                    <tr v-if="matriculas.length === 0">
                      <td colspan="5" class="text-center text-muted py-4">Nenhum aluno matriculado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
