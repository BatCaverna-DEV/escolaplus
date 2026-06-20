<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { apiFetch } from "@/services/http.js";
import { dataBrasil, statusAluno, statusMatricula } from "@/services/format.js";
import Matricula from "@/components/Matricula.vue";

const route  = useRoute();
const id     = route.params.id;
const aluno  = ref({})

const mostrarModalMatricula = ref(false)
const alunoSelecionado      = ref(null)

// Transferência de turma
const mostrarModalTransferir  = ref(false)
const matriculaSelecionada    = ref(null)
const turmas                  = ref([])
const novaTurmaId             = ref('')
const salvandoTransferencia   = ref(false)

function abrirMatricula(a) {
  alunoSelecionado.value      = a
  mostrarModalMatricula.value = true
}

async function abrirTransferir(m) {
  matriculaSelecionada.value  = m
  novaTurmaId.value           = m.turma_id
  mostrarModalTransferir.value = true
  if (!turmas.value.length) {
    const r1 = await apiFetch('/calendario/ativo')
    if (r1.status === 200) {
      const cal = await r1.json()
      const r2  = await apiFetch(`/turma/listar/${cal.id}`)
      turmas.value = await r2.json()
    }
  }
}

async function salvarTransferencia() {
  if (!novaTurmaId.value) return
  const confirmado = confirm(
    `Atenção: todas as notas da matrícula atual serão excluídas e recriadas para a nova turma.\n\nDeseja continuar?`
  )
  if (!confirmado) return

  salvandoTransferencia.value = true
  try {
    const r = await apiFetch('/aluno/transferir', {
      method: 'PUT',
      body: { matricula_id: matriculaSelecionada.value.id, nova_turma_id: novaTurmaId.value }
    })
    const dados = await r.json()
    if (r.ok) {
      alert(dados.message)
      mostrarModalTransferir.value = false
      const resposta = await apiFetch('/aluno/get/' + id)
      aluno.value = await resposta.json()
    } else {
      alert(`Erro: ${dados.message}`)
    }
  } catch (e) {
    alert(e.message)
  } finally {
    salvandoTransferencia.value = false
  }
}

onMounted(async () => {
  const resposta = await apiFetch('/aluno/get/' + id)
  aluno.value    = await resposta.json()
})

const baixar = async () => {
  const res  = await fetch(
    `${import.meta.env.VITE_API_BASE}/impressao/ficha/${aluno.value.id}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("escola_token")}` } }
  )
  const blob = await res.blob()
  const url  = window.URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = "ficha-" + aluno.value.nome + ".pdf"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <Matricula
    v-if="mostrarModalMatricula"
    :aluno="alunoSelecionado"
    @fechar="mostrarModalMatricula = false"
  />

  <!-- Modal Alterar Turma -->
  <template v-if="mostrarModalTransferir">
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <font-awesome-icon icon="fa-solid fa-right-left" class="me-2 text-warning" />
              Alterar Turma
            </h5>
            <button type="button" class="btn-close" @click="mostrarModalTransferir = false"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning small mb-3">
              <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="me-1" />
              Todas as notas da matrícula <strong>{{ matriculaSelecionada?.matricula }}</strong> serão excluídas e recriadas para a nova turma.
            </div>
            <label class="form-label fw-semibold">Nova Turma</label>
            <select class="form-select" v-model="novaTurmaId">
              <option value="">Selecione uma turma…</option>
              <option :value="t.id" v-for="t in turmas" :key="t.id">{{ t.descricao }}</option>
            </select>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button class="btn btn-outline-secondary" @click="mostrarModalTransferir = false">Cancelar</button>
            <button class="btn btn-warning px-4" @click="salvarTransferencia" :disabled="!novaTurmaId || salvandoTransferencia">
              <span v-if="salvandoTransferencia" class="spinner-border spinner-border-sm me-1"></span>
              <font-awesome-icon v-else icon="fa-solid fa-right-left" class="me-1" />
              Confirmar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fas fa-user-graduate" class="me-2 text-success" />Ficha do Aluno
      </h4>
      <div class="page-actions">
        <button v-if="aluno.status == 0" @click="abrirMatricula(aluno)" class="btn btn-warning btn-sm">
          <font-awesome-icon icon="fa-solid fa-file-signature" class="me-1" />Matricular
        </button>
        <button v-if="aluno.status == 1" @click="baixar" class="btn btn-sm btn-outline-success">
          <font-awesome-icon icon="fa-solid fa-print" class="me-1" />Ficha PDF
        </button>
        <RouterLink to="/aluno/principal" class="btn btn-sm btn-outline-secondary">
          <font-awesome-icon icon="fa-solid fa-print" class="me-1" />Boletim
        </RouterLink>
        <RouterLink :to="'/aluno/editar/' + aluno.id" class="btn btn-sm btn-primary">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="me-1" />Editar
        </RouterLink>
        <RouterLink to="/aluno/principal" class="btn btn-sm btn-outline-secondary">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Dados principais -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body">
        <div class="row g-3 align-items-start">

          <!-- Foto -->
          <div class="col-sm-2 text-center">
            <img :src="aluno.foto" class="rounded-3 w-100" style="max-width:110px; aspect-ratio:3/4; object-fit:cover;" alt="Foto">
            <div class="mt-2">
              <RouterLink :to="'/aluno/foto/' + aluno.id" class="btn btn-sm btn-outline-secondary">
                <font-awesome-icon icon="fa-solid fa-camera" class="me-1" />Alterar Foto
              </RouterLink>
            </div>
          </div>

          <!-- Campos principais -->
          <div class="col-sm-10">
            <div class="row g-3">
              <div class="col-sm-7">
                <label class="form-label small fw-semibold text-muted">Nome do Aluno</label>
                <input :value="aluno.nome" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Nascimento</label>
                <input :value="dataBrasil(aluno.nascimento)" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">Status</label>
                <div class="mt-1">
                  <span class="badge rounded-pill px-2 py-1 fs-6"
                    :class="aluno.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                    {{ statusAluno(aluno.status) }}
                  </span>
                </div>
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">CEP</label>
                <input :value="aluno.cep" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-8">
                <label class="form-label small fw-semibold text-muted">Endereço</label>
                <input :value="aluno.endereco" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">Número</label>
                <input :value="aluno.numero" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-4">
                <label class="form-label small fw-semibold text-muted">Bairro</label>
                <input :value="aluno.bairro" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-4">
                <label class="form-label small fw-semibold text-muted">Cidade</label>
                <input :value="aluno.cidade" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-4">
                <label class="form-label small fw-semibold text-muted">Estado</label>
                <input :value="aluno.estado" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">Telefone 1</label>
                <input :value="aluno.telefone1" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">Telefone 2</label>
                <input :value="aluno.telefone2" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-2">
                <label class="form-label small fw-semibold text-muted">Telefone 3</label>
                <input :value="aluno.telefone3" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-6">
                <label class="form-label small fw-semibold text-muted">E-mail</label>
                <input :value="aluno.email" type="text" class="form-control" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Abas -->
    <div class="card border-0 shadow-sm">
      <div class="card-header p-0">
        <ul class="nav nav-tabs border-0 px-3 pt-2" role="tablist">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-pais" type="button">
              <font-awesome-icon icon="fa-solid fa-users" class="me-1" />Dados dos Pais
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-outros" type="button">
              <font-awesome-icon icon="fa-solid fa-heart-pulse" class="me-1" />Saúde
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-matricula" type="button">
              <font-awesome-icon icon="fa-solid fa-file-signature" class="me-1" />Matrícula
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content">

          <!-- Pais -->
          <div class="tab-pane fade show active" id="tab-pais">
            <div class="row g-3">
              <div class="col-sm-9">
                <label class="form-label small fw-semibold text-muted">Nome do Pai</label>
                <input :value="aluno.pai" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">CPF do Pai</label>
                <input :value="aluno.cpf_pai" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-9">
                <label class="form-label small fw-semibold text-muted">Nome da Mãe</label>
                <input :value="aluno.mae" type="text" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">CPF da Mãe</label>
                <input :value="aluno.cpf_mae" type="text" class="form-control" disabled />
              </div>
            </div>
          </div>

          <!-- Saúde -->
          <div class="tab-pane fade" id="tab-outros">
            <div class="row g-3">
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Plano de Saúde</label>
                <input :value="aluno.saude" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Hospital Público</label>
                <input :value="aluno.hospital" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Redes Sociais</label>
                <input :value="aluno.redes" class="form-control" disabled />
              </div>
              <div class="col-sm-3">
                <label class="form-label small fw-semibold text-muted">Vai Sozinho</label>
                <input :value="aluno.sozinho" class="form-control" disabled />
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold text-muted">Observações</label>
                <textarea :value="aluno.obs" class="form-control" rows="3" disabled></textarea>
              </div>
            </div>
          </div>

          <!-- Matrícula -->
          <div class="tab-pane fade" id="tab-matricula">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Responsável</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Turma</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in aluno.matriculas" :key="m.id">
                    <td class="fw-semibold">{{ m.matricula }}</td>
                    <td>{{ m.responsavel }}</td>
                    <td class="text-muted small">{{ m.cpf }}</td>
                    <td class="text-muted small">{{ m.telefone }}</td>
                    <td>{{ m.turma?.descricao }}</td>
                    <td>
                      <span class="badge rounded-pill px-2"
                        :class="m.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                        {{ statusMatricula(m.status) }}
                      </span>
                    </td>
                    <td>
                      <button v-if="m.status == 1" class="btn btn-sm btn-outline-warning" @click="abrirTransferir(m)" title="Alterar Turma">
                        <font-awesome-icon icon="fa-solid fa-right-left" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!aluno.matriculas?.length">
                    <td colspan="7" class="text-center text-muted py-4">Nenhuma matrícula encontrada</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
