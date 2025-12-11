<script setup>
import { RouterLink } from "vue-router";
import {onMounted, ref} from "vue";
import {getUser} from "@/services/token.js";
import {apiFetch} from "@/services/http.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const playload = getUser();
const perfil = ref({});

onMounted(async () => {
  let resposta = await apiFetch('/funcionario/get/'+playload.funcionario_id);
  perfil.value = await resposta.json();
})

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

          <div class="dropdown" v-if="playload">
            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon icon="fa-solid fa-circle-user"></font-awesome-icon>
<!--              {{user.username}}-->
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <RouterLink class="dropdown-item" :to="'/funcionario/ficha/'+playload.funcionario_id">
                  <font-awesome-icon icon="fa-solid fa-address-card"></font-awesome-icon> Meus Dados
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="#">
                  <font-awesome-icon icon="fa-solid fa-key"></font-awesome-icon> Alterar a senha
                </RouterLink>
              </li>
              <div class="dropdown-divider"></div>
              <li>
                <RouterLink class="dropdown-item" to="/logout">
                  <font-awesome-icon icon="fa-solid fa-power-off"></font-awesome-icon> Sair
                </RouterLink>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  </div>

</template>

