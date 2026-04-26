<script setup>
import {RouterView} from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import NavAdmin from "@/components/NavAdmin.vue";
import {useRoute} from "vue-router";
import {getUser} from "@/services/token.js";
import {ref} from "vue";
import Conteudo from "@/components/Conteudo.vue";
const route = useRoute();
const user = ref(getUser());
</script>

<template>
  <div class="app-wrapper">
    <NavAdmin :key="route.fullPath"></NavAdmin>
    <Conteudo :key="route.fullPath"></Conteudo>
  </div>
</template>

<style>
/* ── Variáveis globais EscolaPlus ── */
:root {
  --ep-green:        #1a6b3c;
  --ep-green-dark:   #14532d;
  --ep-green-light:  #d1fae5;
  --ep-sidebar-w:    220px;
  --ep-navbar-h:     52px;
  --ep-bg:           #f3f6f9;
}

body { background-color: var(--ep-bg); }

/* ── Page header padrão ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: .75rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #dee2e6;
}
.page-header .page-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}
.page-actions { display: flex; gap: .4rem; align-items: center; }

/* ── Cabeçalho de seção dentro de card ── */
.section-title {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #6c757d;
  margin-bottom: .6rem;
}

/* ── Tabelas ── */
.table thead th {
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #6c757d;
  font-weight: 700;
  background-color: #f8f9fa;
  border-bottom-width: 2px;
}

/* ── Foto avatar ── */
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

/* ── Badges de status ── */
.badge-ativo   { background: #d1fae5; color: #065f46; font-weight: 600; }
.badge-inativo { background: #fee2e2; color: #991b1b; font-weight: 600; }

/* ── Cards suaves ── */
.card { border-radius: .75rem !important; }
.card-header {
  background: transparent !important;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  font-size: .85rem;
  color: #374151;
}
</style>
