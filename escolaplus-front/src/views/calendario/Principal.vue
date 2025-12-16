<script setup>

import {ref, onMounted} from 'vue'
import {apiFetch} from "@/services/http.js";
import {statusPadrao} from "@/services/format.js";
import AlertMessage from "@/components/AlertMessage.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const calendarios = ref({})
const status = ref(0)
const erro = ref('')

onMounted(async () => {
  await listar()
})

async function listar(){
  try{
    let resposta = await apiFetch('/calendario/listar')
    if(resposta.ok){
      calendarios.value = await resposta.json()
      if(calendarios.value[0].status > 0){
        status.value = calendarios.value[0].status
      }
    }else{
      let msg = await resposta.json()
      erro.value = msg.message
    }
  }catch(err){
    erro.value = err.message
  }
}

</script>

<template>
  <div class="container-fluid shadow p-3">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h4>Períodos Letivos</h4>
        <span>
          <RouterLink class="btn btn-primary mx-1" to="/" v-if="status === 0">
            <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon> Novo
          </RouterLink>

          <RouterLink class="btn btn-secondary mx-1" to="/">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </RouterLink>
        </span>
      </div>
    </nav>

    <AlertMessage :msg="erro" tipo="danger" v-if="erro"></AlertMessage>

    <div class="row my-3 p-1">
      <div class="col-sm-3 fw-bolder">DESCRIÇÃO</div>
      <div class="col-sm fw-bolder text-center">ANO</div>
      <div class="col-sm fw-bolder text-center">MÉDIA</div>
      <div class="col-sm fw-bolder text-center">ETAPAS</div>
      <div class="col-sm fw-bolder text-center">NOTAS</div>
      <div class="col-sm fw-bolder text-center">STATUS</div>
      <div class="col-sm"></div>
    </div>

    <div class="row mt-1 bg-body-tertiary p-2 selecionado" v-for="calendario in calendarios">

      <div class="col-sm-3">{{ calendario.descricao }}</div>
      <div class="col-sm text-center">{{ calendario.ano }}</div>
      <div class="col-sm text-center">{{ calendario.media }}</div>
      <div class="col-sm text-center">{{ calendario.etapas }}</div>
      <div class="col-sm text-center">{{ calendario.notas * 2 }}</div>
      <div class="col-sm text-center fw-bolder"
           :class="{'text-success': calendario.status === 1, 'text-danger': calendario.status === 0}">
        {{ statusPadrao(calendario.status) }}
      </div>

      <div class="col-sm text-center d-flex justify-content-end">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <font-awesome-icon icon="fa-solid fa-bars"></font-awesome-icon>
          </button>
          <ul class="dropdown-menu">
            <li>
              <RouterLink class="dropdown-item" to="#">
                <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon> Editar
              </RouterLink>
            </li>
            <div class="dropdown-divider"></div>
            <li>
              <RouterLink class="dropdown-item" to="#">
                <font-awesome-icon icon="fa-solid fa-circle-xmark"></font-awesome-icon> Fechar
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

    </div>

  </div> <!-- Fim do Container -->
</template>

<style scoped>

</style>