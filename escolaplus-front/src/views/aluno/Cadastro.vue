<script setup>
  import NavAdmin from "@/components/NavAdmin.vue";
  import { ref, onBeforeUnmount, computed } from 'vue'
  import {useRouter} from 'vue-router'
  import {apiFetch} from "@/services/http.js";

  // v-model no componente: modelValue <-> update:modelValue
  const video = ref(null)
  const stream = ref(null)
  const cameraAtiva = ref(false)
  const fotoBase64 = ref('') // data:image/png;base64,....
  const inputFile = ref(null)
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
        router.push('/ficha/'+aluno.id)
      }else{
        const msg = await resposta.json()
        erro.value = `${resposta.status} - ${msg.message}`
      }
    }catch(error){
      erro.value = error
    }
  }

  async function buscarCep(){

    const resposta = await fetch('https://viacep.com.br/ws/'+aluno.value.cep+'/json')
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

  const iniciarCamera = async () => {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      video.value.srcObject = stream.value
      cameraAtiva.value = true
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err)
      alert('Não foi possível acessar a câmera.')
    }
  }

  const capturarFoto = async () => {
    if (!video.value) return

    // Cria um canvas em memória
    const canvas = document.createElement('canvas')
    const largura = video.value.videoWidth || 320
    const altura = video.value.videoHeight || 240

    canvas.width = largura
    canvas.height = altura

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video.value, 0, 0, largura, altura)

    // Gera o base64 da imagem (data URL)
    fotoBase64.value = canvas.toDataURL('image/png') // "data:image/png;base64,...."
    aluno.value.foto = fotoBase64.value
    aluno.value.foto = await reduzirImagem(fotoBase64.value, 320, 0.8)
  }

  const pararCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    cameraAtiva.value = false
  }

  const escolherArquivo = () => {
    inputFile.value.click()
  }

  const carregarFoto = (evento) => {
    const arquivo = evento.target.files[0]

    if (!arquivo) return

    const leitor = new FileReader()

    leitor.onload = async () => {
      //aluno.value.foto = leitor.result   // Base64 da imagem
      aluno.value.foto = await reduzirImagem(leitor.result, 320, 0.8)
    }

    leitor.readAsDataURL(arquivo) // Converte para Base64

  }

  async function reduzirImagem(base64, larguraMax = 320, qualidade = 0.8) {
    return new Promise(resolve => {
      const img = new Image()
      img.src = base64

      img.onload = () => {
        const canvas = document.createElement('canvas')

        const ratio = img.width / img.height
        canvas.width = larguraMax
        canvas.height = larguraMax / ratio

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // JPEG deixa MUITO menor que PNG
        const base64Reduzida = canvas.toDataURL("image/jpeg", qualidade)

        resolve(base64Reduzida)
      }
    })
  }


  // Garante que a câmera é desligada ao sair do componente
  onBeforeUnmount(() => {
    pararCamera()
  })

</script>

<template>
  <NavAdmin></NavAdmin>

  <div class="container-sm">
    <nav class="navbar navbar-light bg-light">
      <h3><i class="fas fa-user-graduate"></i>Cadastro de Aluno</h3>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <RouterLink to="/aluno/principal" class="btn btn-secondary">Voltar</RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container-sm">

    <div v-if="erro" class="alert alert-danger" role="alert">
      <strong>ERRO: </strong> {{ erro }}
    </div>

    <div class="row">
    <div class="col-sm-3">
      <h5 class="text-center">Foto do Aluno</h5>
      <video
          ref="video"
          autoplay
          playsinline
          width="310"
          height="230"
          class="border border-1"
      ></video>

      <div class="mt-2">
        <button @click="iniciarCamera" class="btn btn-sm btn-primary">Câmera</button>
        <button @click="capturarFoto" class="btn btn-sm btn-primary mx-1" :disabled="!cameraAtiva">Capturar</button>
        <button @click="pararCamera" class="btn btn-sm btn-primary me-1" :disabled="!cameraAtiva">Parar</button>

        <!-- NOVO: carregar foto do computador -->
        <button type="button" class="btn btn-sm btn-primary" @click="escolherArquivo">Carregar</button>
        <input type="file" ref="inputFile" @change="carregarFoto" accept="image/*" style="display:none">

      </div>

      <!-- PRÉVIA DA FOTO -->
      <div v-if="aluno.foto" class="mt-3">
        <h5 class="text-center">Foto capturada:</h5>
        <img :src="aluno.foto" alt="Foto da webcam" width="310" />
      </div>

      <!-- BASE64 PURO (OPCIONAL) -->
<!--      <div class="mt-3">-->
<!--        <h5>Base64:</h5>-->
<!--        <textarea :value="aluno.foto" cols="60" rows="5" readonly></textarea>-->
<!--      </div>-->
    </div>

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
          <input v-model="aluno.cep" @change="buscarCep" type="text" class="form-control" id="cep" placeholder="CEP"/>
        </div>
        <div class="col-sm-8 form-group">
          <label for="endereco">ENDEREÇO</label>
          <input v-model="aluno.endereco" type="text" class="form-control" id="endereco" placeholder="Endereço do Aluno"/>
        </div>
        <div class="col-sm-2 form-group">
          <label for="numero">NÚMERO</label>
          <input v-model="aluno.numero" type="number" class="form-control" id="numero"/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-4 form-group">
          <label for="bairro">BAIRRO</label>
          <input v-model="aluno.bairro" type="text" class="form-control" id="bairro"/>
        </div>
        <div class="col-sm-4 form-group">
          <label for="cidade">CIDADE</label>
          <input v-model="aluno.cidade" type="text" class="form-control" id="cidade" placeholder="CIDADE"/>
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
            <input v-model="aluno.telefone1" type="text" class="form-control" id="telefone1" required/>
          </div>
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 2</label>
            <input v-model="aluno.telefone2" type="text" class="form-control" id="telefone1" required/>
          </div>
          <div class="col-sm-2">
            <label for="telefone1">TELEFONE 3</label>
            <input v-model="aluno.telefone3" type="text" class="form-control" id="telefone1" required/>
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
          <input v-model="aluno.cpf_pai" type="text" class="form-control" id="cpf_pai" placeholder="CPF do Pai"/>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-9 form-group">
          <label for="mae">NOME DA MÃE</label>
          <input v-model="aluno.mae" type="text" class="form-control" id="mae" placeholder="Nome da Mãe"/>
        </div>
        <div class="col-sm-3 form-group">
          <label for="cpf_mae">CPF DA MÃE</label>
          <input v-model="aluno.cpf_mae" type="text" class="form-control" id="cpf_mae" placeholder="CPF da Mãe"/>
        </div>
      </div>

      <div class="row mt-3">

        <div class="col-sm-7 form-group">
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