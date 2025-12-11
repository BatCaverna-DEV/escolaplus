<script setup>

  import {ref, onMounted} from "vue";
  import {apiFetch} from "@/services/http.js";
  import {categoriaFuncionario, dataBrasil, statusPadrao} from "@/services/format.js";
  import {statusAluno} from "@/services/format.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const funcionarios = ref([])
  const buscar = ref('')
  const status = ref('0')

  onMounted(async () => {
    await listar()
  })

  async function listar(){
    const resposta = await apiFetch('/funcionario/listar')
    if(resposta.ok){
      funcionarios.value = await resposta.json()
    }
  }

  function filtrar(){
    var lista = funcionarios.value;
    if(buscar.value.length > 0){
      return lista = funcionarios.value.filter(funcionario => funcionario.nome.toLowerCase().includes(buscar.value.toLowerCase()));
    }
    return lista
  }

</script>

<template>
  <div class="container-fluid shadow p-3">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h3>Funcionários</h3>
        <span>
          <a class="btn btn-outline-primary mx-1" href="/funcionario/cadastrar">
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
            <label for="nome">Nome do Funcionario</label>
            <input v-model="buscar" type="text" id="nome" placeholder="Nome do Funcionário" class="form-control">
          </div>
        </div>
      </fieldset>
    </form>

    <div class="row my-2">
      <div class="col-sm-1"></div>
      <div class="col-sm-6"><strong>DADOS PRINCIPAIS</strong></div>
      <div class="col-sm-2 text-center"><strong>CATEGORIA</strong></div>
      <div class="col-sm-2 text-center"><strong>STATUS</strong></div>
      <div class="col-sm-1"><strong></strong></div>
    </div>

    <div class="row mt-1 rounded rounded-1 p-1 bg-body-tertiary" v-for="funcionario in filtrar()">

      <div class="col-sm-1 pt-1">
        <img :src="funcionario.foto" width="50px" class="">
      </div>

      <div class="col-sm-6">
        <h5>
          <RouterLink :to="'/funcionario/ficha/'+funcionario.id" class="text-decoration-none">{{funcionario.nome}}</RouterLink>
        </h5>
        <div>CPF: {{funcionario.cpf}}</div>

      </div>

      <div class="col-sm-2 pt-4">
        <p class="text-center">{{categoriaFuncionario(funcionario?.usuario?.categoria)}}</p>
      </div>

      <div class="col-sm-2 pt-4">
        <p :class="['text-center',
            {
              'text-danger': funcionario.status == 0,
              'text-success': funcionario.status == 1,
              'fw-bolder': funcionario.status == 1,
            }]">{{statusPadrao(funcionario.status)}}</p>

      </div>

      <div class="col-sm-1">
        <RouterLink :to="'/funcionario/ficha/'+funcionario.id" class="btn btn-outline-secondary text-decoration-none float-end mt-4">
          <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon>
        </RouterLink>
      </div>
    </div>

  </div> <!-- FIM DA DIV MAIOR -->

</template>

<style scoped>

</style>