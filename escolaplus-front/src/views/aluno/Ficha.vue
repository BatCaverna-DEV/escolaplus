<script setup>

import NavAdmin from "@/components/NavAdmin.vue";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {apiFetch} from "@/services/http.js";
import {dataBrasil} from "@/services/format.js"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Matricula from "@/components/Matricula.vue";

const route = useRoute();
const id = route.params.id;
const aluno = ref({})

const mostrarModalMatricula = ref(false)
const alunoSelecionado = ref(null)


onMounted(async () => {
  const resposta = await apiFetch('/aluno/get/'+id)
  aluno.value = await resposta.json()
})

</script>

<template>
  <NavAdmin></NavAdmin>
  <div class="container-sm">
    <nav class="navbar navbar-light bg-light p-3">
      <h3><i class="fas fa-user-graduate"></i>Ficha do Aluno</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Matricula
          </button>
        </li>
        <li class="nav-item">
          <RouterLink :to="'/aluno/editar/'+aluno.id" class="btn btn-sm btn-primary mx-1">Editar</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/aluno/principal" class="btn btn-sm btn-secondary">Voltar</RouterLink>
        </li>
      </ul>
    </nav>

    <div class="shadow p-3">
      <div class="row">
        <div class="col-sm-2 pt-3">
          <h5 class="text-center">Foto</h5>
          <img :src="aluno.foto" class="w-100">
        </div>
        <div class="col-sm-10">

          <div class="row">
            <div class="col-sm-9">
              <label for="nome">NOME DO ALUNO</label>
              <input :value="aluno.nome" type="text" class="form-control" id="nome" disabled="disabled" />
            </div>
            <div class="col-sm-3">
              <label for="nascimento">NASCIMENTO</label>
              <input :value="dataBrasil(aluno.nascimento)" type="text" class="form-control" id="nascimento" disabled="disabled" />
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

        <fieldset class="mt-3 border border-1 p-2">
          <legend>Dados dos Pais</legend>

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

        </fieldset>

        <div class="row">
          <div class="col-sm">
            <fieldset class="mt-3 border border-1 p-2">
              <legend>Outros Dados</legend>

              <p> Tem plano de saúde? <span class="border border-1 p-1">{{aluno.saude}}</span> </p>
              <p> Em caso de problemas de saúde ou acidentes pode levar para o hospital público <span class="border border-1 p-1">{{aluno.hospital}}</span> </p>
              <p> A imagem da criança poderá ser usada nas redes sociais? <span class="border border-1 p-1">{{aluno.redes}}</span></p>
            </fieldset>
          </div>

          <div class="col-sm">
            <fieldset class="mt-3 border border-1 p-2">
              <legend>Observações</legend>
              <div>
                {{aluno.obs}}
              </div>
            </fieldset>
          </div>
        </div>


    </div><!-- Fim da Div da coluna -->
    </div>

  </div> <!-- FIM DA DIV MAIOR -->
  <Matricula/>
</template>

<style scoped>

</style>