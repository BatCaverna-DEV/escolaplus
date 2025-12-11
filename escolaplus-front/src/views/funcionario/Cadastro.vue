<script setup>

import {ref, onBeforeUnmount, computed} from 'vue'
import {useRouter} from 'vue-router'
import {apiFetch} from "@/services/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

// v-model no componente: modelValue <-> update:modelValue
const erro = ref('')

const router = useRouter()
const funcionario = ref({
  nome: '',
  telefone1: '',
  telefone2: '',
  cpf: '',
  email: '',
  categoria: '',
})

async function salvar() {
  erro.value = ''
  try{
    const resposta = await apiFetch('/funcionario/salvar', {
      method: 'POST',
      body: funcionario.value
    })
    if(resposta.ok){
      const func = await resposta.json()
      alert(func.message)
      router.push('/funcionario/ficha/'+func.id)
    }else{
      const msg = await resposta.json()
      erro.value = `${resposta.status} - ${msg.message}`
    }
  }catch(error){
    erro.value = error
  }
}//Fim do salvar

</script>

<template>

  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Cadastro de Funcionario</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink to="/funcinario/principal" class="btn btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>
            Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container-fluid shadow-sm p-2">

    <div v-if="erro" class="alert alert-danger" role="alert">
      <strong>ERRO: </strong> {{ erro }}
    </div>

    <form @submit.prevent="salvar">

      <div class="row mt-3">
        <div class="col-sm-2 form-group">
          <label for="cpf">CPF</label>
          <input v-mask="'###.###.###-##'" v-model="funcionario.cpf" type="text" class="form-control" id="cpf" required/>
        </div>
        <div class="col-sm-10 form-group">
          <label for="nome">NOME DO FUNCIONARIO</label>
          <input v-model="funcionario.nome" type="text" class="form-control" id="nome" required/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-2 form-group">
          <label for="telefone1">TELEFONE 1</label>
          <input v-mask="'(##) #####-####'" v-model="funcionario.telefone1" type="text" class="form-control" id="telefone1" required/>
        </div>

        <div class="col-sm-2 form-group">
          <label for="telefone2">TELEFONE 2</label>
          <input v-mask="'(##) #####-####'" v-model="funcionario.telefone2" type="text" class="form-control" id="telefone2" required/>
        </div>

        <div class="col-sm-8 form-group">
          <label for="email">E-MAIL</label>
          <input v-model="funcionario.email" type="text" class="form-control" id="email" required/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-4">
          <label for="categoria">CATEGORIA</label>
          <select id="categoria" class="form-select" required v-model="funcionario.categoria">
            <option value="0">Secretaria</option>
            <option value="1">Docente</option>
          </select>
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