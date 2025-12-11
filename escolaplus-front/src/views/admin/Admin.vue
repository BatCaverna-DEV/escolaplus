<script setup>
  import {getUser} from "@/services/token.js";
  import {apiFetch} from "@/services/http.js";
  import {onMounted, ref} from "vue";

  const playload = getUser()
  const perfil = ref({})

  onMounted(async () => {
    let resposta = await apiFetch('/funcionario/get/'+playload.funcionario_id);
    perfil.value = await resposta.json();
  })


</script>

<template>
  <h3>Bem Vindo {{perfil.nome}}</h3>
</template>

<style scoped>

</style>