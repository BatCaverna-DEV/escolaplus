<script setup>

  import NavAdmin from "@/components/NavAdmin.vue";
  import {ref, onMounted} from "vue";
  import {apiFetch} from "@/services/http.js";
  import {dataBrasil} from "@/services/format.js";

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
          <a class="btn btn-primary mx-1" href="/aluno/cadastrar">Novo</a>
          <a class="btn btn-secondary mx-1" href="/admin">Voltar</a>
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

    <table class="table table-striped">
      <thead>
        <tr>
          <th></th>
          <th>DADOS PRINCIPAIS</th>
          <th>STATUS</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="aluno in alunos">
          <td>
            <img :src="aluno.foto" width="50px">
          </td>
          <td>
            <h5>
              <RouterLink :to="'/aluno/ficha/'+aluno.id" class="text-decoration-none">{{aluno.nome}}</RouterLink>
            </h5>
            <div>MATRÍCULA: </div>
            <div>NASCIMENTO: {{dataBrasil(aluno.nascimento)}}</div>
          </td>
          <td>{{ aluno.status }}</td>
          <td>
            <RouterLink :to="'/aluno/ficha/'+aluno.id" class="btn btn-sm btn-outline-secondary">Abrir</RouterLink>
          </td>
        </tr>
      </tbody>
    </table>

  </div> <!-- FIM DA DIV MAIOR -->

</template>

<style scoped>

</style>