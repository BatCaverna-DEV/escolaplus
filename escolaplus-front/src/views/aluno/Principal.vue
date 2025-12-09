<script setup>

  import NavAdmin from "@/components/NavAdmin.vue";
  import {ref, onMounted} from "vue";
  import {apiFetch} from "@/services/http.js";
  import {dataBrasil} from "@/services/format.js";
  import {statusAluno} from "@/services/format.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const alunos = ref([])

  onMounted(async () => {
    const resposta = await apiFetch('/aluno/listar')
    if(resposta.ok){
      alunos.value = await resposta.json()
    }
  })

</script>

<template>
  <NavAdmin></NavAdmin>
  <div class="container-sm shadow p-3">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h4>Alunos</h4>
        <span>
          <a class="btn btn-outline-primary mx-1" href="/aluno/cadastrar">
            <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon> Novo
          </a>
          <a class="btn btn-outline-secondary mx-1" href="/">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </a>
        </span>
      </div>
    </nav>

    <form >
      <fieldset>
        <legend>Filtro</legend>
        <div class="row">
          <div class="col-sm-8">
            <label for="nome">Nome do Aluno</label>
            <input type="text" id="nome" placeholder="Nome do aluno" class="form-control">
          </div>
          <div class="col-sm-4">
            <label for="">STATUS</label>
            <select id="status" class="form-select">
              <option value="0">Todos</option>
              <option value="1">Matriculados</option>
            </select>
          </div>
        </div>
      </fieldset>
    </form>

    <div class="row my-2">
      <div class="col-sm-2"></div>
      <div class="col-sm-7"><strong>DADOS PRINCIPAIS</strong></div>
      <div class="col-sm-2"><strong>STATUS</strong></div>
      <div class="col-sm-1"><strong>AÇÕES</strong></div>
    </div>

    <div class="row my-1 bg-body-secondary p-1" v-for="aluno in alunos">

      <div class="col-sm-2">
        <img :src="aluno.foto" width="100px" height="70px" class="rounded rounded-1">
      </div>

      <div class="col-sm-7">
        <h5>
          <RouterLink :to="'/aluno/ficha/'+aluno.id" class="text-decoration-none">{{aluno.nome}}</RouterLink>
        </h5>
        <div>MATRÍCULA: </div>
        <div>NASCIMENTO: {{dataBrasil(aluno.nascimento)}}</div>
      </div>

      <div class="col-sm-2 pt-4">
        <span :class="['mt-3',
            {
              'text-danger': aluno.status == 0,
              'text-success': aluno.status == 1,
              'fw-bolder': aluno.status == 1,
            }]">{{statusAluno(aluno.status)}}</span>

      </div>

      <div class="col-sm-1">
        <RouterLink :to="'/aluno/ficha/'+aluno.id" class="btn btn-outline-secondary text-decoration-none float-end mt-4">
          <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon>
        </RouterLink>
      </div>
    </div>

  </div> <!-- FIM DA DIV MAIOR -->

</template>

<style scoped>

</style>