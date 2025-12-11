<script setup>

  import { ref, onBeforeUnmount, computed } from 'vue'
  import {useRouter} from 'vue-router'
  import {apiFetch} from "@/services/http.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  // v-model no componente: modelValue <-> update:modelValue
  const erro = ref('')

  const router = useRouter()

  const aluno = ref({
    nome: '',
    matricula: '',
    cep:'',
    endereco:'',
    numero:'',
    bairro:'',
    cidade:'',
    estado:'',
    nascimento:'',
    pai: '',
    cpf_pai:'',
    mae:'',
    cpf_mae:'',
    telefone1:'',
    telefone2:'',
    telefone3:'',
    email:'',
    obs:'',
    saude:'',
    hospital:'',
    sozinho:'',
    alergia:'',
    redes:'',
    foto:null,
  })

  async function salvar(){
    erro.value = ''
    try{
      const resposta = await apiFetch('/aluno/salvar', {
        method: 'POST',
        body: aluno.value
      })
      if(resposta.ok){
        const aluno = await resposta.json()
        alert(aluno.message)
        router.push('/aluno/ficha/'+aluno.id)
      }else{
        const msg = await resposta.json()
        erro.value = `${resposta.status} - ${msg.message}`
      }
    }catch(error){
      erro.value = error
    }
  }

  async function buscarCep(){

    let cep = aluno.value.cep.replace('-','')
    const resposta = await fetch('https://viacep.com.br/ws/'+cep+'/json')
    const dados = await resposta.json()

    aluno.value.endereco = dados.logradouro
    aluno.value.bairro = dados.bairro
    aluno.value.cidade = dados.localidade
    aluno.value.estado = dados.estado

  }

  // Só a parte depois da vírgula (se quiser enviar pro backend)
  // const base64Puro = computed(() => {
  //   if (!fotoBase64.value) return ''
  //   return fotoBase64.value.split(',')[1]
  // })

</script>

<template>
  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Cadastro de Aluno</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink to="/aluno/principal" class="btn btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-caret-left"/>Voltar
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container-fluid">

    <div v-if="erro" class="alert alert-danger" role="alert">
      <strong>ERRO: </strong> {{ erro }}
    </div>

    <div class="row">
    <div class="col-sm shadow p-3">

      <form @submit.prevent="salvar">

      <div class="row">
        <div class="col-sm-9 form-group">
          <label for="nome">NOME DO ALUNO</label>
          <input v-model="aluno.nome" type="text" class="form-control" id="nome" placeholder="Nome do ALUNO" required/>
        </div>
        <div class="col-sm-3 form-group">
          <label for="nascimento">DATA DE NASCIMENTO</label>
          <input v-model="aluno.nascimento" type="date" class="form-control" id="nascimento" required/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-2 form-group">
          <label for="cep">CEP</label>
          <input v-mask="'#####-###'" v-model="aluno.cep" @change="buscarCep" type="text" class="form-control" id="cep" placeholder="CEP"/>
        </div>
        <div class="col-sm-8 form-group">
          <label for="endereco">ENDEREÇO</label>
          <input v-model="aluno.endereco" type="text" class="form-control" id="endereco" placeholder="Endereço do Aluno" required/>
        </div>
        <div class="col-sm-2 form-group">
          <label for="numero">NÚMERO</label>
          <input v-model="aluno.numero" type="number" class="form-control" id="numero" required/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-4 form-group">
          <label for="bairro">BAIRRO</label>
          <input v-model="aluno.bairro" type="text" class="form-control" id="bairro" required/>
        </div>
        <div class="col-sm-4 form-group">
          <label for="cidade">CIDADE</label>
          <input v-model="aluno.cidade" type="text" class="form-control" id="cidade" placeholder="CIDADE" required/>
        </div>
        <div class="col-sm-4 form-group">
          <label for="estado">ESTADO</label>
          <select v-model="aluno.estado" name="estado" id="estado" class="form-select">
            <option value="">Selecione o Estado</option>
            <option value="Acre">Acre</option>
            <option value="Alagoas">Alagoas</option>
            <option value="Amapá">Amapá</option>
            <option value="Amazonas">Amazonas</option>
            <option value="Bahia">Bahia</option>
            <option value="Ceará">Ceará</option>
            <option value="Distrito Federal">Distrito Federal</option>
            <option value="Espírito Santo">Espírito Santo</option>
            <option value="Goiás">Goiás</option>
            <option value="Maranhão">Maranhão</option>
            <option value="Mato Grosso">Mato Grosso</option>
            <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
            <option value="Minas Gerais">Minas Gerais</option>
            <option value="Pará">Pará</option>
            <option value="Paraíba">Paraíba</option>
            <option value="Paraná">Paraná</option>
            <option value="Pernambuco">Pernambuco</option>
            <option value="Piauí">Piauí</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="Rio Grande do Norte">Rio Grande do Norte</option>
            <option value="Rio Grande do Sul">Rio Grande do Sul</option>
            <option value="Rondônia">Rondônia</option>
            <option value="Roraima">Roraima</option>
            <option value="Santa Catarina">Santa Catarina</option>
            <option value="São Paulo">São Paulo</option>
            <option value="Sergipe">Sergipe</option>
            <option value="Tocantins">Tocantins</option>
          </select>
        </div>
      </div>

        <div class="row mt-3">
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 1</label>
            <input v-mask="'(##) #####-####'" v-model="aluno.telefone1" type="text" class="form-control" id="telefone1" required/>
          </div>
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 2</label>
            <input v-mask="'(##) #####-####'" v-model="aluno.telefone2" type="text" class="form-control" id="telefone1"/>
          </div>
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 3</label>
            <input v-mask="'(##) #####-####'" v-model="aluno.telefone3" type="text" class="form-control" id="telefone1"/>
          </div>
          <div class="col-sm-6 form-group">
            <label for="email">E-MAIL</label>
            <input v-model="aluno.email" type="text" class="form-control" id="email" placeholder="E-MAIL"/>
          </div>
        </div>

      <div class="row mt-3">
        <div class="col-sm-9 form-group">
          <label for="pai">NOME DO PAI</label>
          <input v-model="aluno.pai" type="text" class="form-control" id="pai" placeholder="Nome do Pai"/>
        </div>
        <div class="col-sm-3 form-group">
          <label for="cpf_pai">CPF DO PAI</label>
          <input v-mask="'###.###.###-##'" v-model="aluno.cpf_pai" type="text" class="form-control" id="cpf_pai" placeholder="CPF do Pai"/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-9 form-group">
          <label for="mae">NOME DA MÃE</label>
          <input v-model="aluno.mae" type="text" class="form-control" id="mae" placeholder="Nome da Mãe" required/>
        </div>
        <div class="col-sm-3 form-group">
          <label for="cpf_mae">CPF DA MÃE</label>
          <input v-mask="'###.###.###-##'" v-model="aluno.cpf_mae" type="text" class="form-control" id="cpf_mae" required placeholder="CPF da Mãe"/>
        </div>
      </div>

      <div class="row mt-3">

        <div class="col-sm form-group">
          <label for="alergia">ALERGIA</label>
          <input v-model="aluno.alergia" type="text" class="form-control" id="alergia" placeholder="ALERGIA"/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-6 form-group">

          <label for="saude">Tem plano de saúde?</label>
          <select v-model="aluno.saude" class="form-select" id="saude">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>

          <label for="hospital">Em caso de problemas de saúde ou acidentes pode levar para o hospital público</label>
          <select v-model="aluno.hospital" class="form-select" id="hospital">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>

          <label  for="redes">A imagem da criança poderá ser usada nas redes sociais?</label>
          <select v-model="aluno.redes" class="form-select" id="redes">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>

          <label for="sozinho">O aluno(a)  poderá ir para casa sozinho?</label>
          <select v-model="aluno.sozinho" class="form-select" id="sozinho">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>

        </div>
        <div class="col-sm-6 form-group">
          <label for="obs">OBSERVAÇÕES</label>
          <textarea v-model="aluno.obs" class="form-control" id="obs">
          </textarea>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-6 form-group">
          <input id="foto" class="d-none" type="text" name="foto">
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm form-group d-flex justify-content-end">
          <button class="btn btn-success">Salvar</button>
        </div>

      </div>

      </form>
    </div>
    </div>
  </div>
</template>

<style scoped>

</style>