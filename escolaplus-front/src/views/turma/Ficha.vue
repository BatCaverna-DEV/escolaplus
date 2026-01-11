<script setup>

import {apiFetch} from "@/services/http.js";
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {dataBrasil, statusPadrao} from "@/services/format.js";

const route = useRoute();
const turma = ref({})
const diarios = ref([])
const matriculas = ref([])
const id = route.params.id;

onMounted(async() => {
  const resposta = await apiFetch(`/turma/get/${id}`);
  turma.value = await resposta.json();

  const resposta2 = await apiFetch(`/turma/diarios/${id}`);
  diarios.value = await resposta2.json()

  const resposta3 = await apiFetch(`/turma/matriculas/${id}`);
  matriculas.value = await resposta3.json()
})

</script>

<template>
  <div class="container-fluid shadow">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <h4>Turma - {{turma.descricao}} </h4>
        <span>
          <RouterLink class="btn btn-outline-primary mx-1" :to="'/turma/editar/'+turma.id">
            <font-awesome-icon icon="fa-solid fa-pen-to-square"/> Editar
          </RouterLink>
          <RouterLink class="btn btn-outline-secondary mx-1" :to="'/turma/principal'">
            <font-awesome-icon icon="fa-solid fa-caret-left"/> Voltar
          </RouterLink>
        </span>
      </div>
    </nav>

    <div class="row p-1">
      <div class="col-sm-2">
        <label for="sigla">SIGLA</label>
        <input type="text" id="sigla" :value="turma.sigla" class="form-control" disabled>
      </div>
      <div class="col-sm-8">
        <label for="descricao">DESCRIÇÃO</label>
        <input type="text" id="descriao" :value="turma.descricao" class="form-control" disabled>
      </div>
      <div class="col-sm-2">
        <label for="status">STATUS</label>
        <input type="text" id="status" :value="statusPadrao(turma.status)" class="form-control" disabled>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-sm-2">
        <label for="qtd">QUANTIDADE DE ALUNOS</label>
        <input type="text" id="qtd" :value="matriculas.length" class="form-control" disabled>
      </div>
      <div class="col-sm-4">
        <label for="calendario">CALENDÁRIO</label>
        <input type="text" id="calendario" :value="turma.calendario?.descricao" class="form-control" disabled>
      </div>
      <div class="col-sm-2">
        <label for="calendario">ANO</label>
        <input type="text" id="calendario" :value="turma.calendario?.ano" class="form-control" disabled>
      </div>
    </div>

    <!-- INICIO DAS ABAS-->

    <ul class="nav nav-tabs mt-4 mb-2" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="diario-tab" data-bs-toggle="tab" data-bs-target="#diarios" type="button" role="tab">
          Diários da Turma
        </button>
      </li>

      <li class="nav-item" role="presentation">
        <button class="nav-link" id="matricula-tab" data-bs-toggle="tab" data-bs-target="#matriculas" type="button" role="tab">
          Alunos Matriculados
        </button>
      </li>

    </ul>

    <!--CONTEÚDO DAS ABAS -->
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" id="diarios" role="tabpanel">

        <div class="row my-3 p-1">
          <div class="col-sm-4 fw-bolder">DESCRIÇÃO</div>
          <div class="col-sm-4 fw-bolder">PROFESSOR</div>
          <div class="col-sm-3 fw-bolder">TURMA</div>
          <div class="col-sm-1"></div>
        </div>

        <div class="row mt-1 bg-body-tertiary p-2 selecionado" v-for="diario in diarios">
          <div class="col-sm-4">{{diario.descricao}}</div>
          <div class="col-sm-4">{{diario.professor?.nome}}</div>
          <div class="col-sm-3">{{diario.turma.descricao}}</div>

          <div class="col-sm-1 text-center d-flex justify-content-end">
            <RouterLink :to="'/turma/ficha/'+turma.id" class="btn btn-sm btn-outline-secondary text-decoration-none float-end">
              <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon>
            </RouterLink>
          </div>

        </div>

      </div> <!-- FIM DIV DIÁRIOS -->

      <div class="tab-pane fade" id="matriculas" role="tabpanel">

        <div class="row my-3 p-1">
          <div class="col-sm-2"></div>
          <div class="col-sm-2 fw-bolder">MATRICULA</div>
          <div class="col-sm-4 fw-bolder">NOME</div>
          <div class="col-sm-3 fw-bolder">NASCIMENTO</div>
          <div class="col-sm-1"></div>
        </div>

        <div class="row mt-1 bg-body-tertiary p-2 selecionado" v-for="matricula in matriculas">
          <div class="col-sm-2">
            <img :src="matricula.aluno.foto" width="50px">
          </div>
          <div class="col-sm-2">{{matricula.matricula}}</div>
          <div class="col-sm-4">{{matricula.aluno.nome}}</div>
          <div class="col-sm-3">{{dataBrasil(matricula.aluno.nascimento)}}</div>

          <div class="col-sm-1 text-center">
            <RouterLink target="_blank" :to="'/aluno/ficha/'+matricula.aluno.id" class="btn btn-sm btn-outline-secondary text-decoration-none float-end">
              <font-awesome-icon icon="fa-solid fa-eye"></font-awesome-icon>
            </RouterLink>
          </div>

        </div>

      </div> <!-- FIM DIV DIÁRIOS -->


    </div> <!-- FIM DA DIV DO CONTEÚDO -->

  </div> <!-- fim do container -->
</template>

<style scoped>

</style>