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

    <!-- Spinner -->
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

    <!-- Dados de Usuário -->
    <div class="card border-0 shadow-sm">
      <div class="card-header">
        <font-awesome-icon icon="fa-solid fa-shield-halved" class="me-2 text-success" />Dados de Acesso
      </div>
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
  </div>
</template>
