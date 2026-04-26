<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from "@/services/http.js";
import AlertMessage from "@/components/AlertMessage.vue";

const erro   = ref('')
const router = useRouter()

const estados = [
  'Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal',
  'Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul',
  'Minas Gerais','Pará','Paraíba','Paraná','Pernambuco','Piauí',
  'Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondônia',
  'Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins',
]

const aluno = ref({
  nome: '', cep: '', endereco: '', numero: '', bairro: '',
  cidade: '', estado: '', nascimento: '', pai: '', cpf_pai: '', mae: '',
  cpf_mae: '', telefone1: '', telefone2: '', telefone3: '', email: '',
  obs: '', saude: 'Não', hospital: 'Não', sozinho: 'Não', alergia: '',
  redes: 'Não', foto: null,
})

async function salvar() {
  erro.value = ''
  try {
    const resposta = await apiFetch('/aluno/salvar', { method: 'POST', body: aluno.value })
    if (resposta.ok) {
      const dados = await resposta.json()
      alert(dados.message)
      router.push('/aluno/ficha/' + dados.id)
    } else {
      const msg  = await resposta.json()
      erro.value = `${resposta.status} - ${msg.message}`
    }
  } catch (error) {
    erro.value = error
  }
}

async function buscarCep() {
  const cep  = aluno.value.cep.replace('-', '')
  const resp = await fetch('https://viacep.com.br/ws/' + cep + '/json')
  const d    = await resp.json()
  aluno.value.endereco = d.logradouro
  aluno.value.bairro   = d.bairro
  aluno.value.cidade   = d.localidade
  aluno.value.estado   = d.estado
}
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fas fa-user-graduate" class="me-2 text-success" />Cadastro de Aluno
      </h4>
      <div class="page-actions">
        <RouterLink to="/aluno/principal" class="btn btn-outline-secondary btn-sm">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <AlertMessage :msg="erro" tipo="danger" />

    <form @submit.prevent="salvar">

      <!-- Dados Pessoais -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-id-card" class="me-2 text-success" />Dados Pessoais
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-9">
              <label class="form-label small fw-semibold">Nome do Aluno <span class="text-danger">*</span></label>
              <input v-model="aluno.nome" type="text" class="form-control" placeholder="Nome completo" required />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">Nascimento <span class="text-danger">*</span></label>
              <input v-model="aluno.nascimento" type="date" class="form-control" required />
            </div>
          </div>
        </div>
      </div>

      <!-- Endereço -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-location-dot" class="me-2 text-success" />Endereço
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-2">
              <label class="form-label small fw-semibold">CEP</label>
              <input v-mask="'#####-###'" v-model="aluno.cep" @change="buscarCep" type="text" class="form-control" placeholder="00000-000" />
            </div>
            <div class="col-sm-8">
              <label class="form-label small fw-semibold">Endereço <span class="text-danger">*</span></label>
              <input v-model="aluno.endereco" type="text" class="form-control" placeholder="Rua, Avenida…" required />
            </div>
            <div class="col-sm-2">
              <label class="form-label small fw-semibold">Número <span class="text-danger">*</span></label>
              <input v-model="aluno.numero" type="number" class="form-control" required />
            </div>
            <div class="col-sm-4">
              <label class="form-label small fw-semibold">Bairro <span class="text-danger">*</span></label>
              <input v-model="aluno.bairro" type="text" class="form-control" required />
            </div>
            <div class="col-sm-4">
              <label class="form-label small fw-semibold">Cidade <span class="text-danger">*</span></label>
              <input v-model="aluno.cidade" type="text" class="form-control" required />
            </div>
            <div class="col-sm-4">
              <label class="form-label small fw-semibold">Estado</label>
              <select v-model="aluno.estado" class="form-select">
                <option value="">Selecione</option>
                <option v-for="uf in estados" :key="uf" :value="uf">{{ uf }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Contatos -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-phone" class="me-2 text-success" />Contatos
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">Telefone 1 <span class="text-danger">*</span></label>
              <input v-mask="'(##) #####-####'" v-model="aluno.telefone1" type="text" class="form-control" required />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">Telefone 2</label>
              <input v-mask="'(##) #####-####'" v-model="aluno.telefone2" type="text" class="form-control" />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">Telefone 3</label>
              <input v-mask="'(##) #####-####'" v-model="aluno.telefone3" type="text" class="form-control" />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">E-mail</label>
              <input v-model="aluno.email" type="email" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filiação -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-users" class="me-2 text-success" />Filiação
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-9">
              <label class="form-label small fw-semibold">Nome do Pai</label>
              <input v-model="aluno.pai" type="text" class="form-control" />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">CPF do Pai</label>
              <input v-mask="'###.###.###-##'" v-model="aluno.cpf_pai" type="text" class="form-control" />
            </div>
            <div class="col-sm-9">
              <label class="form-label small fw-semibold">Nome da Mãe <span class="text-danger">*</span></label>
              <input v-model="aluno.mae" type="text" class="form-control" required />
            </div>
            <div class="col-sm-3">
              <label class="form-label small fw-semibold">CPF da Mãe <span class="text-danger">*</span></label>
              <input v-mask="'###.###.###-##'" v-model="aluno.cpf_mae" type="text" class="form-control" required />
            </div>
          </div>
        </div>
      </div>

      <!-- Saúde e Observações -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header">
          <font-awesome-icon icon="fa-solid fa-heart-pulse" class="me-2 text-success" />Saúde e Observações
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-6">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-semibold">Alergias</label>
                  <input v-model="aluno.alergia" type="text" class="form-control" placeholder="Descreva alergias conhecidas…" />
                </div>
                <div class="col-sm-6">
                  <label class="form-label small fw-semibold">Tem plano de saúde?</label>
                  <select v-model="aluno.saude" class="form-select">
                    <option value="Não">Não</option><option value="Sim">Sim</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label small fw-semibold">Hospital público?</label>
                  <select v-model="aluno.hospital" class="form-select">
                    <option value="Não">Não</option><option value="Sim">Sim</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label small fw-semibold">Imagem nas redes?</label>
                  <select v-model="aluno.redes" class="form-select">
                    <option value="Não">Não</option><option value="Sim">Sim</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label small fw-semibold">Vai sozinho para casa?</label>
                  <select v-model="aluno.sozinho" class="form-select">
                    <option value="Não">Não</option><option value="Sim">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <label class="form-label small fw-semibold">Observações</label>
              <textarea v-model="aluno.obs" class="form-control" rows="7" placeholder="Informações adicionais…"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="d-flex justify-content-end gap-2 mb-3">
        <RouterLink to="/aluno/principal" class="btn btn-outline-secondary">Cancelar</RouterLink>
        <button type="submit" class="btn btn-success px-4">
          <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-2" />Salvar
        </button>
      </div>

    </form>
  </div>
</template>
