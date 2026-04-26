<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch } from "@/services/http.js";
import { setToken } from '@/services/auth.js'
import { getUser } from '@/services/token.js'

const router = useRouter()
const route  = useRoute()

const username = ref('')
const password = ref('')
const loading  = ref(false)
const erro     = ref('')

async function login() {
  erro.value    = ''
  loading.value = true
  try {
    const resposta = await apiFetch('/usuario/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    const token = await resposta.json()
    if (resposta.ok) {
      setToken(token.value)
      const user = getUser()
      const destino = route.query.redirect ?? (Number(user?.categoria) === 2 ? '/professor/principal' : '/')
      router.replace(destino)
    } else {
      erro.value = token.message
    }
  } catch (err) {
    erro.value = err.message || 'Falha no login!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="ep-login-bg">
    <div class="ep-login-card shadow-lg">

      <!-- Cabeçalho -->
      <div class="text-center mb-4">
        <img src="../../assets/logo.png" alt="EscolaPlus" class="ep-login-logo mb-3">
        <h5 class="fw-bold mb-1" style="color: var(--ep-green, #1a6b3c);">Acesso ao Sistema</h5>
        <p class="text-muted small mb-0">EscolaPlus — Gestão Escolar</p>
      </div>

      <!-- Alerta de erro -->
      <div v-if="erro" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3" role="alert">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="flex-shrink-0" />
        <span>{{ erro }}</span>
      </div>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label fw-semibold small mb-1">Usuário</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <font-awesome-icon icon="fa-solid fa-user" class="text-muted" />
            </span>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control border-start-0"
              placeholder="Nome de usuário"
              required
              autocomplete="username"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="password" class="form-label fw-semibold small mb-1">Senha</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <font-awesome-icon icon="fa-solid fa-lock" class="text-muted" />
            </span>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control border-start-0"
              placeholder="Sua senha"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <button :disabled="loading" class="btn btn-success w-100 py-2 fw-semibold">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>Entrando…
          </span>
          <span v-else>
            <font-awesome-icon icon="fa-solid fa-arrow-right-to-bracket" class="me-2" />Entrar
          </span>
        </button>

        <div class="text-center mt-3">
          <a href="#" class="text-muted small text-decoration-none">
            <font-awesome-icon icon="fa-solid fa-question-circle" class="me-1" />Esqueci minha senha
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.ep-login-bg {
  min-height: calc(100vh - var(--ep-navbar-h));
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #14532d 0%, #1a6b3c 45%, #22c55e 100%);
  padding: 1rem;
}

.ep-login-card {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
}

.ep-login-logo {
  max-height: 64px;
  max-width: 200px;
}

/* Remove a borda dupla entre input-group-text e input */
.input-group .form-control:focus { box-shadow: none; border-color: #86b7fe; }
.input-group:focus-within .input-group-text { border-color: #86b7fe; }
</style>
