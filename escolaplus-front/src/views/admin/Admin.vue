<script setup>
  import NavAdmin from "@/components/NavAdmin.vue";
  import {getUser} from "@/services/token.js";
  import Perfil from "@/components/Perfil.vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const usuario = getUser()

</script>

<template>
  <NavAdmin></NavAdmin>
  <div class="container-fluid">

    <div class="row">

      <div class="col-sm-3">
        <Perfil></Perfil>
      </div>

      <div class="col-sm-9">
        <div class="d-flex justify-content-end p-3 bg-light">
          <RouterLink to="/aluno/principal" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-user-graduate" /> Alunos</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-user-tie"/> Funcionários</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;">Turmas</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;">Diários</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;">Ano Letivo</RouterLink>
        </div>

        <h3>Bem Vindo {{usuario.nome}}</h3>
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>