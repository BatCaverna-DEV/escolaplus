<script setup>

import {apiFetch} from "@/services/http.js";
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {dataBrasil, statusPadrao} from "@/services/format.js";

const route = useRoute();
const diario = ref([])
const id = route.params.id;

const carregando = ref(false)

onMounted(async () => {
  const resposta = await apiFetch(`/diario/get/${id}`);
  console.log(resposta);
  diario.value = await resposta.json();
})

</script>

<template>
  <div>
    <h4>DIARIO: {{diario.descricao}}</h4>
  </div>
</template>

<style scoped>

</style>