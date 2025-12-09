<script setup>
import { RouterLink } from "vue-router";
import {onMounted, ref} from "vue";
import {getUser} from "@/services/token.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const playload = getUser();
const user = ref({id: playload.id,nome: playload.nome, username: playload.username, email: playload.email});


</script>

<template>
  <div class="container-fluid p-0 m-0">
    <nav class="navbar bg-success p-2 navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
<!--          <img src="#" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">-->
          EscolaPlus
        </a>
        <div class="">

          <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon icon="fa-solid fa-circle-user"></font-awesome-icon> {{user.nome.split(' ')[0]}}
<!--              {{user.username}}-->
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Meus Dados</a></li>
              <li><a class="dropdown-item" href="#">Esqueceu a senha</a></li>
              <hr class="dropdown-divider">
              <li><a class="dropdown-item" href="/logout">Sair</a></li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  </div>

</template>

