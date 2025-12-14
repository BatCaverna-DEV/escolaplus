<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const id = route.params.id;

  const url = `${import.meta.env.VITE_API_BASE}/aluno/imprimir/${id}`;

  window.open(url, "_blank");

  // opcional: volta para a página anterior
  router.back();
});
</script>

<template>
  <div class="text-center mt-5">
    <p>Gerando relatório...</p>
  </div>
</template>
