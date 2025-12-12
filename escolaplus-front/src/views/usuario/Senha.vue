<script setup>

  import {getUser} from "@/services/token.js";
  import {ref} from "vue";
  import {apiFetch} from "@/services/http.js";
  import {useRouter} from "vue-router";

  const usuario = getUser();
  const dados = ref({senha: '', novasenha: '', repetida: '', usuario_id: usuario.usuario_id})
  const erro = ref('')
  const router = useRouter();

  async function alterarSenha(){

    try {
      let resposta = await apiFetch('/usuario/senha',{
        method: 'PUT',
        body: dados.value
      })

      if(resposta.ok){
        const msg = await resposta.json()
        if(resposta.status === 400){
          erro.value = msg.message
        }else{
          alert(msg.message)
          router.push('/')
        }
      }else{
        let msg = await resposta.json()
        erro.value = msg.message
      }

    }catch(err){
      erro.value = err.message;
    }

  }//Fim do alterar senha

</script>

<template>

  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Alterar Senha</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink to="/" class="btn btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>
            Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container-fluid" v-if="erro">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Atenção: </strong> {{ erro }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>

  <div class="container-fluid shadow-sm p-3">

    <form @submit.prevent="alterarSenha">
      <div class="row">
        <div class="col-md-3 mx-auto">
          <label for="senha">SENHA ATUAL</label>
          <input v-model="dados.senha" type="password" class="form-control" id="senha" placeholder="Digite seu senha" required>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mx-auto mt-4">
          <label for="novasenha">NOVA SENHA</label>
          <input v-model="dados.novasenha" type="password" class="form-control" id="novasenha" placeholder="Digite seu senha" required>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mx-auto mt-4">
          <label for="repetida">REPITA A SENHA</label>
          <input v-model="dados.repetida" type="password" class="form-control" id="repetida" placeholder="Repita a senha" required>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 mx-auto mt-4">
          <button type="submit" class="float-end btn btn-success">Salvar</button>
        </div>
      </div>
    </form>
  </div>


</template>

<style scoped>

</style>