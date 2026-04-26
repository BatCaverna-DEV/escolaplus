<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from "@/services/http.js";
import AlertMessage from "@/components/AlertMessage.vue";

const erro      = ref('')
const salvando  = ref(false)
const router    = useRouter()

const funcionario = ref({
  nome: '', telefone1: '', telefone2: '', cpf: '', email: '', categoria: '',
})

async function salvar() {
  erro.value    = ''
  salvando.value = true
  try {
    const resposta = await apiFetch('/funcionario/salvar', {
      method: 'POST', body: funcionario.value
    })
    if (resposta.ok) {
      const dados = await resposta.json()
      alert(dados.message)
      router.push('/funcionario/ficha/' + dados.id)
    } else {
      const msg  = await resposta.json()
      erro.value = `${resposta.status} - ${msg.message}`
      salvando.value = false
    }
  } catch (error) {
    salvando.value = false
    erro.value     = error
  }
}
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2 text-success" />Cadastro de Funcionário
      </h4>
      <div class="page-actions">
        <RouterLink to="/funcionario/principal" class="btn btn-outline-secondary btn-sm">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="salvando" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="text-muted mt-2 small">Salvando dados do funcionário…</p>
    </div>

    <div v-if="!salvando">
      <AlertMessage :msg="erro" tipo="danger" />

      <form @submit.prevent="salvar">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-header">
            <font-awesome-icon icon="fa-solid fa-id-card" class="me-2 text-success" />Dados do Funcionário
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-sm-2">
                <label class="form-label small fw-semibold">CPF <span class="text-danger">*</span></label>
                <input v-mask="'###.###.###-##'" v-model="funcionario.cpf" type="text" class="form-control" required />
              </div>
              <div class="col-sm-10">
                <label class="form-label small fw-semibold">Nome Completo <span class="text-danger">*</span></label>
                <input v-model="funcionario.nome" type="text" class="form-control" required />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold">Telefone 1 <span class="text-danger">*</span></label>
                <input v-mask="'(##) #####-####'" v-model="funcionario.telefone1" type="text" class="form-control" required />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold">Telefone 2</label>
                <input v-mask="'(##) #####-####'" v-model="funcionario.telefone2" type="text" class="form-control" />
              </div>
              <div class="col-sm-6">
                <label class="form-label small fw-semibold">E-mail <span class="text-danger">*</span></label>
                <input v-model="funcionario.email" type="email" class="form-control" required />
              </div>
              <div class="col-sm-4">
                <label class="form-label small fw-semibold">Categoria <span class="text-danger">*</span></label>
                <select v-model="funcionario.categoria" class="form-select" required>
                  <option value="">Selecione…</option>
                  <option value="1">Secretaria</option>
                  <option value="2">Docente</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mb-3">
          <RouterLink to="/funcionario/principal" class="btn btn-outline-secondary">Cancelar</RouterLink>
          <button type="submit" class="btn btn-success px-4">
            <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-2" />Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
