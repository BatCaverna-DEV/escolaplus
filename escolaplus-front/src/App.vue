<script setup>
  import { RouterView } from 'vue-router'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap/dist/js/bootstrap.bundle.js'
  import NavAdmin from "@/components/NavAdmin.vue";
</script>

<template>
  <NavAdmin></NavAdmin>
  <RouterView />
</template>

<style scoped>

</style>
