<script setup>
import Menu from "@/components/Menu.vue";
import { RouterView } from "vue-router";
import { getUser } from "@/services/token.js";

const user = getUser();
</script>

<template>
  <div class="d-flex" v-if="user">
    <div class="ep-sidebar-wrapper">
      <Menu></Menu>
    </div>
    <main class="ep-content flex-grow-1">
      <RouterView />
    </main>
  </div>

  <div v-if="!user">
    <RouterView />
  </div>
</template>

<style scoped>
.ep-sidebar-wrapper {
  width: var(--ep-sidebar-w, 220px);
  flex-shrink: 0;
}

.ep-content {
  min-width: 0;
  padding: 1.25rem 1.5rem;
  background: var(--ep-bg, #f3f6f9);
  min-height: calc(100vh - var(--ep-navbar-h, 52px));
}
</style>
