<script setup>
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/http.js";
import { categoriaFuncionario, statusPadrao } from "@/services/format.js";

const funcionarios = ref([])
const buscar       = ref('')

onMounted(async () => { await listar() })

async function listar() {
  const resposta = await apiFetch('/funcionario/listar')
  if (resposta.ok) funcionarios.value = await resposta.json()
}

function filtrar() {
  if (!buscar.value) return funcionarios.value
  return funcionarios.value.filter(f =>
    f.nome.toLowerCase().includes(buscar.value.toLowerCase())
  )
}
</script>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="page-header">
      <h4 class="page-title">
        <font-awesome-icon icon="fa-solid fa-user-tie" class="me-2 text-success" />Funcionários
      </h4>
      <div class="page-actions">
        <a class="btn btn-success btn-sm" href="/funcionario/cadastrar">
          <font-awesome-icon icon="fa-solid fa-plus" class="me-1" />Novo Funcionário
        </a>
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/">
          <font-awesome-icon icon="fa-solid fa-caret-left" class="me-1" />Voltar
        </RouterLink>
      </div>
    </div>

    <!-- Filtro -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body py-2">
        <div class="d-flex align-items-end gap-2">
          <div class="flex-grow-1">
            <label class="form-label small fw-semibold mb-1">Buscar por nome</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-muted" />
              </span>
              <input v-model="buscar" type="text" class="form-control" placeholder="Nome do funcionário…" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style="width:56px;"></th>
              <th>Funcionário</th>
              <th>CPF</th>
              <th class="text-center">Categoria</th>
              <th class="text-center">Status</th>
              <th style="width:56px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in filtrar()" :key="f.id">
              <td class="ps-3">
                <img :src="f.foto" class="avatar" alt="">
              </td>
              <td>
                <RouterLink :to="'/funcionario/ficha/' + f.id" class="fw-semibold text-decoration-none text-dark">
                  {{ f.nome }}
                </RouterLink>
              </td>
              <td class="text-muted small">{{ f.cpf }}</td>
              <td class="text-center">
                <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2">
                  {{ categoriaFuncionario(f?.usuario?.categoria) }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge rounded-pill px-2 py-1"
                  :class="f.status == 1 ? 'badge-ativo' : 'badge-inativo'">
                  {{ statusPadrao(f.status) }}
                </span>
              </td>
              <td class="pe-3">
                <RouterLink :to="'/funcionario/ficha/' + f.id" class="btn btn-sm btn-outline-secondary">
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </RouterLink>
              </td>
            </tr>
            <tr v-if="filtrar().length === 0">
              <td colspan="6" class="text-center text-muted py-5">
                <font-awesome-icon icon="fa-solid fa-inbox" class="d-block mx-auto mb-2 fs-3" />
                Nenhum funcionário encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
