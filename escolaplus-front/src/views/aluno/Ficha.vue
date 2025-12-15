<script setup>

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {apiFetch} from "@/services/http.js";
import {dataBrasil, statusAluno, statusMatricula} from "@/services/format.js"
import Matricula from "@/components/Matricula.vue";

const route = useRoute();
const id = route.params.id;
const aluno = ref({})

const mostrarModalMatricula = ref(false)
const alunoSelecionado = ref(null)
const base_api = import.meta.env.VITE_API_BASE

function abrirMatricula(aluno) {
  alunoSelecionado.value = aluno
  mostrarModalMatricula.value = true
}

onMounted(async () => {
  const resposta = await apiFetch('/aluno/get/'+id)
  aluno.value = await resposta.json()
})

const baixar = async () => {
  const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/impressao/ficha/${aluno.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("escola_token")}`
        }
      }
  );

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "ficha-"+aluno.value.nome+".pdf";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

</script>

<template>
  <Matricula
      v-if="mostrarModalMatricula"
      :aluno="alunoSelecionado"
      @fechar="mostrarModalMatricula = false"
  />
  <div class="container-fluid">

    <nav class="navbar navbar-light bg-light p-3">
      <h3><i class="fas fa-user-graduate"></i>Ficha do Aluno</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item" v-if="aluno.status == 0">
<!--          <RouterLink :to="'/aluno/matricular/'+aluno.id" class="btn btn-sm btn-warning mx-1">Matricular</RouterLink>-->
          <button @click="abrirMatricula(aluno)" class="btn btn-sm btn-warning mx-1">
            Matrícular
          </button>
        </li>
        <li class="nav-item me-1">
            <button class="btn btn-sm btn-success" @click="baixar" v-if="aluno.status == 1">
              <font-awesome-icon icon="fa-solid fa-print"></font-awesome-icon> Ficha
            </button>
        </li>
        <li class="nav-item me-1" v-if="aluno.status == 1">
          <RouterLink to="/aluno/principal" class="btn btn-sm btn-success">
            <font-awesome-icon icon="fa-solid fa-print"></font-awesome-icon> Boletim
          </RouterLink>
        </li>
        <li class="nav-item me-1">
          <RouterLink :to="'/aluno/editar/'+aluno.id" class="btn btn-sm btn-primary">
            <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon> Editar
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/aluno/principal" class="btn btn-sm btn-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/> Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="shadow p-3">
      <div class="row">
        <div class="col-sm-2 pt-3">
          <img :src="aluno.foto" class="w-75 mx-auto d-block">
          <p class="text-center">
            <strong><RouterLink :to="'/aluno/foto/'+aluno.id">Alterar Foto</RouterLink></strong>
          </p>
        </div>
        <div class="col-sm-10">

          <div class="row">
            <div class="col-sm-7">
              <label for="nome">NOME DO ALUNO</label>
              <input :value="aluno.nome" type="text" class="form-control" id="nome" disabled="disabled" />
            </div>
            <div class="col-sm-3">
              <label for="nascimento">NASCIMENTO</label>
              <input :value="dataBrasil(aluno.nascimento)" type="text" class="form-control" id="nascimento" disabled="disabled" />
            </div>
            <div class="col-sm-2">
              <label for="status">STATUS</label>
              <input :value="statusAluno(aluno.status)" type="text" class="form-control" id="status" disabled="disabled" />
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-sm-2">
              <label for="cep">CEP</label>
              <input :value="aluno.cep" type="text" class="form-control" id="cep" disabled="disabled" />
            </div>
            <div class="col-sm-8">
              <label for="endereco">ENDEREÇO</label>
              <input :value="aluno.endereco" type="text" class="form-control" id="endereco" disabled="disabled" />
            </div>
            <div class="col-sm-2">
              <label for="numero">NÚMERO</label>
              <input :value="aluno.numero" type="text" class="form-control" id="numero" disabled="disabled" />
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-sm-4">
              <label for="bairro">BAIRRO</label>
              <input :value="aluno.bairro" type="text" class="form-control" id="bairro" disabled="disabled" />
            </div>
            <div class="col-sm-4">
              <label for="cidade">CIDADE</label>
              <input :value="aluno.cidade" type="text" class="form-control" id="cidade" disabled="disabled" />
            </div>
            <div class="col-sm-4">
              <label for="estado">ESTADO</label>
              <input :value="aluno.estado" type="text" class="form-control" id="estado" disabled="disabled" />
            </div>
          </div>

        </div>

        <div class="row mt-3">
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 1</label>
            <input :value="aluno.telefone1" type="text" class="form-control" id="telefone1" disabled="disabled" />
          </div>
          <div class="col-sm-2">
            <label for="telefone2">TELEFONE 2</label>
            <input :value="aluno.telefone2" type="text" class="form-control" id="telefone2" disabled="disabled" />
          </div>
          <div class="col-sm-2">
            <label for="telefone3">TELEFONE 3</label>
            <input :value="aluno.telefone3" type="text" class="form-control" id="telefone3" disabled="disabled" />
          </div>
          <div class="col-sm-6">
            <label for="email">E-MAIL</label>
            <input :value="aluno.email" type="text" class="form-control" id="email" disabled="disabled" />
          </div>
        </div>

        <!-- INICIO DAS ABAS-->

        <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="matricula-tab" data-bs-toggle="tab" data-bs-target="#matricula" type="button" role="tab">
              Dados de Matrícula
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link" id="pais-tab" data-bs-toggle="tab" data-bs-target="#pais" type="button" role="tab">
              Dados dos Pais
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link" id="outros-tab" data-bs-toggle="tab" data-bs-target="#outros" type="button" role="tab">
              Outros Dados
            </button>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">

          <div class="tab-pane fade show active" id="matricula" role="tabpanel">
            <table class="table table-striped">
              <thead>
              <tr>
                <th>MATRÍCULA</th>
                <th>TURMA</th>
                <th>STATUS</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="matricula in aluno.matriculas">
                <td>{{matricula.matricula}}</td>
                <td> {{matricula.turma?.descricao}}</td>
                <td>{{ statusMatricula(matricula.status) }}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="tab-pane fade" id="pais" role="tabpanel">

            <div class="row mt-3">
              <div class="col-sm-10">
                <label for="pai">NOME DO PAI</label>
                <input :value="aluno.pai" type="text" class="form-control" id="pai" disabled="disabled" />
              </div>
              <div class="col-sm-2">
                <label for="cpf_pai">CPF DO PAI</label>
                <input :value="aluno.cpf_pai" type="text" class="form-control" id="cpf_pai" disabled="disabled" />
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-sm-10">
                <label for="pai">NOME DA MÃE</label>
                <input :value="aluno.mae" type="text" class="form-control" id="mae" disabled="disabled" />
              </div>
              <div class="col-sm-2">
                <label for="cpf_pai">CPF DA MÃE</label>
                <input :value="aluno.cpf_mae" type="text" class="form-control" id="cpf_mae" disabled="disabled" />
              </div>
            </div>

          </div> <!-- Fim da Aba dos Pais -->

          <div class="tab-pane fade" id="outros" role="tabpanel">
            <p> <span class="border border-1 p-1 bg-body-secondary">{{aluno.saude}}</span> - Tem plano de saúde?  </p>
            <p> <span class="bg-body-secondary border border-1 p-1">{{aluno.hospital}}</span> - Em caso de problemas de saúde ou acidentes pode levar para o hospital público  </p>
            <p> <span class="border border-1 p-1 bg-body-secondary">{{aluno.redes}}</span> - A imagem da criança poderá ser usada nas redes sociais? </p>

            <p><strong>Observações</strong></p>
            <div class="bg-body-tertiary">
              {{aluno.obs}}
            </div>
          </div>

        </div> <!-- FIM DA TAB DO CONTEÚDO -->

        <!-- FIM DAS ABAS-->

      </div><!-- Fim da Div da coluna -->
    </div>

  </div> <!-- FIM DA DIV MAIOR -->

</template>

<style scoped>

</style>