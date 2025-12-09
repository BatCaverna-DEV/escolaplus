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

      <div class="col-sm-9 p-2">
        <h3>Bem Vindo {{usuario.nome}}</h3>
        <div class="d-flex justify-content-end p-3 bg-light">
          <RouterLink to="/aluno/principal" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-user-graduate" /><br></br>Alunos</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-user-tie"/> Funcionários</RouterLink>
          <RouterLink to="/turma/principal" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-landmark"></font-awesome-icon><br></br>Turmas</RouterLink>
          <RouterLink to="/admin" class="btn btn-sm btn-outline-success me-2" style="width: 95px;"><font-awesome-icon icon="fa-solid fa-calendar-days"></font-awesome-icon><br>Ano Letivo</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>