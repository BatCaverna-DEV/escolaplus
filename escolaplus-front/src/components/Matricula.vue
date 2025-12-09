<script setup>

  import {dataBrasil} from "@/services/format.js";
  import {apiFetch} from "@/services/http.js";
  import {onMounted, ref} from "vue";

  const props = defineProps({
    aluno: Object
  })
  const emit = defineEmits(['fechar'])

  const turmas = ref({})

  onMounted(async () => {
    const resposta1 = await apiFetch("/calendario/ativo");
    if (resposta1.status === 200) {
      const calendario = await resposta1.json()
      const resposta = await apiFetch(`/turma/listar/${calendario.id}`)
      turmas.value = await resposta.json()
    }

  })

</script>

<template>

    <!-- Modal -->
  <div class="modal fade show d-block shadow-sm ">
    <div class="modal-dialog ">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Matrícular Aluno</h5>
          <button type="button" class="btn-close" @click="emit('fechar')"></button>
        </div>

        <div class="modal-body">

          <div class="row">
            <div class="col-sm">
              <label for="nome">NOME DO ALUNO</label>
              <input type="text" :value="aluno.nome" disabled class="form-control"/>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-sm-6">
              <label for="nascimento">NASCIMENTO</label>
              <input type="text" :value="dataBrasil(aluno.nascimento)" disabled class="form-control"/>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-sm">
              <label for="turma">SELECIONE A TURMA</label>
              <select id="turma" class="form-select">
                <option :value="turma.id" v-for="turma in turmas">{{turma.descricao}}</option>
              </select>
            </div>
          </div>
          <!-- Aqui você coloca o restante dos formulários -->
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Matricular</button>
        </div>

      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show"></div>

</template>

<style scoped>

</style>