<script setup>
  import {getUser} from "@/services/token.js";
  import Perfil from "@/components/Perfil.vue";

  const usuario = getUser()

</script>

<template>
  <h3>Bem Vindo {{usuario.nome}}</h3>
</template>

<style scoped>

</style>