<script setup>
import { RouterLink } from 'vue-router';
import { getUser } from "@/services/token.js";
import { ref, onMounted, computed } from "vue";
import { apiFetch } from "@/services/http.js";
import { categoriaFuncionario } from "@/services/format.js";
import { useRoute } from "vue-router";

const usuario = getUser();
const perfil  = ref({});
const route   = useRoute();

const ehSecretaria = computed(() => Number(usuario?.categoria) === 1)
const ehProfessor  = computed(() => Number(usuario?.categoria) === 2)

onMounted(async () => {
  const resposta = await apiFetch('/funcionario/get/' + usuario.funcionario_id);
  perfil.value = await resposta.json();
});
</script>

<template>
  <aside class="ep-sidebar d-flex flex-column">

    <!-- Logo -->
    <div class="ep-sidebar-logo">
      <RouterLink to="/">
        <img src="../assets/logo.png" alt="EscolaPlus" class="img-fluid" style="max-height:48px;">
      </RouterLink>
    </div>

    <!-- Perfil do usuário -->
    <RouterLink
      :to="ehProfessor ? '/professor/principal' : '/funcionario/ficha/' + perfil.id"
      class="ep-profile text-decoration-none"
    >
      <div v-if="perfil.foto" class="ep-profile-photo-wrap">
        <img :src="perfil.foto" class="ep-profile-photo" alt="Foto">
      </div>
      <div v-else class="ep-profile-initial">{{ perfil.nome?.charAt(0) }}</div>
      <div class="ep-profile-info">
        <span class="ep-profile-name">{{ perfil.nome?.split(' ')[0] }}</span>
        <span class="ep-profile-role">{{ categoriaFuncionario(perfil?.usuario?.categoria) }}</span>
      </div>
    </RouterLink>

    <div class="ep-divider"></div>

    <!-- Navegação principal -->
    <nav class="ep-nav flex-grow-1">

      <!-- ── Secretaria ── -->
      <template v-if="ehSecretaria">
        <RouterLink to="/" class="ep-nav-link" :class="{ active: route.path === '/' }">
          <font-awesome-icon icon="fas fa-home" class="ep-nav-icon" />
          <span>Início</span>
        </RouterLink>
        <RouterLink to="/aluno/principal" class="ep-nav-link" :class="{ active: route.path.startsWith('/aluno') }">
          <font-awesome-icon icon="fas fa-user-graduate" class="ep-nav-icon" />
          <span>Alunos</span>
        </RouterLink>
        <RouterLink to="/turma/principal" class="ep-nav-link" :class="{ active: route.path.startsWith('/turma') }">
          <font-awesome-icon icon="fa-solid fa-landmark" class="ep-nav-icon" />
          <span>Turmas</span>
        </RouterLink>
        <RouterLink to="/funcionario/principal" class="ep-nav-link" :class="{ active: route.path.startsWith('/funcionario') }">
          <font-awesome-icon icon="fa-solid fa-user-tie" class="ep-nav-icon" />
          <span>Funcionários</span>
        </RouterLink>
        <RouterLink to="/calendario/principal" class="ep-nav-link" :class="{ active: route.path.startsWith('/calendario') }">
          <font-awesome-icon icon="fa-solid fa-calendar-days" class="ep-nav-icon" />
          <span>Ano Letivo</span>
        </RouterLink>
      </template>

      <!-- ── Professor ── -->
      <template v-else-if="ehProfessor">
        <RouterLink to="/professor/principal" class="ep-nav-link" :class="{ active: route.path.startsWith('/professor') }">
          <font-awesome-icon icon="fa-solid fa-book-open" class="ep-nav-icon" />
          <span>Meus Diários</span>
        </RouterLink>
        <RouterLink :to="'/funcionario/ficha/' + perfil.id" class="ep-nav-link" :class="{ active: route.path.startsWith('/funcionario/ficha') }">
          <font-awesome-icon icon="fa-solid fa-circle-user" class="ep-nav-icon" />
          <span>Minha Conta</span>
        </RouterLink>
      </template>

    </nav>

    <div class="ep-divider"></div>

    <!-- Sair -->
    <RouterLink to="/logout" class="ep-nav-link ep-nav-logout mb-2">
      <font-awesome-icon icon="fa-solid fa-power-off" class="ep-nav-icon" />
      <span>Sair</span>
    </RouterLink>

  </aside>
</template>

<style scoped>
.ep-sidebar {
  background-color: var(--ep-green, #1a6b3c);
  width: var(--ep-sidebar-w, 220px);
  height: calc(100vh - var(--ep-navbar-h, 52px));
  position: sticky;
  top: var(--ep-navbar-h, 52px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: .75rem .6rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.2) transparent;
}

.ep-sidebar-logo {
  text-align: center;
  padding: .25rem 0 .75rem;
}

/* Perfil */
.ep-profile {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .5rem .6rem;
  border-radius: .5rem;
  margin-bottom: .25rem;
  transition: background .15s;
}
.ep-profile:hover { background: rgba(255,255,255,.1); }

.ep-profile-photo-wrap {
  flex-shrink: 0;
}
.ep-profile-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,.35);
}
.ep-profile-initial {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,.3);
  flex-shrink: 0;
}
.ep-profile-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ep-profile-name {
  color: #fff;
  font-weight: 600;
  font-size: .88rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ep-profile-role {
  color: rgba(255,255,255,.6);
  font-size: .7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Divisor */
.ep-divider {
  border-top: 1px solid rgba(255,255,255,.15);
  margin: .5rem 0;
}

/* Links de nav */
.ep-nav {
  display: flex;
  flex-direction: column;
  gap: .1rem;
}
.ep-nav-link {
  display: flex;
  align-items: center;
  gap: .7rem;
  padding: .52rem .7rem;
  border-radius: .45rem;
  color: rgba(255,255,255,.8);
  text-decoration: none;
  font-size: .88rem;
  transition: background .15s, color .15s;
}
.ep-nav-link:hover {
  background: rgba(255,255,255,.12);
  color: #fff;
}
.ep-nav-link.active {
  background: rgba(255,255,255,.2);
  color: #fff;
  font-weight: 600;
}
.ep-nav-icon {
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

/* Logout */
.ep-nav-logout { color: rgba(255,160,160,.9) !important; }
.ep-nav-logout:hover {
  background: rgba(255,80,80,.15) !important;
  color: #ffaaaa !important;
}
</style>
