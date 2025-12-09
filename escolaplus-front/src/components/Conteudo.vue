<script setup>

import Menu from "@/components/Menu.vue";
import {RouterView} from "vue-router";
import {getUser} from "@/services/token.js";

const user = getUser();

</script>

<template>
  <div class="row p-0 m-0" v-if="user">
    <div class="col-sm-2 p-0">
      <Menu v-if="user"></Menu>
    </div>
    <div class="col-sm-10 p-3">
      <RouterView/>
    </div>
  </div>

  <div v-if="!user">
    <RouterView/>
  </div>
</template>

<style scoped>

</style>