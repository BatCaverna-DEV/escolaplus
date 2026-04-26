<script setup>
import { getUser } from "@/services/token.js";
import { apiFetch } from "@/services/http.js";
import { onMounted, ref } from "vue";

const payload = getUser()
const perfil  = ref({})

onMounted(async () => {
  const resposta = await apiFetch('/funcionario/get/' + payload.funcionario_id);
  perfil.value   = await resposta.json();
})
</script>

<template>
  <div>
    <!-- Saudação -->
    <div class="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm border-start border-4 border-success">
      <font-awesome-icon icon="fa-solid fa-circle-check" size="xl" class="text-success" />
      <div>
        <h5 class="mb-0 fw-bold">Bem-vindo, {{ perfil.nome?.split(' ')[0] }}!</h5>
        <p class="mb-0 text-muted small">Acesso realizado com sucesso. O que deseja gerenciar hoje?</p>
      </div>
    </div>

    <!-- Cards de acesso rápido -->
    <div class="row g-3">
      <div class="col-sm-6 col-xl-3">
        <RouterLink to="/aluno/principal" class="text-decoration-none">
          <div class="card ep-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="ep-icon-wrap" style="background:#dbeafe; color:#1d4ed8;">
                <font-awesome-icon icon="fas fa-user-graduate" />
              </div>
              <div>
                <div class="fw-bold text-dark">Alunos</div>
                <div class="text-muted small">Cadastros e matrículas</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-sm-6 col-xl-3">
        <RouterLink to="/turma/principal" class="text-decoration-none">
          <div class="card ep-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="ep-icon-wrap" style="background:#d1fae5; color:#065f46;">
                <font-awesome-icon icon="fa-solid fa-landmark" />
              </div>
              <div>
                <div class="fw-bold text-dark">Turmas</div>
                <div class="text-muted small">Diários e matriculados</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-sm-6 col-xl-3">
        <RouterLink to="/funcionario/principal" class="text-decoration-none">
          <div class="card ep-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="ep-icon-wrap" style="background:#fef9c3; color:#854d0e;">
                <font-awesome-icon icon="fa-solid fa-user-tie" />
              </div>
              <div>
                <div class="fw-bold text-dark">Funcionários</div>
                <div class="text-muted small">Equipe e professores</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-sm-6 col-xl-3">
        <RouterLink to="/calendario/principal" class="text-decoration-none">
          <div class="card ep-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="ep-icon-wrap" style="background:#f3e8ff; color:#7e22ce;">
                <font-awesome-icon icon="fa-solid fa-calendar-days" />
              </div>
              <div>
                <div class="fw-bold text-dark">Ano Letivo</div>
                <div class="text-muted small">Calendário e períodos</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ep-card {
  border-radius: .75rem !important;
  transition: transform .15s, box-shadow .15s;
  cursor: pointer;
}
.ep-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,.1) !important;
}

.ep-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
</style>
