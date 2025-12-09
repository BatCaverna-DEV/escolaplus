<script setup>

  import {dataBrasil} from "@/services/format.js";
  import {apiFetch} from "@/services/http.js";
  import {onMounted, ref} from "vue";
  import {useRouter} from "vue-router";

  const props = defineProps({
    aluno: Object
  })
  const emit = defineEmits(['fechar'])
  const router = useRouter()

  const turmas = ref({})
  const matricula = ref({aluno_id: props.aluno.id, turma_id: ''})

  onMounted(async () => {

    const resposta1 = await apiFetch("/calendario/ativo");
    if (resposta1.status === 200) {
      const calendario = await resposta1.json()
      const resposta = await apiFetch(`/turma/listar/${calendario.id}`)
      turmas.value = await resposta.json()
    }

  })

  async function salvar() {
    try{
      const resposta = await apiFetch('/aluno/matricular', {
        method: "POST",
        body: matricula.value,
      })

      if(resposta.ok){
        const aluno = await resposta.json()
        alert(aluno.message)
        emit("fechar")
        window.location.reload()
      }else{
        const msg = await resposta.json()
        alert(`${resposta.status} - ${msg.message}`)
      }
    }catch(error){
      alert(error.message)
    }


  }

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
        <form @submit.prevent="salvar">
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
                <select id="turma" class="form-select" v-model="matricula.turma_id" required>
                  <option :value="turma.id" v-for="turma in turmas">{{turma.descricao}}</option>
                </select>
              </div>
            </div>
            <!-- Aqui você coloca o restante dos formulários -->
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Matricular</button>
          </div>

        </form>



      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show"></div>

</template>

<style scoped>

</style>