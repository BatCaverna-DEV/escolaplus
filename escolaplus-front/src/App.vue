<script setup>
import {RouterView} from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import NavAdmin from "@/components/NavAdmin.vue";
import {useRoute} from "vue-router";
import Menu from "@/components/Menu.vue";
import {getUser} from "@/services/token.js";
import Login from "@/views/usuario/Login.vue";
import {ref} from "vue";
import Conteudo from "@/components/Conteudo.vue";
const route = useRoute();
const user = ref(getUser());

</script>

<template>
  <div class="container-fluid p-0 m-0">
    <NavAdmin
        :key="route.fullPath"
    ></NavAdmin>
    <Conteudo :key="route.fullPath">

    </Conteudo>
  </div>

</template>

<style scoped>

</style>
