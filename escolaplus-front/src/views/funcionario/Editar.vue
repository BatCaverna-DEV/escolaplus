<script setup>

import {ref, onBeforeUnmount, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {apiFetch} from "@/services/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

// v-model no componente: modelValue <-> update:modelValue
const erro = ref('')
const salvando = ref(false)
const router = useRouter()
const route = useRoute()

const funcionario = ref({
  id:'',
  nome: '',
  telefone1: '',
  telefone2: '',
  cpf: '',
  email: '',
})

async function salvar() {
  erro.value = ''
  salvando.value = true
  try {
    const resposta = await apiFetch('/funcionario/editar', {
      method: 'PUT',
      body: funcionario.value
    })
    if (resposta.ok) {
      const func = await resposta.json()
      alert('Funcionario editado com sucesso!')
      router.push('/funcionario/ficha/' + func.id)
    } else {
      const msg = await resposta.json()
      erro.value = `${resposta.status} - ${msg.message}`
      salvando.value = false
    }
  } catch (error) {
    salvando.value = false
    erro.value = error
  }
}//Fim do salvar

onMounted(async () => {
  try{
    let id = route.params.id
    let resposta = await apiFetch('/funcionario/get/'+id)
    if(resposta.ok) {
      const dados = await resposta.json()
      funcionario.value.id = dados.id
      funcionario.value.nome = dados.nome
      funcionario.value.telefone1 = dados.telefone1
      funcionario.value.telefone2 = dados.telefone2
      funcionario.value.cpf = dados.cpf
      funcionario.value.email = dados.email
    }
  }catch(error){
    alert(error.message)
  }
})

</script>

<template>

  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Editar Dados de Funcionario - {{funcionario.nome}}</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink to="/funcionario/principal" class="btn btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>
            Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container-fluid mt-3" v-if="salvando">
    <h5 class="text-success text-center">Salvando os dados do funcionário</h5>
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <div class="container-fluid shadow-sm p-2" v-if="!salvando">

    <div v-if="erro" class="alert alert-danger" role="alert">
      <strong>ERRO: </strong> {{ erro }}
    </div>

    <form @submit.prevent="salvar">

      <div class="row mt-3">
        <div class="col-sm-2 form-group">
          <label for="cpf">CPF</label>
          <input v-mask="'###.###.###-##'" v-model="funcionario.cpf" type="text" class="form-control" disabled id="cpf"
                 required/>
        </div>
        <div class="col-sm-10 form-group">
          <label for="nome">NOME DO FUNCIONARIO</label>
          <input v-model="funcionario.nome" type="text" class="form-control" id="nome" required/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-2 form-group">
          <label for="telefone1">TELEFONE 1</label>
          <input v-mask="'(##) #####-####'" v-model="funcionario.telefone1" type="text" class="form-control"
                 id="telefone1" required/>
        </div>

        <div class="col-sm-2 form-group">
          <label for="telefone2">TELEFONE 2</label>
          <input v-mask="'(##) #####-####'" v-model="funcionario.telefone2" type="text" class="form-control"
                 id="telefone2"/>
        </div>

        <div class="col-sm-8 form-group">
          <label for="email">E-MAIL</label>
          <input v-model="funcionario.email" type="text" class="form-control" id="email" required/>
        </div>
      </div>

      <div class="row mt-3 d-flex justify-content-end">
        <div class="col-sm">
          <button type="submit" class="btn btn-success">Salvar</button>
        </div>
      </div>
    </form>

  </div> <!-- fim do container -->

</template>

<style scoped>

</style>