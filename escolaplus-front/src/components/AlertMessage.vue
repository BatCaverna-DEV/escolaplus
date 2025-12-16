<script setup>

  const props = defineProps({
    msg: {
      type: String,
      default: ''
    },
    tipo: {
      type: String,
      default: 'info'
      // success | danger | warning | info | primary | secondary
    }
  })

</script>

<template>

  <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="tipo==='danger'">
    <strong>ERRO: </strong> {{ msg }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

  <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="tipo==='warning'">
    <strong>ATENÇÃO: </strong> {{ msg }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

</template>

<style scoped>

</style>