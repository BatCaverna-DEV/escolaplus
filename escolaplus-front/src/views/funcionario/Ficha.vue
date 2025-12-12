<script setup>

  import {apiFetch} from "@/services/http.js";
  import {ref, onMounted} from "vue";
  import {useRoute} from "vue-router";
  import {categoriaFuncionario, statusPadrao} from "@/services/format.js";

  const route = useRoute();
  const funcionario = ref({});
  const salvando = ref(false);


  onMounted(async () => {
    await carregar()
  })

  async function carregar(){
    try{
      var id = route.params.id;
      var resposta = await apiFetch("/funcionario/get/"+id);
      funcionario.value = await resposta.json();
    }catch(err){
      alert(resposta.status + ' - '+err.message);
    }
  }

  async function resetarSenha(){
    try{
      salvando.value = true
      let resposta = await apiFetch('/usuario/acesso/'+funcionario.value.usuario_id)
      if(resposta.ok){
        let msg = await resposta.json();
        await carregar()
        salvando.value = false
        alert(msg.message);
      }
    }catch(err){
      alert(err.message);
    }
  }

</script>

<template>
  <div class="container-fluid">

    <nav class="navbar navbar-light bg-light p-3">
      <h3><i class="fas fa-user-graduate"></i>Ficha do Funcionario</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item" v-if="!salvando">
          <button @click="resetarSenha" class="btn btn-sm btn-warning me-1">
            <font-awesome-icon icon="fa-solid fa-key"/>
            Acesso
          </button>
        </li>
        <li class="nav-item">
          <RouterLink to="/funcionario/principal" class="btn btn-sm btn-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>
            Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="container-fluid mt-3" v-if="salvando">
      <h5 class="text-success text-center">Criando acesso para {{funcionario.nome}}</h5>
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="shadow p-3">
      <div class="row">
        <div class="col-sm-2 pt-3">
          <img :src="funcionario.foto" class="w-75 mx-auto d-block">
          <p class="text-center">
            <strong>
              <RouterLink :to="'/funcionario/foto/'+funcionario.id">Alterar Foto</RouterLink>
            </strong>
          </p>
        </div> <!-- Fim da Div da coluna da foto -->
        <div class="col-sm-10">

          <div class="row">
            <div class="col-sm-2">
              <label for="cpf">CPF</label>
              <input type="text" :value="funcionario.cpf" class="form-control" id="cpf" disabled>
            </div>
            <div class="col-sm-10">
              <label for="nome">NOME DO FUNCIONÁRIO</label>
              <input type="text" :value="funcionario.nome" class="form-control" id="nome" disabled>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-sm-2">
              <label for="telefone1">TELEFONE 1</label>
              <input type="text" :value="funcionario.telefone1" class="form-control" id="telefone1" disabled>
            </div>
            <div class="col-sm-2">
              <label for="telefone1">TELEFONE 2</label>
              <input type="text" :value="funcionario.telefone2" class="form-control" id="telefone2" disabled>
            </div>
            <div class="col-sm-8">
              <label for="email">E-MAIL</label>
              <input type="text" :value="funcionario.email" class="form-control" id="email" disabled>
            </div>
          </div>

          <div class="row mt-3"> <!-- div dados de usuários -->
            <hr>
            <h5>Dados de Usuário</h5>
            <div class="col-sm-3">
              <label for="username">NOME DE USUÁRIO</label>
              <input type="text" :value="funcionario?.usuario?.username" disabled class="form-control" id="username">
            </div>
            <div class="col-sm-3">
              <label for="categoria">CATEGORIA</label>
              <input type="text" :value="categoriaFuncionario(funcionario?.usuario?.categoria)"  disabled class="form-control" id="categoria">
            </div>
            <div class="col-sm-3">
              <label for="categoria">STATUS</label>
              <input type="text" :value="statusPadrao(funcionario?.usuario?.status)"  disabled class="form-control" id="status">
            </div>

          </div> <!-- fim dos dados de usuários -->

        </div> <!-- FIm da Div de dados -->



      </div> <!-- Fim da Div da Linha -->



    </div> <!-- FIm da Div do conteudo -->
  </div>
</template>

<style scoped>

</style>