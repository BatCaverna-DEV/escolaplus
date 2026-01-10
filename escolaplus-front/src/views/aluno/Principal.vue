<script setup>

  import {ref, onMounted} from "vue";
  import {apiFetch} from "@/services/http.js";
  import {dataBrasil} from "@/services/format.js";
  import {statusAluno} from "@/services/format.js";

  const alunos = ref([])
  const buscar = ref('')
  const status = ref('0')
  const carregando = ref(false)

  onMounted(async () => {
    carregando.value = true
    await inicializacao()
    carregando.value = false
  })

  async function inicializacao(){
    try{
      carregando.value = true
      const resposta = await apiFetch('/aluno/buscar', {
        method: 'POST',
        body: {
          chave: '',
          status: 1
        }
      })
      if(resposta.status == 200){
        alunos.value = await resposta.json()
      }
    }catch(error){
      alert(error.message)
    }
  }

  async function listar(){
    try{
      carregando.value = true
      const resposta = await apiFetch('/aluno/listar/'+buscar.value)
      if(resposta.ok){
        alunos.value = await resposta.json()
        carregando.value = false
      }else{
        const msg = resposta.json()
        alert(resposta.status + ' - '+msg.message)
        carregando.value = false
      }
    }catch(error){
      alert(error.message)
    }
  }

</script>

<template>
  <div class="container-fluid shadow p-3">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h4>Alunos</h4>
        <span>
          <RouterLink class="btn btn-outline-primary mx-1" to="/aluno/cadastrar">
            <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon> Novo
          </RouterLink>
          <RouterLink class="btn btn-outline-secondary mx-1" to="/">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </RouterLink>
        </span>
      </div>
    </nav>

    <form @submit.prevent="listar">
      <fieldset>
        <legend>Filtro</legend>
        <div class="row">
          <div class="col-sm-8">
            <label for="nome">Nome do Aluno</label>
            <input v-model="buscar" type="text" id="nome" placeholder="Nome do aluno" class="form-control">
          </div>
          <div class="col-sm-2">
            <label for="status">STATUS</label>
            <select name="" id="" class="form-select">
              <option value="1">Matriculados</option>
              <option value="0">Não Matriculados</option>
            </select>
          </div>
        </div>
      </fieldset>
    </form>

    <!-- Aviso de carregamento -->
    <div class="container-fluid mt-3" v-if="carregando">
      <h5 class="text-success text-center">Carregando alunos...</h5>
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="row my-2" v-if="!carregando && alunos.length > 0">
      <div class="col-sm-1"></div>
      <div class="col-sm-8"><strong>DADOS PRINCIPAIS</strong></div>
      <div class="col-sm-2"><strong>STATUS</strong></div>
      <div class="col-sm-1"><strong></strong></div>
    </div>

    <div class="row mt-1 rounded rounded-1 p-1 bg-body-tertiary" v-if="!carregando" v-for="aluno in alunos">

      <div class="col-sm-1 pt-1">
        <img :src="aluno.foto" width="50px" class="rounded rounded-1">
      </div>

      <div class="col-sm-8">
        <h5>
          <RouterLink :to="'/aluno/ficha/'+aluno.id" class="text-decoration-none">{{aluno.nome}}</RouterLink>
        </h5>
        <div>MATRÍCULA: {{aluno.matriculas?.[0]?.matricula}}</div>
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