<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { getUser } from "@/services/token.js";

const usuario = ref(getUser());
</script>

<template>
  <nav class="ep-navbar navbar navbar-dark px-3 py-0">
    <a class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5" href="/">
      <font-awesome-icon icon="fa-solid fa-graduation-cap" />
      EscolaPlus
    </a>

    <div v-if="usuario">
      <div class="dropdown">
        <button
          class="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 py-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div class="ep-avatar-sm">{{ usuario.nome.charAt(0) }}</div>
          <span class="d-none d-md-inline small fw-semibold">{{ usuario.nome.split(' ')[0] }}</span>
          <font-awesome-icon icon="fa-solid fa-chevron-down" class="small opacity-75" />
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1">
          <li>
            <div class="dropdown-header text-muted small py-1">{{ usuario.nome }}</div>
          </li>
          <li><hr class="dropdown-divider my-1"></li>
          <li>
            <RouterLink class="dropdown-item py-2" :to="'/funcionario/ficha/' + usuario.funcionario_id">
              <font-awesome-icon icon="fa-solid fa-address-card" class="me-2 text-muted" />
              Meus Dados
            </RouterLink>
          </li>
          <li>
            <RouterLink class="dropdown-item py-2" to="/usuario/senha">
              <font-awesome-icon icon="fa-solid fa-key" class="me-2 text-muted" />
              Alterar Senha
            </RouterLink>
          </li>
          <li><hr class="dropdown-divider my-1"></li>
          <li>
            <RouterLink class="dropdown-item py-2 text-danger" to="/logout">
              <font-awesome-icon icon="fa-solid fa-power-off" class="me-2" />
              Sair
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.ep-navbar {
  height: var(--ep-navbar-h, 52px);
  background-color: var(--ep-green-dark, #14532d);
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .25);
}

.ep-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .2);
  color: #fff;
  font-weight: 700;
  font-size: .85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255,255,255,.35);
}
</style>
