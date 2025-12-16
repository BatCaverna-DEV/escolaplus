<script setup>
import {RouterLink, useRouter} from 'vue-router';
import {getUser} from "@/services/token.js";
import {ref, onMounted} from "vue";
import {apiFetch} from "@/services/http.js";
import {categoriaFuncionario} from "@/services/format.js";
import {useRoute} from "vue-router";

const usuario = getUser();
const perfil = ref({})
const route = useRoute();

onMounted(async () => {
  let resposta = await apiFetch('/funcionario/get/' + usuario.funcionario_id);
  perfil.value = await resposta.json();
})

</script>

<template>
  <div style="height: 93vh" class="bg-body-secondary">

    <div class="d-flex flex-column flex-shrink-0 p-3 m-0">
      <div class="mx-auto">
        <RouterLink class="nav-link" to="/">
          <img width="150" src="../assets/logo.png">
        </RouterLink>
      </div>
      <img class="rounded-1 mt-5 mx-auto d-flex"
           :src="perfil.foto"
           width="100px;">
      <h5 class="text-center">
        <RouterLink class="text-decoration-none" :to="'/funcionario/ficha/'+perfil.id">{{ perfil.nome }}</RouterLink>
      </h5>
      <h5 class="text-center">{{ categoriaFuncionario(perfil?.usuario?.categoria) }}</h5>

      <hr>

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item border-bottom py-1">
          <RouterLink
              to="/"
              class="nav-link text-black"
              :class="{ active: route.path === '/' }"
              aria-current="page"
          >
            <font-awesome-icon icon="fas fa-home"></font-awesome-icon>
            Início
          </RouterLink>
        </li>

        <li class="nav-item border-bottom py-1">
          <RouterLink
              to="/aluno/principal"
              class="nav-link text-black"
              :class="{ active: route.path.startsWith('/aluno') }"
          >
            <font-awesome-icon icon="fas fa-user-graduate"></font-awesome-icon>
            Alunos
          </RouterLink>
        </li>

        <li class="nav-item border-bottom py-1">
          <RouterLink
              to="/turma/principal"
              class="nav-link text-black"
              :class="{ active: route.path.startsWith('/turma') }"
          >
            <font-awesome-icon icon="fa-solid fa-landmark"></font-awesome-icon>
            Turmas
          </RouterLink>
        </li>

        <li class="nav-item border-bottom py-1">
          <RouterLink
              to="/funcionario/principal"
              class="nav-link text-black"
              :class="{ active: route.path.startsWith('/funcionario') && !route.path.startsWith('/funcionario/ficha') }"
          >
            <font-awesome-icon icon="fa-solid fa-user-tie"/>
            Funcionários
          </RouterLink>
        </li>

        <li class="nav-item border-bottom py-1">
          <a href="/letivos/index" class="nav-link text-black">
            <font-awesome-icon icon="fa-solid fa-calendar-days"></font-awesome-icon>
            Ano Letivo
          </a>
        </li>

        <li class="nav-item border-bottom py-1">
          <RouterLink
              to="/logout"
              class="nav-link text-black"
              :class="{ active: route.path === '/logout' }"
          >
            <font-awesome-icon icon="fa-solid fa-power-off"></font-awesome-icon>
            Sair
          </RouterLink>
        </li>
      </ul>

      <hr>

    </div>
  </div>
</template>

<style scoped>
  .nav-link.active {
    background-color: darkgray !important; /* roxo */
    border-radius: 4px;
  }
</style>