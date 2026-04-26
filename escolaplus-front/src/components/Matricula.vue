<script setup>
import { dataBrasil } from "@/services/format.js";
import { apiFetch } from "@/services/http.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props  = defineProps({ aluno: Object })
const emit   = defineEmits(['fechar'])
const router = useRouter()

const turmas   = ref([])
const matricula = ref({
  aluno_id: props.aluno.id, turma_id: '', responsavel: '', cpf: '', telefone: ''
})
const selecao = ref('1')

onMounted(async () => {
  const r1 = await apiFetch("/calendario/ativo")
  if (r1.status === 200) {
    const cal = await r1.json()
    const r2  = await apiFetch(`/turma/listar/${cal.id}`)
    turmas.value = await r2.json()
  }
})

function selecionarResponsavel() {
  if (selecao.value === '2') {
    matricula.value.responsavel = props.aluno.pai
    matricula.value.cpf         = props.aluno.cpf_pai
  } else if (selecao.value === '3') {
    matricula.value.responsavel = props.aluno.mae
    matricula.value.cpf         = props.aluno.cpf_mae
  } else {
    matricula.value.responsavel = ''
    matricula.value.cpf         = ''
  }
}

async function salvar() {
  try {
    const resposta = await apiFetch('/aluno/matricular', {
      method: 'POST', body: matricula.value,
    })
    if (resposta.ok) {
      const dados = await resposta.json()
      alert(dados.message)
      emit('fechar')
      window.location.reload()
    } else {
      const msg = await resposta.json()
      alert(`${resposta.status} - ${msg.message}`)
    }
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <!-- Backdrop -->
  <div class="modal-backdrop fade show"></div>

  <!-- Modal -->
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow">

        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold">
            <font-awesome-icon icon="fa-solid fa-file-signature" class="me-2 text-success" />
            Matricular Aluno
          </h5>
          <button type="button" class="btn-close" @click="emit('fechar')"></button>
        </div>

        <form @submit.prevent="salvar">
          <div class="modal-body pt-2">

            <!-- Info do aluno -->
            <div class="bg-light rounded-3 p-3 mb-3">
              <div class="row g-2">
                <div class="col-sm-8">
                  <label class="form-label small fw-semibold text-muted mb-1">Aluno</label>
                  <input type="text" :value="aluno.nome" disabled class="form-control form-control-sm" />
                </div>
                <div class="col-sm-4">
                  <label class="form-label small fw-semibold text-muted mb-1">Nascimento</label>
                  <input type="text" :value="dataBrasil(aluno.nascimento)" disabled class="form-control form-control-sm" />
                </div>
              </div>
            </div>

            <!-- Responsável -->
            <h6 class="fw-semibold mb-3 text-muted small text-uppercase">Dados do Responsável</h6>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label small fw-semibold">Selecionar Responsável</label>
                <select class="form-select" @change="selecionarResponsavel" v-model="selecao">
                  <option value="1">— Informar manualmente</option>
                  <option value="2">Pai — {{ aluno.pai }}</option>
                  <option value="3">Mãe — {{ aluno.mae }}</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold">Nome do Responsável <span class="text-danger">*</span></label>
                <input type="text" v-model="matricula.responsavel" class="form-control" required />
              </div>
              <div class="col-sm-5">
                <label class="form-label small fw-semibold">CPF do Responsável <span class="text-danger">*</span></label>
                <input v-mask="'###.###.###-##'" type="text" v-model="matricula.cpf" class="form-control" required />
              </div>
              <div class="col-sm-5">
                <label class="form-label small fw-semibold">Telefone do Responsável <span class="text-danger">*</span></label>
                <input v-mask="'(##) #####-####'" type="text" v-model="matricula.telefone" class="form-control" required />
              </div>
            </div>

            <hr class="my-3">

            <!-- Turma -->
            <h6 class="fw-semibold mb-3 text-muted small text-uppercase">Dados da Matrícula</h6>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label small fw-semibold">Turma <span class="text-danger">*</span></label>
                <select class="form-select" v-model="matricula.turma_id" required>
                  <option value="">Selecione uma turma…</option>
                  <option :value="t.id" v-for="t in turmas" :key="t.id">{{ t.descricao }}</option>
                </select>
              </div>
            </div>

          </div>

          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-outline-secondary" @click="emit('fechar')">Cancelar</button>
            <button type="submit" class="btn btn-success px-4">
              <font-awesome-icon icon="fa-solid fa-file-signature" class="me-2" />Confirmar Matrícula
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>
