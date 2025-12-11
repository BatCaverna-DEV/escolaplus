<script setup>

import {apiFetch} from "@/services/http.js";
import {onMounted, ref} from "vue";

const calendario = ref({})
const turmas = ref([])

onMounted(async () => {
  const resposta = await apiFetch('/calendario/ativo')
  calendario.value = await resposta.json()

  const resposta2 = await apiFetch('/turma/listar/'+calendario.value.id)
  turmas.value = await resposta2.json()

})

</script>

<template>
  <div class="container-fluid shadow p-3">

    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h4>Turmas - {{calendario.descricao}}</h4>
        <span>
          <a class="btn btn-outline-secondary mx-1" href="/">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </a>
        </span>
      </div>
    </nav>

    <div class="row my-3 p-1">
      <div class="col-sm-2 fw-bolder">SIGLA</div>
      <div class="col-sm-7 fw-bolder">DESCRIÇÃO</div>
      <div class="col-sm-2 fw-bolder">CALENDÁRIO</div>
      <div class="col-sm-1"></div>
    </div>

    <div class="row mt-1 bg-body-tertiary p-2 selecionado" v-for="turma in turmas">

      <div class="col-sm-2">{{ turma.sigla }}</div>
      <div class="col-sm-7">{{ turma.descricao }}</div>
      <div class="col-sm-2">{{turma.calendario.ano}}</div>

      <div class="col-sm-1 text-center d-flex justify-content-end">
        <RouterLink :to="'/turma/ficha/'+turma.id" class="btn btn-sm btn-outline-secondary text-decoration-none float-end">
          <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon>
        </RouterLink>
      </div>

    </div>

  </div> <!-- Fim da DIV Maior -->

</template>

<style scoped>

.selecionado:hover{
  background-color: darkgray !important;
}

</style>